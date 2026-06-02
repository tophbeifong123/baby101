import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('tokens')
@Controller('users/:userId/tokens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new token for user' })
  @ApiResponse({ status: 201, description: 'Token created successfully' })
  @ApiResponse({ status: 400, description: 'Token already exists' })
  create(
    @Param('userId') userId: string,
    @Body() createTokenDto: CreateTokenDto,
  ) {
    return this.tokensService.create(userId, createTokenDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tokens for user' })
  @ApiResponse({ status: 200, description: 'List of tokens' })
  findAll(@Param('userId') userId: string) {
    return this.tokensService.findAllByUser(userId);
  }

  @Get(':functionId')
  @ApiOperation({ summary: 'Get a specific token' })
  @ApiResponse({ status: 200, description: 'Token details' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  findOne(
    @Param('userId') userId: string,
    @Param('functionId') functionId: string,
  ) {
    return this.tokensService.findOne(userId, functionId);
  }

  @Post(':functionId/use')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Use token (decrement remaining)' })
  @ApiResponse({ status: 200, description: 'Returns remaining count' })
  @ApiResponse({ status: 400, description: 'Token depleted' })
  useToken(
    @Param('userId') userId: string,
    @Param('functionId') functionId: string,
  ) {
    return this.tokensService.useToken(userId, functionId);
  }

  @Put(':functionId/refill')
  @ApiOperation({ summary: 'Refill token to maxLimit' })
  @ApiResponse({ status: 200, description: 'Token refilled successfully' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  refill(
    @Param('userId') userId: string,
    @Param('functionId') functionId: string,
  ) {
    return this.tokensService.refill(userId, functionId);
  }
}
