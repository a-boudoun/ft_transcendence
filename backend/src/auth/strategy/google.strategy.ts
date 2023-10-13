import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { Injectable } from '@nestjs/common';
import { Status } from '../../entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.SECRET_GOOGLE,
      callbackURL: process.env.REDIRECT_URI_GOOGLE,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {

    const user = {
      email: profile.email,
      username: profile.name.givenName[0] + profile.name.familyName,
      image: profile.photos[0].value,
      baner: '/img/baner.webp',
      status: Status.ONLINE,
      XP: 0,
      level: 0,
      wins: 0,
      loses: 0,
      fact2Auth: false,
      fact2Secret: '',
      accessToken ,
    };


    done(null, user);
  }
}