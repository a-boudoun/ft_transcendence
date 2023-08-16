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

  @Get('getFriends')
  @UseGuards(Jwt2faAuthGuard)
  async getMyFriends(@Req() req) {;
    return await this.friendshipService.getFriends(req.user.username);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFriendshipDto: UpdateFriendshipDto) {
  //   return this.friendshipService.update(+id, updateFriendshipDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendshipService.remove(+id);
  }
}
