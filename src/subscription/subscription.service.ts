import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { eq, and } from 'drizzle-orm';
import { subscriptions } from 'src/drizzle/schema';

@Injectable()
export class SubscriptionService {
  constructor(@Inject('DB_CONNECTION') private readonly db: any) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, userId: string) {
    try {
      const [newSubscription] = await this.db
        .insert(subscriptions)
        .values({
          ...createSubscriptionDto,
          userId,
        })
        .returning();

      return {
        success: true,
        message: 'Subscription created successfully',
        data: newSubscription,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create subscription');
    }
  }

  async getAllSubscriptions() {
    try {
      const allSubscriptions = await this.db.select().from(subscriptions);

      return {
        success: true,
        data: allSubscriptions,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch subscriptions');
    }
  }

  async getSubscriptions(userId: string) {
    try {
      const userSubscriptions = await this.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));

      return {
        success: true,
        data: userSubscriptions,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch user subscriptions',
      );
    }
  }

  async getSubscriptionById(id: string) {
    try {
      const subscription = await this.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, id));

      if (subscription.length === 0) {
        throw new NotFoundException('Subscription not found');
      }

      return {
        success: true,
        data: subscription[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to fetch subscription');
    }
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
    userId: string,
  ) {
    try {
      const [updatedSubscription] = await this.db
        .update(subscriptions)
        .set({
          ...updateSubscriptionDto,
          updatedAt: new Date(),
        })
        .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
        .returning();

      if (!updatedSubscription) {
        throw new NotFoundException('Subscription not found');
      }

      return {
        success: true,
        message: 'Subscription updated successfully',
        data: updatedSubscription,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to update subscription');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const [deletedSubscription] = await this.db
        .delete(subscriptions)
        .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
        .returning();

      if (!deletedSubscription) {
        throw new NotFoundException('Subscription not found');
      }

      return {
        success: true,
        message: 'Subscription deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to delete subscription');
    }
  }
}
