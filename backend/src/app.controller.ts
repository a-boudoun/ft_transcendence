import { Controller, Get, Res,} from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHello(@Res() res: Response){
    res.cookie('myCookie', 'cookieValue', { httpOnly: true });
    return res.status(200);
  }
}