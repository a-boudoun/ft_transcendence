import { Injectable} from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Blockage, User } from '../entities/user.entity'
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipService } from '../friendship/friendship.service';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Blockage) private blockRepo: Repository<Blockage>,
    private readonly friendService: FriendshipService,
    ) {}
    
    create(userDTO: UserDTO) {
      const user = this.userRepo.create(userDTO);
      return this.userRepo.save(user);
    }
    
    async findAll() {
      
      const allUsers =  await this.userRepo.find({
        order: {
          level: 'DESC',
        },
      });
      return  allUsers;
      
    }
    
    async search(username:string,  key: string) {
      const blockedAndBlocker = await this.blockedAndBlocker(username);
      const allUsers = await this.userRepo.findBy({username: Like(`%${key}%`)});
      return  allUsers.filter(user => !blockedAndBlocker.some(b => b.username === user.username));
    }
    
    findOne(username: string) {
      const user = this.userRepo.findOneBy({username});
      
      return user;
    }
    
    // findOneByname(name: string) {
    //   const user = this.userRepo.findOneBy({name});
      
    //   return user;
    // }
    
    async isUserNameExist(username: string) {
      const user = await this.userRepo.findOneBy({username});
      
      if (user) {
        if (user.username === username)
          return true;
      }
      return false;
    }

    async findonebyid(id: number) {
      return this.userRepo.find({
        where: {
          id: id,
        },
      });
    }
    
    async getDM(username: string) {
      const channels = await this.userRepo.createQueryBuilder('user').leftJoinAndSelect('user.channels', 'channel', 'channel.type = :type', {type: 'direct'}).where('user.username = :username', {username}).getMany();
      return channels;
      // return this.userRepo.findOne({where: {
        //   username: username,
        // }, relations: ['channels', 'channels.type']});
      }
      
      async getChannels(username: string) {
        const channels = await this.userRepo.createQueryBuilder('user').leftJoinAndSelect('user.channels', 'channel', 'channel.type != :type', {type: 'direct'}).where('user.username = :username', {username}).getMany();
        return channels;
      }
      
      async update(login: string, updateUser: UpdateUserDto) {
        const user = await this.findOne(login);
        return await this.userRepo.save({...user, ...updateUser})
      }
      
      async remove(login: string) {
        const user = await this.findOne(login);
        return this.userRepo.remove(user);
      }
      
      async set2FAsecret(secret: string, login: string) {
        const user = await this.findOne(login);
        return await this.userRepo.save({...user, ...{fact2Secret: secret}})
      }
      
      async turnON2FA(username: string) {
        const user = await this.findOne(username);
        return await this.userRepo.save({...user, ...{fact2Auth: true}})
      }
      
      async block(bloker: any, blocked: any) {
        const block = await this.blockRepo.create();
        block.blocker = await this.findOne(bloker);
        block.blocked = await this.findOne(blocked);
        await this.friendService.remove(bloker, blocked);
        return this.blockRepo.save(block);
      }
      
      async unblock(blocker: any, blocked: any) {
        const block = await this.blockRepo.find({
          where: [
            { blocker: { username: blocker } ,  blocked: { username: blocked} },
          ],
        });
        return this.blockRepo.remove(block);
      }
  
      async blockedUsers(username: string) {
        const blockedUsers = await this.blockRepo.find({where: [{blocker : {username: username }}],  relations: ['blocked']});
        if (blockedUsers.length === 0)
          return [];
        return blockedUsers.map(b => b.blocked);
      }
  
      async blockedByUsers(username: string) {
        const blockedByUsers = await this.blockRepo.find({where: [{blocked : {username: username }}],  relations: ['blocker']});
        return blockedByUsers.map(b => b.blocker);
      }
  
      async blockedAndBlocker (username: string) {
        const blocked = await this.blockedUsers(username);
        const blockedBy = await this.blockedByUsers(username);
        return [...blocked, ...blockedBy];
      }

      // async isBlocked(blocker: string, blocked: string) {
      //     const blockedAndBlocker = await this.blockedAndBlocker(blocker);
      //     return blockedAndBlocker.some(b => b.username === blocked);
      // }
}