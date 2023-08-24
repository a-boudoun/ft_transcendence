
import Channel from '@/components/chat/Channel';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { type } from 'os';
import { set } from 'zod';

type InitialState = {
    channel: Channel;
    channels: Channel[];
    user: userDto;
    isopen: boolean;
    isMid: boolean;
    isChild: boolean;
};

interface Message {
    content: string;
    from: userDto;
    createdAt: string;
}

type userDto  = {
    id: number;
    username: string; 
    name: string;
    image: string;
    fact2Auth: boolean;
    level: number;
    XP: number;
}
type Channel = {
    id: number;
    name: string;
    image: string;
    type: string;
    password: string;
    messages: Message[];
    memberships: any[];
};
const initialState = {

    channel:{} as Channel,
    channels: [] as Channel[],
    user: {} as userDto,
    isopen: false,
    isMid: true,
    isChild: false,

} as InitialState

export const currentChannelSlice = createSlice({
    name: 'currentChannel',
    initialState,
    reducers: {
        setcurrentChannel: (state , action: PayloadAction<any>) => {
            state.channel  = action.payload;
        },
        setMessage: (state: any, action: PayloadAction<any>) => {
            console.log("sd",action.payload.from);
            state.channel.messages.push(action.payload );
            console.log("sd",state.channel.messages);

        },
        setChannels: (state: any, action: PayloadAction<any>) => {
            state.channels = action.payload;
        },
        setnewchannel: (state: any, action: PayloadAction<any>) => {
            state.channels.unshift(action.payload);
        },
        setisopen: (state: any, action: PayloadAction<any>) => {
            state.isopen = action.payload;
        },
        setuser: (state: any, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setMembership: (state: any, action: PayloadAction<any>) => {
            state.channel.memberships.push(action.payload);
        },
        setisMid: (state: any, action: PayloadAction<any>) => {
            state.isMid = action.payload;
        },
        setisChild: (state: any, action: PayloadAction<any>) => {
            state.isChild= action.payload;
        }



    }
})


export const {setcurrentChannel, setMessage, setChannels, setnewchannel, setisopen, setuser, setMembership, setisMid, setisChild} = currentChannelSlice.actions;
export default currentChannelSlice.reducer;