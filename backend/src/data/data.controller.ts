import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DataService } from './data.service';
import { UserDTO } from './dto/create-datum.dto';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  create(@Body() UserDTO: UserDTO) {
    return this.dataService.create(UserDTO);
  }

  @Get()
  findAll() {
    return this.dataService.findAll();
  }

  @Get(':login')
  findOne(@Param('login') login: string) {
    return this.dataService.findOne(login);
  }

//   @Patch(':login')
//   update(@Param('login') login: string, @Body() updateDatumDto: UpdateDatumDto) {
//     return this.dataService.update(+login, updateDatumDto);
//   }

  @Delete(':login')
  remove(@Param('login') login: string) {
    return this.dataService.remove(login);
  }
}
