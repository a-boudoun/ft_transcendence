import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Friendship, User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Channel } from 'src/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Channel, User]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXP_D},
  })],
  controllers: [FriendshipController],
  providers: [FriendshipService]
})
export class FriendshipModule {}
