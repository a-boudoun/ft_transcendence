import { Module, Get  } from '@nestjs/common';
import { AuthController } from './auth.contronller';
import { AuthStratedy  } from './strategy/42.strategy';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStratedy } from './strategy/jwt.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXP_H},
  })], 
  controllers: [AuthController],
  providers: [AuthStratedy, JwtStratedy,  AuthService],
})
export class AuthModule {}

