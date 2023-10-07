import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blockage, Friendship, User } from '../entities/user.entity';
import { FriendshipService } from '../friendship/friendship.service';
import { Channel, Membership } from '../entities/channel.entity';
import { UsersGateway } from '../usersGateway/user.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Channel, Blockage, User, Membership])],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  exports: [UsersService]
})
export class UsersModule {}
