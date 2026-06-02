import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { TokenRefillTask } from './tasks/token-refill.task';
import { UserToken } from './entities/user-token.entity';
import { UsersModule } from '../users/users.module';
import { FunctionsModule } from '../functions/functions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken]),
    ScheduleModule.forRoot(),
    UsersModule,
    FunctionsModule,
  ],
  controllers: [TokensController],
  providers: [TokensService, TokenRefillTask],
  exports: [TokensService],
})
export class TokensModule {}
