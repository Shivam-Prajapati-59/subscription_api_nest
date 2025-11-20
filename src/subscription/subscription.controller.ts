import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  getAllSubscriptions() {
    return this.subscriptionService.getAllSubscriptions();
  }

  @Get('user/me')
  getMySubscriptions(@Request() req) {
    const userId = req['user'].sub;
    return this.subscriptionService.getSubscriptions(userId);
  }

  @Get(':id')
  getSubscriptionById(@Param('id') id: string) {
    return this.subscriptionService.getSubscriptionById(id);
  }

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Request() req) {
    const userId = req['user'].sub;
    return this.subscriptionService.create(createSubscriptionDto, userId);
  }

  @Put(':id')
  updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @Request() req,
  ) {
    const userId = req['user'].sub;
    return this.subscriptionService.updateSubscription(
      id,
      updateSubscriptionDto,
      userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req['user'].sub;
    return this.subscriptionService.remove(id, userId);
  }
}
