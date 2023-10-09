import { Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { UseGuards } from '@nestjs/common';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { UpdateUserDTO } from 'src/users/dto/update-user.dto';

@Controller('channels')
@UseGuards(Jwt2faAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('/createChannel')
  create( @Body() channelDTO: ChannelDTO) {
    return this.channelsService.create(channelDTO);
  }
  
  @Get()
  findAll(@Req() req: any) {
    return this.channelsService.findAll(req.user.username);
  }
  @Get(':id')
  findOne(@Param('id') id: number, @Req() req: any) {
    return this.channelsService.findChannel(id, req.user.username);
  }
  @Get('directchannel/:id')
  findOneDirect(@Param('id') id: number) {
    return this.channelsService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateChannelDto: UpdateChannelDto) {
  
    return this.channelsService.update(id, updateChannelDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.channelsService.remove(id);
  }
  @Delete(':id/:membershipId/')
  removeMembership(@Param('id') id: number, @Param('membershipId') membershipId: number) {
    return this.channelsService.removeMembership(id, membershipId);
  }
  
  @Patch(':id/joinChannel') 
  joinChannel(@Param('id') id: number, @Body() dt: any) {
    return this.channelsService.joinChannel(id, dt.user, dt.password);
  }

  @Patch(':id/addFriendtoChannel')
  async addFriendtoChannel(@Param('id') id: number, @Body() friend: UpdateUserDTO) {
    return this.channelsService.addFriendtoChannel(id, friend);
  }

  @Patch(':channelId/updateMembershipTitle/:memberid')
  async updateMembershipTitle(@Param('channelId') channelId: number, @Param('memberid') memberid: number) {
    return this.channelsService.updateMembershipTitle(channelId, memberid);
  }

  @Patch(':channelId/ban/:username')
  async ban(@Param('channelId') channelId: number, @Param('username') username: string) {
    return this.channelsService.banner(channelId, username);
  }
  @Get('direct/:username')
  async getDirectChannel(@Param('username') username: string) {
    return this.channelsService.getDirectChannels(username);
  }
  @Patch('unban/:banId')
  async unban(@Param('banId') banId: string) {
    return this.channelsService.unban(+banId);
  }
  @Patch('muteUser/:channelId')
   mute( @Param('channelId') channelId: number, @Body() dt: any) {
    return this.channelsService.mut(channelId,+dt.id, dt.duration);
  }
  @Get('isMuted/:channelId/:username')
  isMuted(@Param('channelId') channelId: number, @Param('username') username: string) {
    return this.channelsService.isMuted(channelId,username);
  }
  @Get('getChannelId/:id')
  getChannelId(@Param('id') id: number, @Req() req) {
    return this.channelsService.getChannelId(req.user.id, id);
  }
  @Get('blockedandblocker/:id')
  getBlockedAndBlocker(@Req() req) {
    return this.channelsService.block(req.user.username);
  }


}
