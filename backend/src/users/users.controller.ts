import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDTO: UserDTO) {
    return this.usersService.create(userDTO);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('getUser')
  @UseGuards(JwtAuthGuard)
  findProfile(@Req() req) {
    return this.usersService.findOne(req.user.username);
  }

  // @Get('getGameswon')
  // @UseGuards(JwtAuthGuard)
  // findGamesWon(@Req() req) {
  //   return this.usersService.findGamesWon(req.user.username);
  // }

  @Get(':login')
  findOne(@Param('login') login: string) {
    return this.usersService.findOne(login);
  }

  @Patch(':login')
  update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(login, updateUserDto);
  }

  @Delete(':login')
  remove(@Param('login') login: string) {
    return this.usersService.remove(login);
  }
}
