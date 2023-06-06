import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable} from '@nestjs/common';

export interface JwtPayload {}
