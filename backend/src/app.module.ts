import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormconfig';
import { Administration, Blockage, Channel, Friendship, 
        GameHistory, Membership, Message, Sanction, 
        User } from './user.entity';
import { DataModule } from './data/data.module';

@Module({
  // AuthModule, UsersModule,
  imports: [TypeOrmModule.forRoot(config),
            TypeOrmModule.forFeature([User, Channel, Message,
            Membership, Administration, Sanction, Friendship,
            Blockage, GameHistory]),
            DataModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
