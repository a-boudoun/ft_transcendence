import Message from "./Message";
import {userDto} from "./userDto";
export default interface Channel {
    id: number;
    name: string;
    image: string;
    type: string;
    password: string;
    messages: Message[];
    owner: userDto;
}
