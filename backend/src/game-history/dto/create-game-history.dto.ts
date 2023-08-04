import { UserDTO } from "src/users/dto/create-user.dto";

export class GameHistoryDTO {
    winner: UserDTO;
    loser: UserDTO;
    loserScore: number;
}
