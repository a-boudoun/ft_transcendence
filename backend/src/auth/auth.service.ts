import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/users/dto/create-user.dto';

  @Injectable()
  export class AuthService {
    constructor(
      private jwtService: JwtService,
      private userService: UsersService,
    ) {}
  
    async login(user: UserDTO) {

      const payload = {username: user.username, sub: user.XP};

      const userExists =  await this.userService.findOne(user.username);
  
      if (!userExists) {
        let newUser = await this.userService.create(user);
      }
      
      return this.jwtService.signAsync(payload);
    }
  
}
