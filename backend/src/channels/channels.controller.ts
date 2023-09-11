import { Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { UseGuards } from '@nestjs/common';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { MemberTitle, Membership } from 'src/entities/channel.entity';
import con from 'ormconfig';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';

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
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.channelsService.findOne1(+id, req.user.username);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
  
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
  joinChannel(@Param('id') id: string, @Body() dt: any) {
    return this.channelsService.joinChannel(+id, dt.user, dt.password);
  }

  @Patch(':id/addFriendtoChannel')
  async addFriendtoChannel(@Param('id') id: string, @Body() friend: UserDTO) {
    return this.channelsService.addFriendtoChannel(+id, friend);
  }

  @Patch(':channelId/updateMembershipTitle/:memberid')
  async updateMembershipTitle(@Param('channelId') channelId: string,@Param('memberid') memberid: string) {
    return this.channelsService.updateMembershipTitle(+channelId,+memberid);
  }

  @Patch(':channelId/ban/:username')
  async ban(@Param('channelId') channelId: string,@Param('username') username: string) {
    return this.channelsService.banner(+channelId,username);
  }
  @Get('direct/:username')
  async getDirectChannel(@Param('username') username: string) {
    return this.channelsService.getDirectChannel(username);
  }
  @Patch('unban/:banId')
  async unban(@Param('banId') banId: string) {
    return this.channelsService.unban(+banId);
  }
  @Patch('muteUser/:channelId')
   mute( @Param('channelId') channelId: string, @Body() dt: any) {
    return this.channelsService.mut(+channelId,+dt.id, 1);
  }
  @Get('isMuted/:channelId/:username')
  isMuted(@Param('channelId') channelId: string, @Param('username') username: string) {
    return this.channelsService.isMuted(+channelId,username);
  }

}


