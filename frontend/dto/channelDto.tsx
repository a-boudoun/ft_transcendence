import UserDTO from "./userDto";


export default interface channelDto {
    name: string;
    image: string;
    type: string;
    owner: UserDTO;
    password: string;
}