import { Module, Get  } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthStratedy  } from './strategy/42.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { Jwt2faStrategy } from './strategy/jwt-2fa.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtSigninStrategy } from './strategy/jwt-signin.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthStratedy, GoogleStrategy,  JwtStrategy, Jwt2faStrategy, JwtSigninStrategy,  AuthService],
  exports: [AuthService]
})
export class AuthModule {}