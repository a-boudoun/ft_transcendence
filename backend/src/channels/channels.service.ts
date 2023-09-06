import { Injectable } from '@nestjs/common';
import { AdministrationDTO, ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Administration, Bannation, Channel, MemberTitle, Membership, Message, Mutation } from '../entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import con from 'ormconfig';
import { UsersService } from '../users/users.service';
import { ChannelType } from '../entities/channel.entity';
import { MembershipDTO } from './dto/create-channel.dto';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { Not } from 'typeorm';
import { use } from 'matter-js';
import { Console } from 'console';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Membership) private membershipRepo: Repository<Membership>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Bannation) private bannationRepo: Repository<Bannation>,
    @InjectRepository(Mutation) private mutationRepo: Repository<Mutation>,
  ) { }
  async create(channel: ChannelDTO) {

    const newChannel : Channel = new Channel();
    newChannel.name = channel.name;
    newChannel.image = channel.image;
    newChannel.type = channel.type;
   if(channel.password != '')
   {
     const salt = await bcrypt.genSalt();
     const hashedPassword = await bcrypt.hash(channel.password, salt);
     newChannel.password = hashedPassword;
    }
    else
      newChannel.password = '';
    const cchannel = this.channelRepo.create(newChannel);
    const ret = await this.channelRepo.save(cchannel);

    const membership : MembershipDTO  = this.membershipRepo.create();
    membership.channel = ret;
    membership.member = channel.owner;
    membership.title = MemberTitle.OWNER;
    await this.membershipRepo.save(membership);


    const channel1 = await this.channelRepo.findOne({
      where: {
        id: ret.id,
        
      },
      relations: [ 'memberships.member'],
    });
    return channel1;
  }

  async findAll(username: string) {
    const banedid : number[] = await this.bannationRepo
      .createQueryBuilder('bannation')
      .innerJoin('bannation.channel', 'channel')
      .innerJoin('bannation.member', 'member')
      .select('channel.id')
      .where('member.username = :username', { username: username })
      .getRawMany()
      .then((res) => res.map((res) => res.channel_id));
  
  
    let channels = await this.channelRepo.find({
      where: {
        type: Not(ChannelType.DIRECT),
      
      },
      relations: ['messages', 'memberships.member', 'bannations.member'],
    });
    channels = channels.filter((channel) => !banedid.includes(channel.id));
    return channels;
  }
  
  

  async findOne1(id: number, username: string) {

    let channel= await this.channelRepo.findOne({
      where: {
        id: id,
      },
      relations: ['messages.sender', 'memberships.member', 'bannations.member', 'mutations.member'],
    });
    if(!channel)
      return null;
    const ban = await this.isBanned(id, username);
    if (ban) {
      return null;
    }
    return channel;

  }
  async findOne(id: number) {
    return this.channelRepo.findOne({
      where: {
        id: id,
      },
      relations: ['messages.sender', 'memberships.member', 'bannations.member', 'mutations.member'],
    });
  }

  async update(id: number, updateChannelDto: any) {
    let channel = await this.findOne(id);
   if(updateChannelDto.name != channel.name)
     channel.name = updateChannelDto.name;
    if(updateChannelDto.image != channel.image)
      channel.image = updateChannelDto.image;
    if(!(await bcrypt.compare(updateChannelDto.password, channel.password)))
    {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateChannelDto.password, salt);
      channel.password = hashedPassword;
    }
    if(updateChannelDto.type != channel.type)
      channel.type = updateChannelDto.type;

    return this.channelRepo.save(channel);
  }

  async remove(id: number) {
     const channel = await this.findOne(id);
      
       
        this.messageRepo.createQueryBuilder('message')
        .delete()
        .where('channel.id = :id', { id: id })
        .execute();
        
      this.membershipRepo.createQueryBuilder('membership')
        .delete()
        .where('channel.id = :id', { id: id })
        .execute();
      this.bannationRepo.createQueryBuilder('bannation')
        .delete()
        .where('channel.id = :id', { id: id })
        .execute();
      this.mutationRepo.createQueryBuilder('mutation')
        .delete()
        .where('channel.id = :id', { id: id })
        .execute();
      
     
    return this.channelRepo.delete(id);
  }

  async removeMembership(channelId: number, membershipId: number) {
    
    return this.membershipRepo.delete(membershipId);
  }


  async joinChannel(id: number, user: UserDTO, password: string) {
    const channel = await this.findOne(id);
    const isMatch = await bcrypt.compare(password, channel.password);
    if (!isMatch && channel.type === ChannelType.PROTECTED) {
      return "Wrong password";
    }
    const membership = await this.membershipRepo.create({channel: channel, member: user, title: MemberTitle.MEMBER});
    const saved = await this.membershipRepo.save(membership)
    const channel1 = await this.findOne(saved.channel.id);
    return channel1;
  }

  async addFriendtoChannel(channelId: number, friend: UserDTO) {
    const channel = await this.findOne(channelId);
    const membership = await this.membershipRepo.create({channel: channel, member: friend, title: MemberTitle.MEMBER});
    return this.membershipRepo.save(membership);
  }
  
  async updateMembershipTitle(channelId: number, membershipId: number)
  {
   
    const channel = await this.findOne(channelId);
   
    const membership = channel.memberships.find(
      (membership) => membership.id === membershipId,
    );
    if(membership.title === MemberTitle.ADMIN)
        membership.title = MemberTitle.MEMBER;
    else if (membership.title === MemberTitle.MEMBER)
        membership.title = MemberTitle.ADMIN;
    return  this.membershipRepo.save(membership);
  }

  async addmessge(channelId: number, message: string, username: string) {
    
    const channel = await this.channelRepo.findOne(({
      where: {id: channelId,},
      relations: [ 'memberships.member'],
    }));

    const user = channel?.memberships?.find((membership : any) => membership.member.username === username)?.member;
    const newMessage = await this.messageRepo.create({
      channel: channel,
      sender: user,
      content: message,
    });
    return this.messageRepo.save(newMessage);
  }

  async banner(channelId: number, username: string) {
    const channel = await this.findOne(channelId);
    const memship = await channel.memberships.find(
      (membership : MembershipDTO) => membership.member.username === username,
    );
    await this.membershipRepo.delete(memship.id);
    const bannation = await this.bannationRepo.create({
      channel: channel,
      member: memship.member,
    });
    return this.bannationRepo.save(bannation);
  }


  async mut(channelId: number, id: number, duration: number) {
    const channel = await this.findOne(channelId);
    const memship = await channel.memberships.find(
      (membership : MembershipDTO) => membership.member.id === id,
    );
    const userMutation = await this.mutationRepo.findOne({
      where: {
        channel: { id: channel.id},
        member: { id: memship.member.id},
      },
    });
    if (userMutation) {
      userMutation.duration = duration;
      userMutation.mut_date = new Date();
      return this.mutationRepo.save(userMutation);
    }
    const mut = await this.mutationRepo.create({
      channel: channel,
      member: memship.member,
      mut_date: new Date(),
      duration: duration,
    });
    return this.mutationRepo.save(mut);
  }

  async isMuted(channelId: number, username: string) {
    const channel = await this.findOne(channelId);
    if(!channel || !channel.mutations || channel.mutations.length === 0)
      return false; 
    const mut = await channel.mutations.find(
      (mutation : Mutation) => mutation.member.username === username,
    );
    if (mut) {
      const now = new Date();
      const duration = mut.mut_date.getTime() + (mut.duration * 60000);
      if (now.getTime() < duration) {
        return true;
      }
    }
    return false;
  }

  async getDirectChannel(username: string) {
    const channel = await this.channelRepo.find({
      where: {
        type: ChannelType.DIRECT,
      },
    

    });
    return channel;
  }

  async unban(banId: number) {
    const ban = await this.bannationRepo.findOne({
      where: {
        id: banId,
      },
      relations: ['channel', 'member'],
    });
    this.addFriendtoChannel(ban.channel.id, ban.member);
    return this.bannationRepo.delete(banId);
  }

  async isBanned(channelId: number, username: string) {
    const channel = await this.findOne(channelId);
    const ban = await channel.bannations.find(
      (bannation : Bannation) => bannation.member.username === username,
    );
    if (ban) {
      return true;
    }
    return false;
  }

}

