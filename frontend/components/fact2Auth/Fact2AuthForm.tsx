"use client"

import { useState } from 'react'
import { Loader2 } from  'lucide-react'
import { useMutation} from "@tanstack/react-query"
import axios from '@/apis/axios';
import { useRouter } from 'next/navigation'

interface body {
    code : string
}

const Fact2AuthForm = () => {
    const router = useRouter();
  
    const [code, setCode] = useState<string>('');
    const [msg, setMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validCode = useMutation({
        mutationFn: async(body : body) => {
        const {data} = await axios.patch('/auth/2fa/login', body);
        if (data.valid === true){
          router.push('/profile');
        }
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
        await validCode.mutate(body);
    };

    return (
        <form onChange={handleChange} onSubmit={handleSubmit}>
            <input className='h-16 rounded-2xl text-black text-center focus:outline-0 focus:border-[2px] hover:opacity-60' type="text" placeholder='Enter the code' required />
        <div>
          <button className='relative mt-12 h-16 rounded-2xl text-black text-center bg-blue px-14 hover:opacity-60' type='submit' onClick={ () => setIsLoading(true)} >Confirm
          {isLoading && <Loader2 className="absolute top-6 right-6 animate-spin" size={20} strokeWidth={1.2} />}
          </button>
          {msg && <p className='text-red text-center max-w-[200px]'> {msg} </p>}
        </div>
            
        </form>
    )
}

export default Fact2AuthForm;