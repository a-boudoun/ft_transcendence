import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { Status } from '../../entities/user.entity';
import { config } from 'dotenv';

config();

@Injectable()
export class AuthStratedy extends PassportStrategy(Strategy, '42') {

  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.SECRET,
      callbackURL: process.env.REDIRECT_URI,
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) : Promise<any> {

    const image = profile._json.image.link ? profile._json.image.link : '../../assets/avatar.png';

    console.log(profile.emails[0].value);

    const user = {
      email: profile.emails[0].value,
      username: profile.username,
      image: image,
      baner: '/img/baner.webp',
      status: Status.ONLINE,
      XP: 0,
      level: 0,
      wins: 0,
      loses: 0,
      fact2Auth: false,
      fact2Secret: '',
      accessToken ,
    }
  
    done(null, user);
  }
}