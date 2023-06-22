import { Module, Get  } from '@nestjs/common';
import { AuthController } from './auth.contronller';
import { AuthStratedy  } from './strategy/42.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXP_D},
  })], 
  controllers: [AuthController],
  providers: [AuthStratedy, JwtStrategy,  AuthService],
})
export class AuthModule {}

