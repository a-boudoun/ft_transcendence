import { Injectable } from '@nestjs/common';
import { FriendshipDTO } from './dto/create-friendship.dto';
import { Channel, Friendship, Fstatus, User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/create-user.dto';
import con from 'ormconfig';
import { ChannelsService } from 'src/channels/channels.service';
import { Bannation, ChannelType, MemberTitle, Membership } from 'src/entities/channel.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship) private friendshipRepo: Repository<Friendship>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Bannation) private bannationRepo: Repository<Bannation>,
    @InjectRepository(Membership) private memRepo: Repository<Membership>,

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
        ],
        relations: ['receiver']
      });
      const receivers =  friendship.map(f => f.receiver);
      
      const friendship1 = await this.friendshipRepo.find({
        where: [
          { receiver: { username: username } , status: Fstatus.ACCEPTED },
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
    const user1 = await this.userRepo.findOneBy({name: username});
    const user2 = await this.userRepo.findOneBy({name: sender});
    const channelName : string =  (user1.id < user2.id) ? user1.username + user2.username : user2.username + user1.username;
    console.log(channelName);
    const ch = await this.channelRepo.findOne({
      where: {name: channelName, type: ChannelType.DIRECT},
    });
    if (ch == null) {
    const channel = await this.channelRepo.create({name: channelName, type: ChannelType.DIRECT, image: "/img/more.svg" });
    const rt = await this.channelRepo.save(channel);
  const membership1 = await this.memRepo.create({channel: rt, member: user1, title: MemberTitle.MEMBER});
  const membership2 = await this.memRepo.create({channel: rt, member: user2, title: MemberTitle.MEMBER});
  await this.memRepo.save(membership1);
  await this.memRepo.save(membership2);      
  }
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

  async search(channelid: number,username: string, query: string) {

    const friends = await this.getFriends(username);
    const findInFriends = friends.filter(f => f.username.toLowerCase().includes(query.toLowerCase()) && f.username != username);
    console.log(findInFriends);
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
