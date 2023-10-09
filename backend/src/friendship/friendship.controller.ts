import { Controller, Get, Post, Patch, Param, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';

@Controller('friendship')
@UseGuards(Jwt2faAuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('sendRequest')
  async create(@Body() body: any, @Req() Req) {
    return await this.friendshipService.create(Req.user.id, body.receiver);
  }

  @Get('friendrequests')
  friendReq(@Req() req) {
    return this.friendshipService.friendReq(req.user.username);
  }

  @Patch('acceptRequest')
  async accept(@Body() body: any, @Req() req) {
    return await this.friendshipService.accept(req.user.id, body.sender);
  }

  @Get('getFriends/:id')
  async getFriends(@Req() req, @Param('id') id: number) {
      return await this.friendshipService.getFriends(id);
  }

  @Get('status/:id')
  async status(@Param('id') id: number, @Req() req){
    return this.friendshipService.status(req.user.id, id);
  }

  @Get('search/:channelid/:query')
  async search(@Param('channelid') channelId: number,@Param('query') query: string, @Req() req) {
    return await this.friendshipService.search(channelId, req.user.id, query);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.friendshipService.remove(req.user.id, id);
  }

}
