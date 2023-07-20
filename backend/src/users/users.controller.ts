import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import con from 'ormconfig';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDTO: UserDTO) {
    return this.usersService.create(userDTO);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('DM')
  @UseGuards(JwtAuthGuard)
  getDM(@Req() req) {
    return this.usersService.getDM(req.user.username);
  }
  
  @Get('DM')
  @UseGuards(JwtAuthGuard)
  getChannels(@Req() req) {
    return this.usersService.getChannels(req.user.username);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req) {
    return this.usersService.findOne(req.user.username);
  }

  @Patch('updateMe')
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() req, @Res() res, @Body() updateUserDto: UpdateUserDto) {
    console.log(req.user);
    this.usersService.update(req.user.username, updateUserDto);
    res.status(200).send({message: 'User updated'});
  }


  // @Get('getGameswon')
  // @UseGuards(JwtAuthGuard)
  // findGamesWon(@Req() req) {
  //   return this.usersService.findGamesWon(req.user.username);
  // }
  // @Get('getUser')
  // @UseGuards(JwtAuthGuard)
  // findProfile(@Req() req) {
  //   return this.usersService.findOne(req.user.username);
  // }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.usersService.findOneByname(name);
  }
  
  @Get('isUserExist/:name')
  @UseGuards(JwtAuthGuard)
  async isUser(@Req() req, @Param('name') name: string) {
    console.log(req.user);
    return this.usersService.isUserExist(req.user.username, name);
  }

  // @Patch(':login')
  // update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(login, updateUserDto);
  // }

  @Delete(':login')
  remove(@Param('login') login: string) {
    return this.usersService.remove(login);
  }
}
