'use client'

import Image from 'next/image'
import {userDto}  from '@/dto/userDto'
import uploadImage from '@/apis/uploadImage'
import { useRouter } from 'next/navigation';
import { useQuery, useMutation} from "@tanstack/react-query";
import axios from 'axios';

const User = async({id} : {id : string | null}) => {

  // const router = useRouter();

  const {data, isLoading} = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      let endpoint = 'http://localhost:8000/users/me';
      if (id)
        endpoint = `/users/${id}`;
      const {data} = await axios.get(endpoint, { withCredentials: true }); 
      return data;
    }
  });

  // const status = 'online';

  // const handleChange = async (e: any) => {

  //     const uploadimage = await uploadImage(e.target.files[0]);
  //     user.baner = uploadimage;
  //     const data = await patch('/users/updateMe', user);
  //     console.log(data);
  //     router.refresh();
  // };

  if (isLoading)
    return <div>loading...</div>
  else
  return(
      <div className='relative overflow-hidden sm:rounded-3xl sm:shadow-2xl'>
        <Image className='w-full h-full'  src={data.baner} alt='baner' width={1000} height={1000} />
        <label className="absolute right-0 bottom-28 bg-dark-gray text-md rounded-2xl px-4 py-2 cursor-pointer  sm:bottom-36 ">change baner image
          <input type="file" className='hidden' accept="image/jpeg, image/jpg, image/png, image/webp" onChange={handleChange}/>
        </label>

        <div className='absolute flex gap-3 items-center bottom-0 w-full bg-black/70 p-[14px]'> 
          <Image className='rounded-full w-[86px] h-[86px] sm:m-4'  src={data.image} alt='img' width={1000} height={1000} />
          <div className='text-left'>
            <h2 className='text-white text-xl sm:text-3xl'>{data.name}</h2>
            {id &&
              <div className=''>
              <span className='text-green-500 sm:text-xl'>{status}</span>
              <button className='bg-blue text-sm px-4 py-[2px] ml-4 text-black'>add friend </button>
              </div>
            }
          </div>
        </div> 
      </div>
    )
}

export default User;