import { PartialType } from '@nestjs/mapped-types';
import { ChannelDTO } from './create-channel.dto';

export class UpdateChannelDto extends PartialType(ChannelDTO) {}
