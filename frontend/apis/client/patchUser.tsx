'use client';

import userDto from '@/dto/userDto'; 
import { config } from 'dotenv';
config();

const patch = async (endpoint: string, user: userDto) =>
{
    
    const url = `http://localhost:8000${endpoint}`;
    
    const res = await fetch(url , {
        method: 'PATCH', 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name : user.name, image: user.image,  fact2Auth : user.fact2Auth, level : user.level, XP : user.XP}),
        credentials : 'include'});
        
        const data = await res.json();

    return data;
};

export default patch;