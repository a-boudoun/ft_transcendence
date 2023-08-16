import { Injectable } from '@nestjs/common';
import { FriendshipDTO } from './dto/create-friendship.dto';
import { Friendship, Fstatus, User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/create-user.dto';
import con from 'ormconfig';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship) private friendshipRepo: Repository<Friendship>,
    @InjectRepository(User) private userRepo: Repository<User>,
    ) {}
    
    async friendReq(username : string) {
      const friendship = await this.friendshipRepo.find({
        where: [
          { receiver: { username: username }  , status: Fstatus.PENDING},
        ],
        relations: ['initiater']
      });

      const senders =  friendship.map(f => f.initiater);

      return (senders.length == 0 ? [] : senders);
    }
    
  async create(sender: string, receiver: string) {
    const friendship = await this.friendshipRepo.create();
    friendship.initiater = await this.userRepo.findOneBy({name : sender});
    friendship.receiver = await this.userRepo.findOneBy({name : receiver});
    friendship.status = Fstatus.PENDING;
    return await this.friendshipRepo.save(friendship);
  }

  async getFriends(username: string) {
    const friendship = await this.friendshipRepo.find({
      where: [
        { initiater: { username: username } , status: Fstatus.ACCEPTED },
        { receiver: { username: username } , status: Fstatus.ACCEPTED }
      ],
      relations: ['receiver']
    });

    const receivers =  friendship.map(f => f.receiver);
    const senders =  friendship.map(f => f.initiater);

    if(receivers.length == 0 && senders.length == 0)
      return [];
    else if(receivers.length == 0)
      return senders;
    else
      return receivers;
    
    return receivers.concat(senders);
  }

  findOne(id: number) {
    return `This action returns a #${id} friendship`;
  }

  async accept(username: string, sender: string) {

    const friendship = await this.friendshipRepo.findOne({
      where: [ { initiater: { username: sender }, receiver: { username: username } } ],
    });
    friendship.status = Fstatus.ACCEPTED;
    return await this.friendshipRepo.save(friendship);
  }

  remove(id: number) {
    return `This action removes a #${id} friendship`;
  }
}
