import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDTO } from 'src/users/dto/create-user.dto';



@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('/createChannel')
  @UseGuards(JwtAuthGuard)
  create( @Body() channelDTO: ChannelDTO) {
    return this.channelsService.create(channelDTO);
  }
  
  @Get()
  findAll() {
    return this.channelsService.findAll();
  }
  
  @Get('/me')
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
  
  @Patch(':id/joinChannel') 
  @UseGuards(JwtAuthGuard)
  joinChannel(@Param('id') id: string, @Body() user: UserDTO) {
    return this.channelsService.joinChannel(+id, user);
  }

}
function Req(): (target: ChannelsController, propertyKey: "me", parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}

