import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthModule } from './auth/auth.module';
import { FunctionsModule } from './functions/functions.module';
import { User } from './users/entities/user.entity';
import { UserToken } from './tokens/entities/user-token.entity';
import { Function } from './functions/entities/function.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, UserToken, Function],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TokensModule,
    AuthModule,
    FunctionsModule,
  ],
})
export class AppModule {}
