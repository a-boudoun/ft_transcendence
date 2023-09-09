import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';
import { Blockage, Friendship, GameHistory, User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FriendshipService } from 'src/friendship/friendship.service';
import { Channel, Membership } from 'src/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameHistory, User, Blockage, Friendship, Channel, Membership])],
  controllers: [GameHistoryController],
  providers: [GameHistoryService, UsersService, FriendshipService],
})
export class GameHistoryModule {}
