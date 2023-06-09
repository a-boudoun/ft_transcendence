import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
}