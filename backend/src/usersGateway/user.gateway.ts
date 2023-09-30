import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
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
        const user =  await this.userRepo.findOneBy({id});
        if (user){
            user.status = Status.OFFLINE;
            await this.userRepo.save(user);
        }
    }

    sendFriedRequest(id: number) {
        this.server.to(id.toString()).emit('friendRequest');
    }
}