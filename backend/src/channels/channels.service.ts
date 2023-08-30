import { Injectable } from '@nestjs/common';
import { AdministrationDTO, ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Administration, Channel, MemberTitle, Membership, Message } from '../entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import con from 'ormconfig';
import { UsersService } from '../users/users.service';
import { ChannelType } from '../entities/channel.entity';
import { MembershipDTO } from './dto/create-channel.dto';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Console } from 'console';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(Membership) private membershipRepo: Repository<Membership>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) { }
  async create(channel: ChannelDTO) {

    const newChannel : Channel = new Channel();
    newChannel.name = channel.name;
    newChannel.image = channel.image;
    newChannel.type = channel.type;
    newChannel.password = channel.password;
    const cchannel = this.channelRepo.create(channel);
    const ret = await this.channelRepo.save(channel);
    const membership : MembershipDTO  = this.membershipRepo.create();
    membership.channel = ret;
    membership.member = channel.owner;
    membership.title = MemberTitle.OWNER;
    await this.membershipRepo.save(membership);
    const channel1 = await this.channelRepo.findOne(({
      where: {
        id: ret.id,
        
      },
      relations: [ 'memberships.member'],
    }));
    return channel1;
  }

  findAll() {
    return this.channelRepo.find(
      { relations: ['messages', 'memberships.member'] });
  }

  async findOne(id: number) {
    return this.channelRepo.findOne({
      where: {
        id: id,
      },
      relations: ['messages.sender', 'memberships.member'],
    });
  }

  async update(id: number, updateChannelDto: any) {
    let channel = await this.findOne(id);

   console.log(updateChannelDto);
   if(updateChannelDto.name != channel.name)
     channel.name = updateChannelDto.name;
    if(updateChannelDto.image != channel.image)
      channel.image = updateChannelDto.image;
    if(updateChannelDto.password != channel.password)
      channel.password = updateChannelDto.password;
    if(updateChannelDto.type != channel.type)
      channel.type = updateChannelDto.type;

    return this.channelRepo.save(channel);
  }

  async remove(id: number) {
     const membership = await this.findOne(id);
      membership.memberships.forEach(async (membership) => {
        await this.membershipRepo.delete(membership.id);
      });
      membership.messages.forEach(async (message) => {
        await this.messageRepo.delete(message.id);
      });
      
     
    return this.channelRepo.delete(id);
  }

  async removeMembership(channelId: number, membershipId: number) {
    return this.membershipRepo.delete(membershipId);
  }

  async joinChannel(id: number, user: UserDTO) {
    const channel = await this.findOne(id);
    const membership = await this.membershipRepo.create({channel: channel, member: user, title: MemberTitle.MEMBER});
    const saved = await this.membershipRepo.save(membership)
    const channel1 = await this.findOne(saved.channel.id);
    return channel1;
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
      where: {
        id: channelId,
        
      },
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


}
