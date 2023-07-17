"use client";
import { config } from 'dotenv';

config();

const getData = async (endpoint: string) =>
{
    const url = `http://localhost:8000${endpoint}`;
    
    console.log(url);

    const res = await fetch(url , {credentials : 'include'}).then(res => res.json());
    const data = await res;

    return data;
};

export default getData;


