import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, Req } from '@nestjs/common';
import { config } from 'dotenv';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';


config();

const extractCookie = (req: Request): string | null => {
    if (req.cookies && req.cookies.tow_fact_token) {
        return req.cookies.tow_fact_token;
      return req.cookies.access_token;
    }
    return null;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOneById(payload.id);
        return user;
    }
}