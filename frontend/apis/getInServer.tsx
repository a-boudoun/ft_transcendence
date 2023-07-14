import { config } from 'dotenv';
import { cookies } from 'next/headers';

config();

const getData = async (endpoint: string) =>
{
    const cookieStore = cookies();
    const token = cookieStore.get('access_token');

    
    const url = `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}${endpoint}`;
    
    if (!token)
      return null;

    const res = await fetch(url , {'headers' : {'cookie' : `access_token=${token.value}`}});
    const data = await res.json();
    return data;
};

export default getData;