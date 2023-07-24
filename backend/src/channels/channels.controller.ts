import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('/createChannel')
  create(@Body() ChannelDTO: ChannelDTO) {
    return this.channelsService.create(ChannelDTO);
  }

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get('me')
  me() {
    return this.channelsService.findOne(2);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }
}
function Req(): (target: ChannelsController, propertyKey: "me", parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}

