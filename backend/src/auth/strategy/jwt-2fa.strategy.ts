import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, Res } from '@nestjs/common';
import { config } from 'dotenv';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

config();

const extractCookie = (req: Request | any ) => {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    else {
     if (!req.handshake?.headers?.cookie) 
        return null;
    
    const regex = /access_token=([^;]*)/;

    const token = req.handshake.headers.cookie.match(regex);

    return token;
    }
}
@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: any) {

        const user = await this.usersService.findOneById(payload.id);

        if (!user)
            return null;

        if (user.fact2Auth === false || (user.fact2Auth === true && payload.fact2Auth === true))
            return user;
    }
}