import { Fstatus } from "src/entities/user.entity";
import { UserDTO } from "src/users/dto/create-user.dto";

export class FriendshipDTO {
    initiater: UserDTO;
    receiver: UserDTO;
    status: Fstatus;
}
