import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/dtos/Register.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email,
        },
      });
      if (!user) {
        return 'User not found';
      }
      const valid = await argon2.verify(user.password, loginDto.password);
      if (!valid) {
        return 'Invalid password';
      }
      // Remove password from the response
      delete user.password;
      return this.signToken(user.id, user.email);
    } catch (e) {
      return 'Something went wrong';
    }
  }

  async register(registerDto: RegisterDto) {
    // Hash the password
    registerDto.password = await argon2.hash(registerDto.password);
    // Create a new user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          name: registerDto.name,
          password: registerDto.password,
        },
      });

      // Remove password from the response
      delete user.password;

      return user;
    } catch (e) {
      if (e.code === 'P2002') {
        return 'Email already exists';
      }
      return 'Something went wrong';
    }
  }

  async signToken(
    userID: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const data = { userID, email };
    const secret = this.config.get<string>('JWT_SECRET');
    const token = await this.jwt.signAsync(data, {
      expiresIn: '10m',
      secret: secret,
    });

    return { accessToken: token };
  }
}
