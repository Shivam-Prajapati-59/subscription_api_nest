import {
  Inject,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { eq } from 'drizzle-orm';
import { users } from 'src/drizzle/schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB_CONNECTION') private readonly db: any,
    private readonly jwtService: JwtService,
  ) {}

  async signup(SignUpAuthDto: SignUpAuthDto) {
    try {
      const { name, email, password } = SignUpAuthDto;

      console.log('Checking for existing user...');
      // check if user already exists
      const existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser.length > 0) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [newUser] = await this.db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      const payload = {
        sub: newUser.id,
        email: newUser.email,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        success: true,
        message: 'User created successfully',
        data: {
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async signin(SignInAuthDto: SignInAuthDto) {
    try {
      const { email, password } = SignInAuthDto;

      // Find user by email
      const existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      // Check if user exists (array is empty)
      if (existingUser.length === 0) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const user = existingUser[0];

      // Compare password with await
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Create JWT payload with correct user data
      const payload = {
        sub: user.id,
        email: user.email,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        success: true,
        message: 'User signed in successfully',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      };
    } catch (error) {
      console.error('Error in signin:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to sign in');
    }
  }
}
