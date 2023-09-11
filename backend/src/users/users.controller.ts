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
    const users =  await this.usersService.search(req.user.username, key);
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
    return this.usersService.findOne(req.user.username);
  }
  
  @Get('getUser/:username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get('signin')
  @UseGuards(JwtSigninGuard)
  async signin(@Req() req) {
    return req.user;
  }
  
  @Patch('updateMe')
  @UseGuards(Jwt2faAuthGuard)
  updateMe(@Req() req, @Res() res, @Body() updateUserDto: UpdateUserDto) {
    this.usersService.update(req.user.username, updateUserDto);
    res.status(200).send({message: 'User updated'});
  }
  

  @Get('isUserNameExist/:name')
  async isUserNameExist(@Param('name') name: string) {
    return this.usersService.isUserNameExist(name);
  }
  
  @Post('block')
  @UseGuards(Jwt2faAuthGuard)
  async block(@Req() req, @Body() body: any) {
    console.log(body);
    await this.usersService.block(req.user.username, body.username);
  }

  @Delete('unblock/:username')
  @UseGuards(Jwt2faAuthGuard)
  async unblock(@Req() req, @Param('username') username: string) {
    await this.usersService.unblock(req.user.username, username);
  }

  @Get('blockedUsers')
  @UseGuards(Jwt2faAuthGuard)
  async blockedUsers(@Req() req) {
    return this.usersService.blockedUsers(req.user.username);
  }

  // @Get('isBlocked/:username')
  // @UseGuards(Jwt2faAuthGuard)
  // async isBlocked(@Req() req, @Param('username') username: string) {
  //   return this.usersService.isBlocked(req.user.username, username);
  // }
}
