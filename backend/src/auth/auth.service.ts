import {Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import con from 'ormconfig';

config();
  @Injectable()
  export class AuthService {
    constructor(
      private userService: UsersService,
      private jwtService: JwtService
      ) {}
      
      async signin(user: UserDTO, res: Response, body: any) {
        
        user.name = body.name;
        user.image = body.image;
        user.baner = '/img/baner.webp';
        user.level = 0;
        user.XP = 0;
        user.wins = 0;
        user.loses = 0;
        user.fact2Auth = false;
        user.fact2Secret = null;
        
        await this.userService.create(user);
        
        const token = await this.genarateToken(user, false, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
        res.cookie('access_token', token, {
          httpOnly: true,
          maxAge: 604800,
        });
        res.clearCookie('signin_token');
      }
      
      async login(user : UserDTO, res: Response, fact2Auth: boolean) {
        const userExists : UserDTO =  await this.userService.findOne(user.username);
        
        if (!userExists){
          const token = await this.genarateToken(user, fact2Auth, {secret: process.env.SIGNIN_TOKEN_SECRET, expiresIn: process.env.SIGNIN_TOKEN_EXP_D}); 
          
          await res.cookie('signin_token', token, {
            httpOnly: true,
            maxAge: 604800,
          });
          
        }
        else if (userExists.fact2Auth === false){ 
          const token = await this.genarateToken(user, fact2Auth, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
          await res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 604800,
          });
        }

        else if (userExists.fact2Auth === true && fact2Auth === false){
          const token = await this.genarateToken(user, fact2Auth, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
          await res.cookie('tow_fact_token', token, {
            httpOnly: true,
            maxAge: 604800,
          });
        }

        res.redirect('http://localhost:3000');
    
      }
      
      async genarateToken(user: UserDTO, fact2Auth: boolean, config: {secret: string, expiresIn: string}) {
        const payload = {username: user.username, image: user.image, fact2Auth: fact2Auth}
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
      
      async validate2FA(code: string, username: string) {
        console.log(username);
        const user = await this.userService.findOne(username);
        
        // if (user.fact2auth === true)
        //   throw new Error('2FA is already enabled');
        const valid = await authenticator.verify({token: code, secret: user.fact2Secret});
        if (valid === false)
        throw new Error('Invalid 2FA code');
      await this.userService.turnON2FA(username);
    }
    
    async confirm2FA(username: any, res: any) {
      const user = await this.userService.findOne(username);

      const token = await this.genarateToken(user, true, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
      
      res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 604800,
      });
      
      res.clearCookie('tow_fact_token');
    }

    getUsername(cookie: string) {
      const token = cookie.split('=')[1];
      
      const decodedJwt = this.jwtService.decode(token) as UserDTO;

      return decodedJwt?.username;
    }
}