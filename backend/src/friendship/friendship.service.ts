import { Injectable } from '@nestjs/common';
import { Channel } from 'src/entities/channel.entity';
import { Friendship, Fstatus, User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {ChannelType, MemberTitle, Membership } from 'src/entities/channel.entity';
import { UsersGateway } from 'src/usersGateway/user.gateway';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship) private friendshipRepo: Repository<Friendship>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Membership) private memRepo: Repository<Membership>,
    private usersGateway: UsersGateway,
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
    
    async create(sender: number, receiver: number) {
      const friendship = await this.friendshipRepo.create();
      friendship.initiater = await this.userRepo.findOneBy({id: sender});
      friendship.receiver = await this.userRepo.findOneBy({id: receiver});
      friendship.status = Fstatus.PENDING
      await this.friendshipRepo.save(friendship);
      this.usersGateway.sendFriedRequest(receiver);
      return ;
    }
    
    async getFriends(id: number) {
      const friendship = await this.friendshipRepo.find({
        where: [
          { initiater: { id: id } , status: Fstatus.ACCEPTED },
        ],
        relations: ['receiver']
      });
      const receivers =  friendship.map(f => f.receiver);
      
      const friendship1 = await this.friendshipRepo.find({
        where: [
          { receiver: { id: id } , status: Fstatus.ACCEPTED },
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

async accept(id: number, sender: number) {
  
  const friendship = await this.friendshipRepo.findOne({
      where: [ { initiater: { id: sender }, receiver: { id: id } } ],
    });

    friendship.status = Fstatus.ACCEPTED;
    
    const user1 = await this.userRepo.findOneBy({id: id});
    const user2 = await this.userRepo.findOneBy({id: sender});

    const channelName : string =  (user1.id < user2.id) ? user1.username + user2.username : user2.username + user1.username;

    const ch = await this.channelRepo.findOne({
      where: {name: channelName, type: ChannelType.DIRECT},
    });

    if (!ch) {
      const channel = await this.channelRepo.create({name: channelName, type: ChannelType.DIRECT, image: "/img/more.svg" });
      const rt = await this.channelRepo.save(channel);
      const membership1 = await this.memRepo.create({channel: rt, member: user1, title: MemberTitle.MEMBER});
      const membership2 = await this.memRepo.create({channel: rt, member: user2, title: MemberTitle.MEMBER});
      await this.memRepo.save(membership1);
      await this.memRepo.save(membership2);      
    }

    return await this.friendshipRepo.save(friendship);
  }

  async status(id: number, receiver: number) {
    const friendship = await this.friendshipRepo.find({
      where: [
        { initiater: { id: id } ,  receiver: { id: receiver } },
        { initiater: { id: receiver } ,  receiver: { id: id } }
      ],
      relations: ['initiater']
    });

    if(friendship.length == 0)
      return {status: Fstatus.NONE};
    else if(friendship[0].status == Fstatus.ACCEPTED)
      return {status: Fstatus.ACCEPTED};
    else if(friendship[0].status == Fstatus.PENDING)
      return {status: Fstatus.PENDING, sender: friendship[0].initiater.id};

  }

  async remove(id: number, sender: number) {
    const friendship = await this.friendshipRepo.find({
      where: [
        { initiater: { id: id } ,  receiver: { id: sender } },
        { initiater: { id: sender } ,  receiver: { id: id } }
      ],
    });

    return await this.friendshipRepo.remove(friendship);
  }

  async search(channelid: number, id: number, query: string) {

    const friends = await this.getFriends(id);
    const findInFriends = friends.filter(f => f.username.toLowerCase().includes(query.toLowerCase()) && f.id != id);
    const channel = await this.channelRepo.findOne({
      where: {id: channelid},
      relations: ['memberships.member', "bannations.member"]
    });
    const banedUsers = channel?.bannations?.map(b => b.member).map(m => m.username);
    const members = channel?.memberships?.map(m => m.member).map(m => m.username);
    const rt = findInFriends.filter(f => (!banedUsers.includes(f.username) && !members.includes(f.username)));
    return rt;
  }
}
