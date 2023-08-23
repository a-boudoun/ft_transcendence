'use client'

import axios from 'axios';
import { useQuery , useMutation } from "@tanstack/react-query";
import { userDto } from '@/dto/userDto';
import { useRouter } from 'next/navigation'
import Frineds from "@/components/common/Friends";
import ChangeNameImage from './ChangeNameImage';

const UpdateForm = () => {

  const Router = useRouter();

  const User = useQuery({
    queryKey: ['user'],
    queryFn: async ()=> {
      const {data} = await axios.get('http://localhost:8000/users/me', { withCredentials: true })
      return data;
    }
  });
  
  const updateUser = useMutation({
    mutationFn: async(user : userDto) => {
      await axios.patch('http://localhost:8000/users/updateMe', user, { withCredentials: true });
    },
  });

  const handele2FA = async() => {
   if (User.data.fact2Auth === true ){
      User.data.fact2Auth = false;
      User.data.fact2Secret = null;

      await updateUser.mutate(User.data);
      Router.push('settings')
   }
    else
      Router.push('settings/fact2auth')
 }

  if (User.isLoading)
  return <div>loading...</div>
  else {
      console.log(User.data);

      return (
          <div className='my-8  flex flex-col items-center gap-8 overf'>
            <ChangeNameImage />
            <div>
              <h3 className='my-6 text-xl font-bold text-blue' >two-factor authentication</h3>
              <p className='max-w-sm'>
                Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
              </p>
              <button className={`my-6 relative h-16 rounded-2xl text-black text-center ${User.data.fact2Auth === true ? 'bg-red' : 'bg-blue'} px-14 hover:opacity-60`}  onClick={() => handele2FA() } >
                {User.data.fact2Auth === true? 'disable' : 'enable'}
              </button>
            </div>
            <div className='grow flex flex-col'>
              <h3 className='mb-6 text-xl font-bold text-blue' >blocked users</h3> 
              <div className='h-[400px] w-[280px] sm:w-[400px] bg-light-gray grow rounded-3xl shadow-2xl overflow-hidden p-8'> 
                <Frineds /> 
              </div>
            </div>
        </div>
    )
  }
}

export default UpdateForm;