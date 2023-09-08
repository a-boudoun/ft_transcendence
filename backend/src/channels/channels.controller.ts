import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { UseGuards } from '@nestjs/common';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { MemberTitle, Membership } from 'src/entities/channel.entity';
import con from 'ormconfig';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('/createChannel')
  @UseGuards(Jwt2faAuthGuard)
  create( @Body() channelDTO: ChannelDTO) {
    return this.channelsService.create(channelDTO);
  }
  
  @Get()
  findAll() {
    return this.channelsService.findAll();
  }
  
  @Get('/me')
  me() {
    return this.channelsService.findOne(2);
  }
  
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    console.log(id, updateChannelDto);
  
    return this.channelsService.update(+id, updateChannelDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }
  @Delete(':id/:membershipId/')
  removeMembership(@Param('id') id: number, @Param('membershipId') membershipId: number) {
    return this.channelsService.removeMembership(id, membershipId);
  }
  
  @Patch(':id/joinChannel') 
  @UseGuards(Jwt2faAuthGuard)
  joinChannel(@Param('id') id: string, @Body() user: UserDTO) {
    return this.channelsService.joinChannel(+id, user);
  }

  @Patch(':channelId/updateMembershipTitle/:memberid')
  async updateMembershipTitle(@Param('channelId') channelId: string,@Param('memberid') memberid: string) {
    return this.channelsService.updateMembershipTitle(+channelId,+memberid);
  }
}


