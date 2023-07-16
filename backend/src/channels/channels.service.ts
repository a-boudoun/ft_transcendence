import { Injectable } from '@nestjs/common';
import { ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from '../entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    private jwtService: JwtService
  ) {}
  create(ChannelDTO: ChannelDTO) {
    const channel = this.channelRepo.create(ChannelDTO);
    return this.channelRepo.save(channel);
  }

  findAll() {
    return `This action returns all channels`;
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
