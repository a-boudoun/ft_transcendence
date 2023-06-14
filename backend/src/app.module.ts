import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormconfig';
@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
