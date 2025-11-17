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
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('/sign-in')
  signin(@Body() createAuthDto: CreateAuthDto) {
    // return this.authService.signin(createAuthDto);
  }

  @Post('/sign-out')
  signout(@Body() createAuthDto: CreateAuthDto) {
    // return this.authService.signout(createAuthDto);
  }
}
