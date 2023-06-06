import { Controller, Get, Post, Req, Res, Header, Body, Param, HttpCode} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { Response } from 'express';

class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: Request ): string {
    return this.appService.getHello();
  }
  @Post()
  create(@Body() CreateCatDto: CreateCatDto): string {
    return 'This action adds a new cat';
  }
  @Get('cookie')
  @Header('test', 'test')
  setCookie(@Res({ passthrough: true }) response: Response){
    response.cookie('name', 'mazhari');
    return 'cookie is set';
  }

}
