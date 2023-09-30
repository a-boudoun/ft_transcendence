'use client'

import { useState } from 'react';
import { useQuery, useMutation} from "@tanstack/react-query";
import axios from '@/apis/axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2 } from  'lucide-react';

interface body {
  code : string
}

export const Enable2FA = () => {

  const router = useRouter();

  const [code, setCode] = useState<string>('');
  const [msg, setMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const qrCode = useQuery({
    queryKey: ['qrCode'],
    queryFn: async () => {
      const {data} = await axios.get('/auth/2fa/generate');
      return data;
    }
  });

  const turnON = useMutation({
    mutationFn: async(body : body) => {
    const {data} = await axios.patch('auth/2fa/turnOn', body);
    if (data.valid === true)
      router.push('/settings');
    else {
      setIsLoading(false);
      setMsg(data.message);
    }
    }
  });

  const handleChange = async (e: any) => {
      setCode(e.target.value);
  };

  const handleSubmit = async(e: any) => {
    e.preventDefault(); 

    const body : body = {code: code}
    await turnON.mutate(body);
  };

  
  if(qrCode.isLoading) return <div>Loading...</div>
  else {
    return (
      <form className='flex flex-col items-center gap-16 mt-36' onChange={handleChange} onSubmit={handleSubmit} >
        <p className='text-md text-blue sm:px-20'>
          Scan the QR code below with your google authenticator app or authy app and enter the code to enable 2FA
        </p>
        <Image src={qrCode.data} alt="qrCode"  width={200} height={200} />
        <input className='h-16 rounded-2xl text-black text-center focus:outline-0 focus:border-[2px] hover:opacity-60' type="text" placeholder='Enter the code' required />
        <div>
          <button className='relative mt-12 h-16 rounded-2xl text-black text-center bg-blue px-14 hover:opacity-60' type='submit' onClick={ () => setIsLoading(true)} >Enable
          {isLoading && <Loader2 className="absolute top-6 right-6 animate-spin" size={20} strokeWidth={1.2} />}
          </button>
          {msg && <p className='text-red text-center max-w-[200px]'> {msg} </p>}
        </div>
      </form>
    )
  }
}

export default Enable2FA;