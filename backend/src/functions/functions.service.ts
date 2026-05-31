import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Function } from './entities/function.entity';
import { CreateFunctionDto } from './dto/create-function.dto';
import { UpdateFunctionDto } from './dto/update-function.dto';

@Injectable()
export class FunctionsService {
  constructor(
    @InjectRepository(Function)
    private readonly functionRepository: Repository<Function>,
  ) {}

  async create(createFunctionDto: CreateFunctionDto): Promise<Function> {
    const existing = await this.functionRepository.findOne({
      where: { name: createFunctionDto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Function with name '${createFunctionDto.name}' already exists`,
      );
    }

    const func = this.functionRepository.create(createFunctionDto);
    return this.functionRepository.save(func);
  }

  async findAll(): Promise<Function[]> {
    return this.functionRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Function> {
    const func = await this.functionRepository.findOne({ where: { id } });
    if (!func) {
      throw new NotFoundException(`Function with ID ${id} not found`);
    }
    return func;
  }

  async findByName(name: string): Promise<Function> {
    const func = await this.functionRepository.findOne({ where: { name } });
    if (!func) {
      throw new NotFoundException(`Function with name '${name}' not found`);
    }
    return func;
  }

  async update(id: string, updateFunctionDto: UpdateFunctionDto): Promise<Function> {
    const func = await this.findOne(id);
    Object.assign(func, updateFunctionDto);
    return this.functionRepository.save(func);
  }

  async remove(id: string): Promise<void> {
    const func = await this.findOne(id);
    await this.functionRepository.remove(func);
  }
}
