import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, Req } from '@nestjs/common';
import { config } from 'dotenv';

config();

const cookieExtractor = (req) => {
    let jwt = null 

    if (req && req.cookies) {
        jwt = req.cookies['jwt']
    }
    
    console.log(jwt);
    
    return jwt;
}

@Injectable()
export class JwtStratedy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        console.log(payload);

        return { Id: payload.sub, 
            username: payload.username };
    }
}