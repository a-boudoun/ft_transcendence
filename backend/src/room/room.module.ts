import {Module} from '@nestjs/common';
import {RoomGateway} from './room.gateway';
import {ChannelsModule} from '../channels/channels.module';

@Module({
    imports: [ChannelsModule],
    providers: [RoomGateway],
})
export class RoomModule {}