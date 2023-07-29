
import Channel from '@/components/chat/Channel';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { channel } from 'diagnostics_channel';
import { type } from 'os';
import { set } from 'zod';

type InitialState = {
    channel: Channel;
    channels: Channel[];
};

interface Message {
    content: string;
    from: string;
}

type Channel = {
    id: number;
    name: string;
    image: string;
    type: string;
    password: string;
    messages: Message[];
};
const initialState = {
    channel: {
    id: 0,
    name: '',
    image: '',
    type: '',
    password: '',
    messages: [],
    } as Channel,

    channels: [] as Channel[],

} as InitialState

export const currentChannelSlice = createSlice({
    name: 'currentChannel',
    initialState,
    reducers: {
        setcurrentChannel: (state , action: PayloadAction<any>) => {
            // state.channel.id = action.payload.id;
            // state.channel.name = action.payload.name;
            // state.channel.image = action.payload.image;
            // state.channel.type = action.payload.type;
            // state.channel.password = action.payload.password;

            state.channel  = state.channels.find((channel: any) => channel.id === parseInt(action.payload.id));

            // console.log(state.channel.messages);
            // state.channel.id = ch.id;
            // state.channel.name = ch.name;
            // state.channel.image = ch.image;
            // state.channel.type = ch.type;
            // state.channel.password = ch.password;
            // state.channel.messages = [];
            

        },
        setMessage: (state: any, action: PayloadAction<any>) => {
            state.channel.messages.push(action.payload);
        },
        setChannels: (state: any, action: PayloadAction<any>) => {
            state.channels = action.payload;
        },
        setnewchannel: (state: any, action: PayloadAction<any>) => {
            state.channels.push(action.payload);
        }

    }
})


export const {setcurrentChannel, setMessage, setChannels, setnewchannel} = currentChannelSlice.actions;
export default currentChannelSlice.reducer;