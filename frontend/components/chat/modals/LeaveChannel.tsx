import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { AppDispatch } from '@/redux/store';
import { setisopen } from '@/redux/features/globalState';
import axios from '@/apis/axios';
import { Client } from '@/providers/QueryProvider';
import { userDto } from '@/dto/userDto';

 const LeaveChannel = ({type}:{type:string}) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: any) => state.globalState.user);
    const channel = useSelector((state: any) => state.globalState.channel);
    const [isowner, setIsowner] = useState(false);

    useEffect(() => {
    const member = channel.memberships?.find((item: any) => item.member?.id === user.id);
    member?.title === 'owner' ? setIsowner(true) : setIsowner(false);
    }, [channel]);

    const leaveChannel = useMutation({
      mutationFn: async (user: userDto) => {
          const member = channel.memberships?.find((item: any) => item.member?.id === user.id);
          const dd = isowner ? channel.id : `${channel.id}/${member.id}`;
          const { data } = await axios.delete(`/channels/${dd}`);
          return data;
      },
      onSuccess: () => {
          dispatch(setisopen(false));

          router.push('/channel');
          Client.refetchQueries(['channels']);
          // Client.refetchQueries('channel');
        }
       
    });
    
    return(
      <div className={`w-96 h-44   bg-black bg-opacity-40 ackdrop-blur-lg drop-shadow-lg rounded-lg ${type !== 'leaveChannel' ? 'hidden': ''}`}>
         <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold mx-auto">Leave Channel ?</h1>
         <h5 className="absolute top-16 text-white text-base px-4">Leaving means you can't send or receive messages in this chat. You can rejoin at any time.</h5>
         <div className="absolute bottom-0 left-0 right-0 mx-auto ">
            <button className=" w-[46%] absolute bottom-0 left-1 bg-blue text-white font-semibold text-base my-2 py-1  rounded-lg" onClick={()=> dispatch(setisopen(false))} >Cancel</button>
            <button className=" w-[46%] absolute bottom-0 right-1 bg-red text-white font-semibold text-base my-2 py-1 rounded-lg" onClick={()=> leaveChannel.mutate(user)} >Leave</button>

         </div>
      </div>
    );
  }

    export default LeaveChannel;