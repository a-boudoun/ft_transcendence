"use client";
import { config } from 'dotenv';

config();

const get = async (endpoint: string) =>
{
    const url = `http://localhost:8000${endpoint}`;

    const res = await fetch(url , {credentials : 'include'})
    .then( async (res) => { 
        const data = await res.json();
        console.log(data);
        return data;
    })
    .catch(async(err) => {err});

    return res;

};

export default get;


