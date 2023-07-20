
import channelDto from '@/dto/channelDto';
import { config } from 'dotenv';
config();

const postChannel = async (endpoint: string, channel: channelDto) =>
{
    
    const url = `http://localhost:8000${endpoint}`;
    
    const res = await fetch(url , {
        method: 'post', 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name : channel.name, image: channel.image,  type: channel.type, password: channel.password}),
        credentials : 'include'});
        
        const data = await res.json();

    return data;
};

export default postChannel;