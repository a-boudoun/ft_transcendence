import {Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { Response } from 'express';

  @Injectable()
  export class AuthService {
    constructor(
      private userService: UsersService,
    ) {}
  
    async login(user : UserDTO, res: Response) {

      const userExists =  await this.userService.findOne(user.username);
      console.log(userExists);

      const token = await this.userService.genarateToken(user);
      res.cookie('access_token', token, {httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        path: '/'
      });

      
      if (userExists === null){
        await this.userService.create(user);
        res.redirect('http://localhost:3000/singIn');
      }
      else {
        res.redirect('http://localhost:3000/home');
      }

    }
}
