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
    
    async getFriends(name: string) {
      const friendship = await this.friendshipRepo.find({
        where: [
          { initiater: { name: name } , status: Fstatus.ACCEPTED },
        ],
        relations: ['receiver']
      });
      const receivers =  friendship.map(f => f.receiver);
      
      const friendship1 = await this.friendshipRepo.find({
        where: [
          { receiver: { name: name } , status: Fstatus.ACCEPTED },
        ],
        relations: ['initiater']
      });
      
      const senders =  friendship1.map(f => f.initiater);
      
      if(receivers.length == 0 && senders.length == 0)
        return [];
      else if(receivers.length == 0)
        return senders;
      else if (senders.length == 0)
        return receivers;

      return receivers.concat(senders);
}

async accept(username: string, sender: string) {
  
  const friendship = await this.friendshipRepo.findOne({
      where: [ { initiater: { username: sender }, receiver: { username: username } } ],
    });
    friendship.status = Fstatus.ACCEPTED;
    return await this.friendshipRepo.save(friendship);
  }

  async status(username: string, sender: string) {
    console.log(username, sender);
    const friendship = await this.friendshipRepo.find({
      where: [
        { initiater: { username: username } ,  receiver: { username: sender } },
        { initiater: { username: sender } ,  receiver: { username: username } }
      ],
      relations: ['initiater']
    });

    if(friendship.length == 0)
      return {status: Fstatus.NONE};
    else if(friendship[0].status == Fstatus.ACCEPTED)
      return {status: Fstatus.ACCEPTED};
    else if(friendship[0].status == Fstatus.PENDING)
      return {status: Fstatus.PENDING, sender: friendship[0].initiater.name};

  }

  async remove(username: string, sender: string) {
    const friendship = await this.friendshipRepo.find({
      where: [
        { initiater: { username: username } ,  receiver: { username: sender } },
        { initiater: { username: sender } ,  receiver: { username: username } }
      ],
    });

    return await this.friendshipRepo.remove(friendship);
  }

}
