import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXP_D},
  })],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}
