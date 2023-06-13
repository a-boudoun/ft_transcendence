import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from '@nestjs/common';
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
    // const {name} = profile;
    const user = {
      id: profile.id,
      username: profile.username,
    }
  
    done(null, user);
  }
}