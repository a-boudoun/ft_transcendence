import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Response } from 'express';

@Injectable()
export class Jwt2faAuthGuard extends AuthGuard('jwt-2fa') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        const httpContext = context.switchToHttp();
        const res: Response = httpContext.getResponse();
        
        if (!user) {
            res.clearCookie('access_token'); 
        }

        return user;
    }
}