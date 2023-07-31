import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Jwt2faAuthGuard } from '../auth/guards/jwt-2fa-auth.guard';
import con from 'ormconfig';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDTO: UserDTO) {
    return this.usersService.create(userDTO);
  }

  @Get()
  @UseGuards(Jwt2faAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('DM')
  @UseGuards(Jwt2faAuthGuard)
  getDM(@Req() req) {
    return this.usersService.getDM(req.user.username);
  }
  
  @Get('DM')
  @UseGuards(Jwt2faAuthGuard)
  getChannels(@Req() req) {
    return this.usersService.getChannels(req.user.username);
  }

  @Get('me')
  @UseGuards(Jwt2faAuthGuard)
  me(@Req() req) {
    return this.usersService.findOne(req.user.username);
  }

  @Patch('updateMe')
  @UseGuards(Jwt2faAuthGuard)
  updateMe(@Req() req, @Res() res, @Body() updateUserDto: UpdateUserDto) {
    this.usersService.update(req.user.username, updateUserDto);
    res.status(200).send({message: 'User updated'});
  }


  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.usersService.findOneByname(name);
  }
  
  @Get('isUserExist/:name')
  @UseGuards(Jwt2faAuthGuard)
  async isUser(@Req() req, @Param('name') name: string) {
    return this.usersService.isUserExist(req.user.username, name);
  }


  @Delete(':login')
  remove(@Param('login') login: string) {
    return this.usersService.remove(login);
  }
}
