import { Controller, Get, UseGuards } from '@nestjs/common'; // Added Req
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get.user.decorator';
import { JwtAuthGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findAll(@GetUser() user: User) {
    console.log();
    return user;
  }
}
