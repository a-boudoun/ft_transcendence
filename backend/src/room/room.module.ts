import {Module} from '@nestjs/common';
import {RoomGateway} from './room.gateway';
import {ChannelsModule} from '../channels/channels.module';
import {User} from '../entities/user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [ChannelsModule , TypeOrmModule.forFeature([User]) ],
    providers: [RoomGateway],
})
export class RoomModule {}