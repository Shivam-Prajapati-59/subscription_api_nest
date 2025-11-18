import { PartialType } from '@nestjs/mapped-types';
import { SignInAuthDto } from './signin-auth.dto';

export class UpdateAuthDto extends PartialType(SignInAuthDto) {}
