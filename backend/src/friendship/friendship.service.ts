import { Injectable } from '@nestjs/common';
import { FriendshipDTO } from './dto/create-friendship.dto';
import { Friendship, Fstatus } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FriendshipService {
  friendReq(username: string) {
    return this.friendshipRepo.find({
      where: [
        { receiver: { username: username } },
        { status: Fstatus.PENDING }
      ],
      relations: ['initiater']
    });
  }
  constructor(
    @InjectRepository(Friendship) private friendshipRepo: Repository<Friendship>,
  ) {}
  
  create(FriendshipDTO: FriendshipDTO) {
    const friendship = this.friendshipRepo.create(FriendshipDTO);
    return this.friendshipRepo.save(friendship);
  }

  getFriends(username: string) {
    return this.friendshipRepo.find({
      where: [
        { initiater: { username: username } },
        { receiver: { username: username } },
        { status: Fstatus.ACCEPTED }
      ],
      relations: ['initiater', 'receiver']
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} friendship`;
  }

  update(id: number, FriendshipDTO: FriendshipDTO) {
    
  }

  remove(id: number) {
    return `This action removes a #${id} friendship`;
  }
}
