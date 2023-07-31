import { Module, Get  } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthStratedy  } from './strategy/42.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { Jwt2faStrategy } from './strategy/jwt-2fa.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthStratedy, JwtStrategy, Jwt2faStrategy,  AuthService],
})
export class AuthModule {}

