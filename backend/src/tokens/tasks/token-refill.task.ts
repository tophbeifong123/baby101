import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TokensService } from '../tokens.service';

@Injectable()
export class TokenRefillTask {
  private readonly logger = new Logger(TokenRefillTask.name);

  constructor(private readonly tokensService: TokensService) {}

  @Cron('*/5 * * * *')
  async handleCron() {
    this.logger.log('Running token refill job...');
    await this.tokensService.refillAll();
    this.logger.log('Token refill completed.');
  }
}
