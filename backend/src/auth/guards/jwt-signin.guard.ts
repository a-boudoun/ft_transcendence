import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSigninGuard extends AuthGuard('jwt-signin') {}