import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormconfig';
import { Administration, Blockage, Channel, Friendship, 
        GameHistory, Membership, Message, Sanction, 
        User } from './user.entity';
import { UsersModule } from './users/users.module';

@Module({
  // AuthModule, UsersModule,
  imports: [TypeOrmModule.forRoot(config),
            AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
