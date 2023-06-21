import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const getData = async (endpoint: string) =>
{
    const cookieStore = cookies();
    const token = cookieStore.get('access_token');

    if (!token)
      redirect('/');
    const res = await fetch(endpoint, {'headers' : {'cookie' : `access_token=${token.value}`}});
    const data = await res.json();
    return data;
};

export default getData;