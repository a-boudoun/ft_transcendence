import {Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';

  @Injectable()
  export class AuthService {
    constructor(
      private userService: UsersService,
      private jwtService: JwtService
      ) {}
      
    signin(username: string, res: Response, body: any) {
      this.userService.update(username, body);

      res.clearCookie('firstTime');
    }

    async login(user : UserDTO, res: Response, fact2Auth: boolean) {
      const userExists : UserDTO =  await this.userService.findOne(user.username);

      if (!userExists){
        const token = await this.genarateToken(user, fact2Auth, true);

        res.cookie('access_token', token, {httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'strict',
          path: '/'
        });

        res.cookie('firstTime', true, {httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'strict',
          path: '/'
        });

        await this.userService.create(user);
      }
      else if (userExists.fact2Auth === false){ 
        const token = await this.genarateToken(user, fact2Auth, false);
        res.cookie('access_token', token, {httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'strict',
          path: '/'
        });
      }
      else if (userExists.fact2Auth === true && fact2Auth === false){
        const token = await this.genarateToken(user, fact2Auth, false);
        res.cookie('access_token', token, {httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'strict',
          path: '/'
        });
      }

      res.redirect('http://localhost:3000');
  }

  async genarateToken(user: UserDTO, fact2Auth: boolean, firtTime: boolean) {
    const payload = {username: user.username, sub: user.XP, fact2Auth: fact2Auth, firtTime: firtTime};
    return this.jwtService.signAsync(payload);
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
