import { cookies } from 'next/headers';

const getData = async (endpoint: string) =>
{
    const cookieStore = cookies();
    const token = cookieStore.get('access_token');

    if (!token)
      return null;

    const res = await fetch(endpoint , {'headers' : {'cookie' : `access_token=${token.value}`}});
    const data = await res.json();
    return data;
};

export default getData;