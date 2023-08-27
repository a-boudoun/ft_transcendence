import { Module, Get  } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthStratedy  } from './strategy/42.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { Jwt2faStrategy } from './strategy/jwt-2fa.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtSigninStrategy } from './strategy/jwt-signin.strategy';

@Module({
  imports: [UsersModule,
            JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXP_D},
    })],
  controllers: [AuthController],
  providers: [AuthStratedy, JwtStrategy, Jwt2faStrategy, JwtSigninStrategy,  AuthService],
})
export class AuthModule {}

