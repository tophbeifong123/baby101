import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { FunctionsService } from './functions.service';
import { CreateFunctionDto } from './dto/create-function.dto';
import { UpdateFunctionDto } from './dto/update-function.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('functions')
@Controller('functions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FunctionsController {
  constructor(private readonly functionsService: FunctionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new function' })
  @ApiResponse({ status: 201, description: 'Function created successfully' })
  @ApiResponse({ status: 409, description: 'Function already exists' })
  create(@Body() createFunctionDto: CreateFunctionDto) {
    return this.functionsService.create(createFunctionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all functions' })
  @ApiResponse({ status: 200, description: 'List of all functions' })
  findAll() {
    return this.functionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a function by ID' })
  @ApiResponse({ status: 200, description: 'Function details' })
  @ApiResponse({ status: 404, description: 'Function not found' })
  findOne(@Param('id') id: string) {
    return this.functionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a function' })
  @ApiResponse({ status: 200, description: 'Function updated successfully' })
  @ApiResponse({ status: 404, description: 'Function not found' })
  update(@Param('id') id: string, @Body() updateFunctionDto: UpdateFunctionDto) {
    return this.functionsService.update(id, updateFunctionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a function' })
  @ApiResponse({ status: 204, description: 'Function deleted successfully' })
  @ApiResponse({ status: 404, description: 'Function not found' })
  remove(@Param('id') id: string) {
    return this.functionsService.remove(id);
  }
}
