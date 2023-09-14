import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Jwt2faAuthGuard } from '../auth/guards/jwt-2fa-auth.guard';
import { JwtSigninGuard } from '../auth/guards/jwt-signin.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(Jwt2faAuthGuard)
  async findAll(@Req() req) {
    const users =  await this.usersService.findAll();
    return {users: users};
  }

  @Get('search/:key')
  @UseGuards(Jwt2faAuthGuard)
  async search(@Param('key') key: string, @Req() req) {
    const users =  await this.usersService.search(req.user.id, key);
    return {users: users};
  }
  
  @Get('DM')
  @UseGuards(Jwt2faAuthGuard)
  getDM(@Req() req) {
    return this.usersService.getDM(req.user.username);
  }
  
  @Get('Channels')
  @UseGuards(Jwt2faAuthGuard)
  getChannels(@Req() req) {
    return this.usersService.getChannels(req.user.username);
  }
  
  @Get('getUser/me')
  @UseGuards(Jwt2faAuthGuard)
  me(@Req() req) {
    return this.usersService.findOneById(req.user.id);
  }
  
  @Get('getUser/:username')
  @UseGuards(Jwt2faAuthGuard)
  async findOne(@Req() req, @Param('username') username: string) {
    console.log(username);
    const user =  await this.usersService.findOneByUserName(username);
    if (!user)
      return null;
    if (await this.usersService.isBlocked(req.user.id, user.id) === true)
      return null;
    return user;
  }

  @Get('signin')
  @UseGuards(JwtSigninGuard)
  async signin(@Req() req) {
    return req.user;
  }
  
  @Patch('updateMe')
  @UseGuards(Jwt2faAuthGuard)
  updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
  

  @Get('isUserNameExist/:username')
  async isUserNameExist(@Param('username') username: string) {
    return this.usersService.isUserNameExist(username);
  }
  
  @Post('block')
  @UseGuards(Jwt2faAuthGuard)
  async block(@Req() req, @Body() body: {id: number}) {
    console.log(body);
    await this.usersService.block(req.user.id, body.id);
  }

  @Delete('unblock/:id')
  @UseGuards(Jwt2faAuthGuard)
  async unblock(@Req() req, @Param('id') id: number) {
    await this.usersService.unblock(req.user.id, id);
  }

  @Get('blockedUsers')
  @UseGuards(Jwt2faAuthGuard)
  async blockedUsers(@Req() req) {
    return this.usersService.blockedUsers(req.user.id);
  }

  @Get('isBlocked/:id')
  @UseGuards(Jwt2faAuthGuard)
  async isBlocked(@Req() req, @Param('id') id: number) {
    return this.usersService.isBlocked(req.user.id, id);
  }
  
}
