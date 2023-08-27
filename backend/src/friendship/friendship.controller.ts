import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipDTO } from './dto/create-friendship.dto';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { find } from 'rxjs';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/users/dto/create-user.dto';
import con from 'ormconfig';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('sendRequest/:receiver')
  @UseGuards(Jwt2faAuthGuard)
  async create(@Param('receiver') receiver: string, @Req() Req) {
    return await this.friendshipService.create(Req.user.name, receiver);
  }

  @Get('friendrequests')
  @UseGuards(Jwt2faAuthGuard)
  friendReq(@Req() req) {
    return this.friendshipService.friendReq(req.user.username);
  }

  @Patch('acceptRequest/:sender')
  @UseGuards(Jwt2faAuthGuard)
  async accept(@Param('sender') sender: string, @Req() req) {
    return await this.friendshipService.accept(req.user.username, sender);
  }

  @Get('getFriends/me')
  @UseGuards(Jwt2faAuthGuard)
  async getMyFriends(@Req() req, @Param('name') name: string) {
      return await this.friendshipService.getFriends(req.user.username);
  }

  @Get('getFriends/:name')
  @UseGuards(Jwt2faAuthGuard)
  async getFriends(@Req() req, @Param('name') name: string) {
      return await this.friendshipService.getFriends(name);
  }

  @Get('status/:name')
  @UseGuards(Jwt2faAuthGuard)
  async status(@Param('sender') sender: string, @Req() req){
    return this.friendshipService.status(req.user.username, sender);
  }

  @Delete(':name')
  @UseGuards(Jwt2faAuthGuard)
  remove(@Param('sender') sender: string, @Req() req) {
    return this.friendshipService.remove(req.user.username, sender);
  }
}
