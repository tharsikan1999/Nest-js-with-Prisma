import { Controller, Get, UseGuards, Req } from '@nestjs/common'; // Added Req
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // Added import for Request

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findAll(@Req() req: Request) {
    return req.user;
  }
}
