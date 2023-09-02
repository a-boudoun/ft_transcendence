import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity'
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import con from 'ormconfig';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    ) {}
    
    create(userDTO: UserDTO) {
      const user = this.userRepo.create(userDTO);
      return this.userRepo.save(user);
    }
    
    async findAll() {
      return await this.userRepo.find({
        order: {
          level: 'DESC',
        },
      });
    }
    
    async search(key: string) {
      const users = await this.userRepo.findBy({name: Like(`%${key}%`)});
      return users;
    }
    
    findOne(username: string) {
      const user = this.userRepo.findOneBy({username});
      
      return user;
    }
    
    findOneByname(name: string) {
      const user = this.userRepo.findOneBy({name});
      
      return user;
    }
    
    async isUserExist(myName: string,  name: string) {
      const user = await this.userRepo.findOneBy({name});
      
      if (user) {
        if (user.name === myName)
        {
          return false;
        }
        return true;
      }
      return false;
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


    }