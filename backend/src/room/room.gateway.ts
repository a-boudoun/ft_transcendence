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
        const id =  socket.data.username;
        const user = await this.userRepo.findOneBy({id});
        if (user){
            user.status = Status.ONLINE;
            await this.userRepo.save(user);
        }
    }

    async handleDisconnect(socket: Socket) {
        const id =  socket.data.username
        const user = await await this.userRepo.findOneBy({id});
        if (user){
            user.status = Status.OFFLINE;
            await this.userRepo.save(user);
        }
    }

    @SubscribeMessage('join')
    handleJoinChannel(client: Socket,  data: any) {
        console.log("joined channel " + data.channel);
    }

    @SubscribeMessage('prevmessage')
    handleMessage(client: Socket, data: any) {
        this.server.to(data.channel).emit('message',{content: data.message, from: data.from});
        this.channelsService.addmessge(data.channel, data.message, data.from);
       console.log(data.from + " " + data.message);
       
    }

    @SubscribeMessage('leave')
    handleLeaveChannel(@MessageBody() channel: string, @MessageBody() username: string, client: Socket) {
        client.leave(channel);
        this.server.to(channel).emit('message', `${username} left the channel`);
    }
}