import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administration, Channel, Membership, Message, Bannation, Mutation} from '../entities/channel.entity';
import { UsersService } from 'src/users/users.service';
import { Blockage } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Administration, Membership, Message, Blockage, UsersService, Bannation, Mutation])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}
