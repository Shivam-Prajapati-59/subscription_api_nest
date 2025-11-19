import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import configuration from './config/configuration';
import { AuthMiddleware } from './middleware/auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    SubscriptionModule,
    DrizzleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/v1/auth/sign-up', method: RequestMethod.POST },
        { path: 'api/v1/auth/sign-in', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
