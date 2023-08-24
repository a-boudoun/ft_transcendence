import userDto from "./userDto";

export default interface Message {
    content: string;
    from: userDto;
    createdAt: string;
}
