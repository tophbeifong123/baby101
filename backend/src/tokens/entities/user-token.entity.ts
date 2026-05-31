import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Function } from '../../functions/entities/function.entity';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  functionId: string;

  @ManyToOne(() => Function, (func) => func.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'functionId' })
  function: Function;

  @Column({ type: 'int', default: 0 })
  remaining: number;

  @Column({ type: 'int', default: 100 })
  maxLimit: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
