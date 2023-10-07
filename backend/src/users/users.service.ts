import { Injectable} from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
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
    
    async search(id : number,  key: string) {
      const blockedAndBlocker = await this.blockedAndBlocker(id);
      const allUsers = await this.userRepo.findBy({username: Like(`%${key}%`)});
      return  allUsers.filter(user => !blockedAndBlocker.some(b => b.id === user.id));
    }
    
    async findOneByUserName(username: string) {
      const user = await this.userRepo.findOneBy({username});
  
      return user;
    }

    async findOneById(id: number) {
      const user = await this.userRepo.findOneBy({id});
  
      return user;
    }
    
    async findOneByIntraId(intraID: number) {
      const user = await this.userRepo.findOneBy({intraID: intraID});
  
      return user;
    }
    
    async isUserNameExist(username: string) {
      const user = await this.userRepo.findOneBy({username});
      
      if (user) {
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
  
      
      async update(id: number, updateUser: UpdateUserDTO) {
        const user = await this.findOneById(id);
        return await this.userRepo.save({...user, ...updateUser})
      }
      
      async set2FAsecret(secret: string, id: number) {
        const user = await this.findOneById(id);
        return await this.userRepo.save({...user, ...{fact2Secret: secret}})
      }
      
      async turnON2FA(id: number) {
        const user = await this.findOneById(id);
        return await this.userRepo.save({...user, ...{fact2Auth: true}})
      }
      
      async block(bloker: number, blocked: number) {
        const block = await this.blockRepo.create();
        block.blocker = await this.findOneById(bloker);
        block.blocked = await this.findOneById(blocked);
        await this.friendService.remove(bloker, blocked);
        return this.blockRepo.save(block);
      }
      
      async unblock(blocker: number, blocked: number) {
        const block = await this.blockRepo.find({
          where: [
            { blocker: { id: blocker } ,  blocked: { id: blocked} },
          ],
        });
        if (block.length === 0)
          return ;
        return this.blockRepo.remove(block[0]);
      }
  
      async blockedUsers(id: number) {
        const blockedUsers = await this.blockRepo.find({where: {blocker : {id: id }},  relations: ['blocked']});
        if (blockedUsers.length === 0)
          return [];
        return blockedUsers.map(b => b.blocked);
      }
  
      async blockedByUsers(id: number) {
        const blockedByUsers = await this.blockRepo.find({
          where: {blocked : {id: id }},  
          relations: ['blocker']
        });
        if (blockedByUsers.length === 0)
          return [];
        return blockedByUsers.map(b => b.blocker);
      }
  
      async blockedAndBlocker (id: number) {
        const blocked = await this.blockedUsers(id);
        const blockedBy = await this.blockedByUsers(id);
        return [...blocked, ...blockedBy];
      }

      async isBlocked(me: number, id: number) {
          const blocked = await this.blockedUsers(me);
          let some = blocked.some(b => b.id === id);
          if (some)
            return {isBlock: true, blocker: me};

          const blockedBy = await this.blockedByUsers(me);
          some = blockedBy.some(b => b.id === id);
          if (some)
            return {isBlock: true, blocker: id};
          return {isBlock: false, blocker: null};
      }
}