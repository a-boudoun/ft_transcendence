import {Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { Status } from 'src/entities/user.entity';

config();
  @Injectable()
  export class AuthService {
    constructor(
      private userService: UsersService,
      private jwtService: JwtService
      ) {}
      
      async signin(user: UserDTO, res: Response, body: any) {
        
        
        user.image = body.image;
        user.username = body.username;
        user.baner = '/img/baner.webp';
        user.status = Status.ONLINE;
        user.level = 0;
        user.XP = 0;
        user.wins = 0;
        user.loses = 0;
        user.fact2Auth = false;
        user.fact2Secret = '';
        
        user = await this.userService.create(user);
        const payload = {id: user.id, image: user.image, fact2Auth: false}
        const token = await this.jwtService.signAsync(payload, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
        res.cookie('access_token', token, {
          httpOnly: true,
          maxAge: 604800000,
        });
        res.clearCookie('signin_token');
      }
      
      async login(user : UserDTO, res: Response, fact2Auth: boolean) {

        const userExists : UserDTO =  await this.userService.findOneByIntraId(user.intraID);
   
        if (!userExists){
          const payload = {intraID: user.intraID, username: user.username, image: user.image}
          const token = await this.jwtService.signAsync(payload, {secret: process.env.SIGNIN_TOKEN_SECRET, expiresIn: process.env.SIGNIN_TOKEN_EXP_D});
          
          await res.cookie('signin_token', token, {
            httpOnly: true,
            maxAge: 604800000,
          });
          
        }
        else if (userExists.fact2Auth === false){ 
          const payload = {id: userExists.id, image: userExists.image, fact2Auth: fact2Auth}
          const token = await this.jwtService.signAsync(payload, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
          
          await res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 604800000,
          });
          
        }
        
        else if (userExists.fact2Auth === true && fact2Auth === false){
          const payload = {id: userExists.id, image: userExists.image, fact2Auth: fact2Auth}
          const token = await this.jwtService.signAsync(payload, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
          await res.cookie('tow_fact_token', token, {
            httpOnly: true,
            maxAge: 604800000,
          });
        }
        res.redirect(process.env.NEXT_PUBLIC_FRONTEND_HOST);
      }
      
      async logout(id: number, res: Response) {
        res.clearCookie('access_token');
        const user = await this.userService.findOneById(id);
        user.status = Status.OFFLINE;
        await this.userService.update(id, user);
      }

      async generate2FAsecret(id: number) {
        const user = await this.userService.findOneById(id);
        
        
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.username, 'Trans', secret);
        
        await this.userService.set2FAsecret(secret, id);
        
        return {
          otpauthUrl
        }
        
      }
      
      async generateQR(qr: string) {
        return await toDataURL(qr);
      }
      
      async validate2FA(code: string, id: number) {
        const user = await this.userService.findOneById(id);
        

        const valid = await authenticator.verify({token: code, secret: user.fact2Secret});
        if (valid === false)
          throw new Error('Invalid 2FA code');
        await this.userService.turnON2FA(id);
    }
    
    async confirm2FA(id: number, res: any) {
      const user = await this.userService.findOneById(id);

      const payload = {id: user.id, image: user.image, fact2Auth: true}
      const token = await this.jwtService.signAsync(payload, {secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXP_D});
      
      res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 604800000,
      });
      
      res.clearCookie('tow_fact_token');
    }

    getId(cookie: string) {
      const token = cookie.split('=')[1];
      
      const decodedJwt = this.jwtService.decode(token) as UserDTO;

      return decodedJwt?.id;
    }
}