import { Module, Get  } from '@nestjs/common';
import { AuthController } from './auth.contronller';
import { AuthStratedy  } from './strategy/42.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthStratedy, JwtStrategy,  AuthService],
})
export class AuthModule {}

