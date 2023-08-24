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

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Membership) private membershipRepo: Repository<Membership>
    @InjectRepository(Message) private messageRepo: Repository<Message>
  ) { }
  async create(channel: ChannelDTO) {
    // const user = await this.userService.findOne(username);
    // console.log(user.username);

    console.log(channel);

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

    console.log(membership);
    await this.membershipRepo.save(membership);
    
    // let administrators: AdministrationDTO;
    // administrators.channel = <ChannelDTO>(await this.channelRepo.save(channel));
    // administrators.admin = ChannelDTO.owner;
    // await this.channelRepo.save(channel);
    // const admin = this.adminRepo.create();
    // console.log(channel.name);
    // admin.admin = channel.owner;
    // admin.channel = channel;
    // await this.adminRepo.save(admin);
    // console.log(admin);
    return ret;
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
      relations: ['messages', 'memberships.member'],
    });
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return this.channelRepo.update(id, updateChannelDto);
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }

  async joinChannel(id: number, user: UserDTO) {
    const channel = await this.findOne(id);
    const membership = await this.membershipRepo.create({channel: channel, member: user, title: MemberTitle.MEMBER});
    return this.membershipRepo.save(membership);
  }


  
  async updateMembershipTitle(channelId: number,membershipId: number)
  {
    const channel = await this.channelRepo.findOne(({
      where: {
        id: channelId,
      },
      relations: [ 'memberships'],
    }));

    
    const membership = channel.memberships.find(
      (membership) => membership.id === Number(membershipId),
    );

    membership.title = MemberTitle.MEMBER;
    this.membershipRepo.save(membership);

    return  this.membershipRepo.save(membership);
  }

  async addmessge(channelId: number, message: string, username: string) {
    const channel = await this.channelRepo.findOne(({
      where: {
        id: channelId,
      }
    }));

    const user = await this.userRepo.findOne(username);

    const newMessage = await this.messageRepo.create({
      channel: channel,
      sender: user,
      content: message,
    });

    return this.messageRepo.save(newMessage);
  }
}
