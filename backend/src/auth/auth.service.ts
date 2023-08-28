import {Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

config();
@Injectable()
export class AuthService {
    constructor(
      private userService: UsersService,
      private jwtService: JwtService
    ) {}
  
    async login(user: UserDTO, res: Response, fact2Auth: boolean) {
      const userExists: UserDTO = await this.userService.findOne(user.username);
    
      const accessToken = await this.generateToken(user, fact2Auth, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '7d'});
    
      if (!userExists) {
          const signinToken = await this.generateToken(user, false, {secret: process.env.SIGNIN_TOKEN_SECRET, expiresIn: '15m'});
      
          res.cookie('signin_token', signinToken, {
            httpOnly: true,
            maxAge: 900000,
            sameSite: 'strict',
            path: '/',
          });
          await this.userService.create(user);
          res.redirect('http://localhost:3000/signIn');
          return;
        
      } else if (userExists.fact2Auth === false) {

          res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 604800000,
            sameSite: 'strict',
            path: '/',
          });
          res.redirect('http://localhost:3000/profile');
          return;
        
      } else if (userExists.fact2Auth === true && fact2Auth === false) {

          res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 604800000,
            sameSite: 'strict',
            path: '/',
          });
          res.redirect('http://localhost:3000/fact2auth');
          return;
          
      }
    
      return;
    }
    
    async generateToken(user: UserDTO, fact2Auth: boolean, config : {secret: string, expiresIn: string}) {
      const payload = { username: user.username, sub: user.XP, fact2Auth: fact2Auth };
      return this.jwtService.signAsync(payload, config);
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
