import {
  Inject,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { eq } from 'drizzle-orm';
import { users } from 'src/drizzle/schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB_CONNECTION') private readonly db: any,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createAuthDto: CreateAuthDto) {
    try {
      const { name, email, password } = createAuthDto;

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
}
