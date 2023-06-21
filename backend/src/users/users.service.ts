import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../interfaces/user';

@Injectable()
export class UsersService {
    // constructor ()
    // private readonly users: User[] = [
    //     {
    //         id: '2',
    //         username: 'amiski',
    //     },
    // ];

    // async findOne(username: string): Promise<User | undefined> {
    //     return this.users.find(user => user.username === username);
    // }

    // async create(user: User){
    //     this.users.push(user);

    //     return user;
    // }
}
