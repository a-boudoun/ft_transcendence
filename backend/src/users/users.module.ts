import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blockage, Friendship, User } from '../entities/user.entity';
import { FriendshipService } from '../friendship/friendship.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blockage, Friendship])],
  controllers: [UsersController],
  providers: [UsersService, FriendshipService],
  exports: [UsersService]
})
export class UsersModule {}
