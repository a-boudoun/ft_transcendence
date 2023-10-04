'use client'

import axios from '@/apis/axios';
import { useQuery , useMutation } from "@tanstack/react-query";
import { userDto } from '@/dto/userDto';
import { useRouter } from 'next/navigation'
import ChangeNameImage from './ChangeNameImage';
import BlockList from './BlockList';
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton';

const Settings = () => {

  const Router = useRouter();

  const User = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async ()=> {
      const {data} = await axios.get('users/getUser/me')
      return data;
    }
  });
  
  const updateUser = useMutation({
    mutationFn: async(user : userDto) => {
      await axios.patch('/users/updateMe', user);
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

  if (User.isLoading){
      return <SettingsSkeleton />
  }
  else {
      return (
          <div className='my-8 flex flex-col items-center gap-8'>
            <ChangeNameImage src={User.data.image} name={User.data.username} />
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
              <div className='h-[400px] w-[280px] sm:w-[400px] grow rounded-3xl shadow-2xl overflow-hidden p-8 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg'> 
                <BlockList />
              </div>
            </div>
        </div>
    )
  }
}

export default Settings;