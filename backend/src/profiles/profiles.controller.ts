import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('storage-workshop')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'List workshop profiles with temporary image URLs' })
  @ApiResponse({ status: 200, description: 'Profiles returned' })
  findAll() {
    return this.profilesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Save nickname and uploaded avatar key' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  create(@Body() createProfileDto: CreateProfileDto) {
    // Workshop flow: after upload succeeds, frontend saves only metadata here.
    return this.profilesService.create(createProfileDto);
  }
}
