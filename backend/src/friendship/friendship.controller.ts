import { Controller, Get, Post, Patch, Param, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('sendRequest')
  @UseGuards(Jwt2faAuthGuard)
  async create(@Body() body: any, @Req() Req) {
    return await this.friendshipService.create(Req.user.id, body.receiver);
  }

  @Get('friendrequests')
  @UseGuards(Jwt2faAuthGuard)
  friendReq(@Req() req) {
    return this.friendshipService.friendReq(req.user.username);
  }

  @Patch('acceptRequest')
  @UseGuards(Jwt2faAuthGuard)
  async accept(@Body() body: any, @Req() req) {
    return await this.friendshipService.accept(req.user.id, body.sender);
  }

  @Get('getFriends/:id')
  @UseGuards(Jwt2faAuthGuard)
  async getFriends(@Req() req, @Param('id') id: number) {
      return await this.friendshipService.getFriends(id);
  }

  @Get('status/:id')
  @UseGuards(Jwt2faAuthGuard)
  async status(@Param('id') id: number, @Req() req){
    return this.friendshipService.status(req.user.id, id);
  }

  @Get('search/:channelid/:query')
  @UseGuards(Jwt2faAuthGuard)
  async search(@Param('channelid') channelid: string,@Param('query') query: string, @Req() req) {
    console.log(query);
    return await this.friendshipService.search(+channelid,req.user.username, query);
  }

  @Delete(':id')
  @UseGuards(Jwt2faAuthGuard)
  remove(@Param('id') id: number, @Req() req) {
    return this.friendshipService.remove(req.user.id, id);
  }

}
