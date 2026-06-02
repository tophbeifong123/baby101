import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from './entities/user-token.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { FunctionsService } from '../functions/functions.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(UserToken)
    private readonly tokenRepository: Repository<UserToken>,
    private readonly functionsService: FunctionsService,
  ) {}

  async findAllByUser(userId: string): Promise<UserToken[]> {
    return this.tokenRepository.find({
      where: { userId },
      relations: { function: true },
    });
  }

  async findOne(userId: string, functionId: string): Promise<UserToken> {
    const token = await this.tokenRepository.findOne({
      where: { userId, functionId },
      relations: { function: true },
    });
    if (!token) {
      throw new NotFoundException(
        `Token with functionId ${functionId} not found for user ${userId}`,
      );
    }
    return token;
  }

  async create(userId: string, createTokenDto: CreateTokenDto): Promise<UserToken> {
    // Validate function exists
    await this.functionsService.findOne(createTokenDto.functionId);

    const existingToken = await this.tokenRepository.findOne({
      where: { userId, functionId: createTokenDto.functionId },
    });

    if (existingToken) {
      throw new BadRequestException(
        `Token with functionId ${createTokenDto.functionId} already exists for this user`,
      );
    }

    const token = this.tokenRepository.create({
      userId,
      functionId: createTokenDto.functionId,
      maxLimit: createTokenDto.maxLimit,
      remaining: createTokenDto.maxLimit,
    });

    return this.tokenRepository.save(token);
  }

  async useToken(userId: string, functionId: string): Promise<{ remaining: number }> {
    const token = await this.findOne(userId, functionId);

    if (token.remaining <= 0) {
      throw new BadRequestException('Token depleted. Please refill.');
    }

    token.remaining -= 1;
    await this.tokenRepository.save(token);

    return { remaining: token.remaining };
  }

  async refill(userId: string, functionId: string): Promise<UserToken> {
    const token = await this.findOne(userId, functionId);
    token.remaining = token.maxLimit;
    return this.tokenRepository.save(token);
  }

  async refillAll(): Promise<void> {
    const tokens = await this.tokenRepository.find();
    for (const token of tokens) {
      token.remaining = token.maxLimit;
    }
    await this.tokenRepository.save(tokens);
  }
}
