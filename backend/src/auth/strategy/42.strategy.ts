import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { Status } from 'src/user.entity';
import { config } from 'dotenv';

config();

@Injectable()
export class AuthStratedy extends PassportStrategy(Strategy, 'passport-42') {

  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.SECRET,
      callbackURL: 'http://localhost:8000/auth/42/redirect',
      scope: 'public',
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) : Promise<any> {

    const image = profile._json.image.link ? profile._json.image.link : 'test';

    const user = {
      username: profile.username,
      image: image,
      status: Status.ONLINE,
      XP: 0,
      level: 0,
      fact2Auth: false,
    }
  
    done(null, user);
  }
}