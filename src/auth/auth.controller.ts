import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signup(@Body() SignUpAuthDto: SignUpAuthDto) {
    return this.authService.signup(SignUpAuthDto);
  }

  @Post('sign-in')
  signin(@Body() SignInAuthDto: SignInAuthDto) {
    return this.authService.signin(SignInAuthDto);
  }

  @Post('sign-out')
  signout(@Body() createAuthDto: SignUpAuthDto) {
    // return this.authService.signout(createAuthDto);
  }
}
