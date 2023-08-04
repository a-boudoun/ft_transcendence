import {Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { User } from 'src/entities/user.entity';
import { toDataURL } from 'qrcode';
import { generate } from 'rxjs';
import con from 'ormconfig';
import { isToken } from 'typescript';

  @Injectable()
  export class AuthService {
    constructor(
      private userService: UsersService,
    ) {}
  
    async login(user : UserDTO, res: Response, fact2Auth: boolean) {
      const userExists : UserDTO =  await this.userService.findOne(user.username);

      const token = await this.userService.genarateToken(user, fact2Auth);
      res.cookie('access_token', token, {httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        path: '/'
      });

      if (!userExists){
        await this.userService.create(user);
        res.redirect('http://localhost:3000/signIn');
        return ;
      }
      else if (userExists.fact2Auth === false){ 
        res.redirect('http://localhost:3000/home');
        return ;
      }
      else if (userExists.fact2Auth === true && fact2Auth === false){
        res.redirect('http://localhost:3000/fact2auth');
        return ;
      }

      return ;
    }

    async generate2FAsecret(login: string) {
      const secret = authenticator.generateSecret();
   
      const otpauthUrl = authenticator.keyuri(login, 'Trans', secret);

      await this.userService.set2FAsecret(secret, login);
   
      return {
        otpauthUrl
    }

  }

  async generateQR(qr: string) {
    return await toDataURL(qr);
  }

  async validate2FA(code: string, login: string) {
    const user = await this.userService.findOne(login);

    // if (user.fact2auth === true)
    //   throw new Error('2FA is already enabled');

    const valid = await authenticator.verify({token: code, secret: user.fact2Secret});
    if (valid === false)
      throw new Error('Invalid 2FA code');

    await this.userService.turnON2FA(login);
  }

}
