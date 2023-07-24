import { Injectable } from '@nestjs/common';
import { AdministrationDTO, ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Administration, Channel } from '../entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import con from 'ormconfig';
@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    // @InjectRepository(Channel) private adminRepo: Repository<Administration>,
    private jwtService: JwtService
  ) {}
  async create(ChannelDTO: ChannelDTO) {
    const channel = this.channelRepo.create(ChannelDTO);
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
    return this.channelRepo.save(channel);
  }

  findAll() {
    return this.channelRepo.find();
  }

  findOne(id: number) {
    const channel = this.channelRepo.findOneBy({id});
    return channel;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
