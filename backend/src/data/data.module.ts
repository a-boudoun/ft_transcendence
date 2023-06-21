import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { Administration, Blockage, Channel, Friendship, 
  GameHistory, Membership, Message, Sanction, 
  User } from './entities/datum.entity';

@Module({
  imports: [TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([User, Channel, Message,
    Membership, Administration, Sanction, Friendship,
    Blockage, GameHistory])],
  controllers: [DataController],
  providers: [DataService]
})
export class DataModule {}
