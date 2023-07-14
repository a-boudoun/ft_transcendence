import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administration, Blockage, Channel, ChannelType, Friendship, GameHistory, Membership, Message, Sanction, Status, User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  
  getHello(): any {
    return ([{'name': 'Hello World!'}]);
  }
}
