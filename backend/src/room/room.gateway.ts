import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import con from 'ormconfig';
import { Server, Socket } from 'socket.io';
import { ChannelsService } from 'src/channels/channels.service';


@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private channelsService: ChannelsService) { }
    @WebSocketServer() server: Server;

    

    handleConnection(socket: Socket) {
    }

    handleDisconnect(socket: Socket) {
    }

    @SubscribeMessage('join')
    handleJoinChannel(client: Socket,  data: any) {
        client.join(data.channel);
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