import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GameGateway } from './game/game.gateway';
import { gameService } from './game/game.service';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import con from '../ormconfig';
import { GatewayModule } from './gateway/gateway.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  // AuthModule, UsersModule,
  imports: [TypeOrmModule.forRoot(con),
            AuthModule, UsersModule, GatewayModule, ChannelsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
