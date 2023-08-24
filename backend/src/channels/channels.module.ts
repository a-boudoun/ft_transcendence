import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administration, Channel, Membership, Message } from '../entities/channel.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Administration, Membership, Message, UsersService]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXP_D},
  })],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}
