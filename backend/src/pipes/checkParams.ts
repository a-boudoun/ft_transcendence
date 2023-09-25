import { IsNumberString, IsString} from 'class-validator';

export class CheckParamsId {
  @IsNumberString()
    id: number;
}

export class CheckParamsUsermame {
  @IsString()
    username: number;
}