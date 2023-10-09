import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blockage, Friendship, User } from '../entities/user.entity';
import { UsersGateway } from '../usersGateway/user.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, Blockage, User])],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway, JwtService],
  exports: [UsersService]
})
export class UsersModule {}
