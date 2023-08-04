import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  
  getHello(): any {
    return ([{'name': 'Hello World!'}]);
  }
}
