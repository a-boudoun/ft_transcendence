import { Controller, Get, Post, Patch, Param, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('sendRequest')
  @UseGuards(Jwt2faAuthGuard)
  async create(@Body() body: any, @Req() Req) {
    console.log(`--------------------`);
    return await this.friendshipService.create(Req.user.name, body.receiver);
  }

  @Get('friendrequests')
  @UseGuards(Jwt2faAuthGuard)
  friendReq(@Req() req) {
    return this.friendshipService.friendReq(req.user.username);
  }

  @Patch('acceptRequest')
  @UseGuards(Jwt2faAuthGuard)
  async accept(@Body() body: any, string, @Req() req) {
    return await this.friendshipService.accept(req.user.username, body.sender);
  }

  @Get('getFriends/me')
  @UseGuards(Jwt2faAuthGuard)
  async getMyFriends(@Req() req) {
      return await this.friendshipService.getFriends(req.user.name);
  }

  @Get('getFriends/:name')
  @UseGuards(Jwt2faAuthGuard)
  async getFriends(@Req() req, @Param('name') name: string) {
      return await this.friendshipService.getFriends(name);
  }

  @Get('status/:name')
  @UseGuards(Jwt2faAuthGuard)
  async status(@Param('name') name: string, @Req() req){
    return this.friendshipService.status(req.user.username, name);
  }

  @Delete(':name')
  @UseGuards(Jwt2faAuthGuard)
  remove(@Param('name') name: string, @Req() req) {
    return this.friendshipService.remove(req.user.username, name);
  }
}
