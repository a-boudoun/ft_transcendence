import {userDto} from "./userDto";

export default interface Message {
    content: string;
    sender: userDto;
    date: string;
}
