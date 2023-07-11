import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GameGateway } from './game/game.gateway';
import { gameService } from './game/game.service';
import { GameModule } from './game/game.module';
@Module({
  imports: [AuthModule, UsersModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
