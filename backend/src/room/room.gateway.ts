import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelsService } from 'src/channels/channels.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private channelsService: ChannelsService,
        @InjectRepository(User) private userRepo: Repository<User>) 
        { }
    @WebSocketServer() server: Server;

    async handleConnection(socket: Socket) {
    }

    async handleDisconnect(socket: Socket) {
    }

    @SubscribeMessage('join')
    handleJoinChannel(client: Socket,  data: any) {
        client.join(data.channel);
    }

    @SubscribeMessage('prevmessage')
    async handleMessage(client: Socket, data: any) {
        const block =( await this.channelsService.block(data.from)).map((user) => user.toString());
        const room = this.server.sockets.adapter.rooms.get(data.channel);
        let users = [...new Set(Array.from(room).map((id) => this.server.sockets.sockets.get(id).data.username))];
        users = users.filter((user) => !block.includes(user));
        users.forEach((user) => {
            console.log(`${data.channel}/${user}`);
            this.server.to(user).emit(`${data.channel}/${user}`, {content: data.message, from: data.from});
        });
        // this.server.to(data.channel).emit('message',{content: data.message, from: data.from});
        this.channelsService.addmessge(data.channel, data.message, data.from);
        
    }
   

    @SubscribeMessage('leave')
    handleLeaveChannel(@MessageBody() channel: string, @MessageBody() username: string, client: Socket) {
        client.leave(channel);
        this.server.to(channel).emit('message', `${username} left the channel`);
    }
}