import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from 'src/drizzle/schema';

@Injectable()
export class UserService {
  constructor(@Inject('DB_CONNECTION') private readonly db: any) {}

  async getUsers() {
    try {
      const allUsers = await this.db.select().from(users);

      return {
        success: true,
        data: allUsers,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.db.select().from(users).where(eq(users.id, id));

      if (user.length === 0) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        data: user[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to fetch user by ID');
    }
  }
}
