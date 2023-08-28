import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, Res } from '@nestjs/common';
import { config } from 'dotenv';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

config();

const extractCookie = (req: Request): string | null => {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
}
@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any, @Res() res: Response) {
        
        const user = await this.usersService.findOne(payload.username);

        // if (payload.firtTime === true)
        // {
        //     res.cookie('firstTime', true, {httpOnly: true,
        //         maxAge: 60 * 60 * 24 * 7,
        //         sameSite: 'strict',
        //         path: '/'
        //       });
        // }
        
        if (!user.fact2Auth)
            return user;
        if (payload.fact2Auth === true) 
            return user;
    }
}