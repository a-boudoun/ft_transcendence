import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Injectable()
export class Jwt2faAuthGuard extends AuthGuard('jwt-2fa') {

    getToken(context: any): Request {
        const req = context.switchToHttp().getRequest();
        console.log(req.cookies.access_token);
        return req.cookies.access_token;
    }


}