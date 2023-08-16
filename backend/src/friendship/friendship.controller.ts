import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipDTO } from './dto/create-friendship.dto';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  create(@Body() FriendshipDTO: FriendshipDTO) {
    return this.friendshipService.create(FriendshipDTO);
  }

  @Get(':username')
  getFriends(@Param('username') username: string) {
    return this.friendshipService.getFriends(username);
  }

  @Get('friendrequests')
  @UseGuards(Jwt2faAuthGuard)
  friendReq(@Req() req) {
    return this.friendshipService.friendReq(req.user.username);
  }

  @Get('me')
  @UseGuards(Jwt2faAuthGuard)
  getMyFriends(@Req() req) {
    return this.friendshipService.getFriends(req.user.username);
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
