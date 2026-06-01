import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';

type ProfileResponse = Profile & {
  avatarUrl: string;
};

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly storageService: StorageService,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileResponse> {
    // Metadata goes to PostgreSQL. The image bytes stay in object storage.
    // This is the main Data vs Metadata idea students should remember.
    const profile = this.profileRepository.create({
      nickname: createProfileDto.nickname.trim(),
      avatarBucket: this.storageService.getBucket(),
      avatarKey: createProfileDto.avatarKey,
    });

    const savedProfile = await this.profileRepository.save(profile);
    return this.withAvatarUrl(savedProfile);
  }

  async findAll(): Promise<ProfileResponse[]> {
    const profiles = await this.profileRepository.find({
      order: { createdAt: 'DESC' },
    });

    return Promise.all(profiles.map((profile) => this.withAvatarUrl(profile)));
  }

  private async withAvatarUrl(profile: Profile): Promise<ProfileResponse> {
    // The database stores avatarKey, not a public image URL. We create a fresh
    // signed read URL whenever the frontend asks for profiles.
    return {
      ...profile,
      avatarUrl: await this.storageService.createReadUrl(profile.avatarKey),
    };
  }
}
