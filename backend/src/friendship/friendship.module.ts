import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Friendship, User } from 'src/entities/user.entity';
import { Channel, Membership } from 'src/entities/channel.entity';
import { UsersGateway } from '../usersGateway/user.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Channel, User, Membership])],
  controllers: [FriendshipController],
  providers: [FriendshipService, UsersGateway, JwtService],
})
export class FriendshipModule {}
