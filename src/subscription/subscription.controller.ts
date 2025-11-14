import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  getAllSubsciptions() {
    return this.subscriptionService.getAllSubsciptions();
  }

  @Get(':id')
  getall(@Param('id') id: string) {
    return this.subscriptionService.getSubscriptions(+id);
  }
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Put(':id')
  updateSusbscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.updateSusbscription(
      +id,
      updateSubscriptionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }

  @Get('/user/:id')
  getSubscriptionsByUserId(@Param('id') id: string) {
    // return this.subscriptionService.getSubscriptionsByUserId(+id);
  }

  @Put('/:id/cancel')
  cancelSubscription(@Param('id') id: string) {
    // return this.subscriptionService.cancelSubscription(+id);
  }

  @Get('/upcoming-renewals')
  getUpcomingRenewals() {
    // return this.subscriptionService.getUpcomingRenewals();
  }
}
