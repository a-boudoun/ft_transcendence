import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, Req } from '@nestjs/common';
import { config } from 'dotenv';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

config();

const extractCookie = (req: Request): string | null => {
    if (req.cookies && req.cookies.signin_token) {

      return req.cookies.signin_token;
    }
    return null;
}

@Injectable()
export class JwtSigninStrategy extends PassportStrategy(Strategy, 'jwt-signin') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
            ignoreExpiration: false,
            secretOrKey: process.env.SIGNIN_TOKEN_SECRET,
        });
    }

    async validate(payload: any) {
        return {email: payload.email, username: payload.username, image: payload.image };
    }
}