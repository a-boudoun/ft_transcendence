
import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '/home/abderrahim/Desktop/ft_transcendence/backend/src/interfaces/User';
// import { User } from '../interfaces/user';
import { UsersService } from '../users/users.service';

  
  @Injectable()
  export class AuthService {
    constructor(
      private jwtService: JwtService,
      private userService: UsersService,
    ) {}
  
    async login(user: User) {

      const payload = {username: user.username, sub: user.id};

      const userExists = await this.findUserByusername(user.username);
  
      if (!userExists) {
        let newUser = await this.userService.create(user);
      }
      
      return this.jwtService.signAsync(payload);
    }
  
    async findUserByusername(username) {
      const user = await this.userService.findOne(username);
  
      if (!user) {
        return null;
      }
      return user;
    }
  
}
