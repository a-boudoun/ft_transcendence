import { ChannelType, SanctionType } from "src/entities/channel.entity";
import { UserDTO } from "src/users/dto/create-user.dto";

export class ChannelDTO {
    name: string;
    image: string;
    type: ChannelType;
    owner: UserDTO;
    password: string;
    administrators: AdministrationDTO[];
    memberships: MembershipDTO[];
    sanctions: SanctionDTO[];
    messages: MessageDTO[];
}

export class AdministrationDTO {
    channel: ChannelDTO;
    admin: UserDTO;
}

export class MembershipDTO {
    channel: ChannelDTO;
    member: UserDTO;
}

export class SanctionDTO {
    channel: ChannelDTO;
    member: UserDTO;
    type: SanctionType;
    duration: Date;
}

export class MessageDTO {
    createdAt: Date;
    channel: ChannelDTO;
    sender: UserDTO;
    content: string;
}
