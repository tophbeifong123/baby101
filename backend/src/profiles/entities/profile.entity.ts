import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('workshop_profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 40 })
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  avatarBucket: string;

  @Column({ type: 'text' })
  avatarKey: string;

  @CreateDateColumn()
  createdAt: Date;
}
