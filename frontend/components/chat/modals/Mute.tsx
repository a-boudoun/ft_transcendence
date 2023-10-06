"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { AppDispatch } from "@/redux/store";
import { setisopen } from "@/redux/features/globalState";
import axios from "@/apis/axios";

const Mute = ({type}:{type:string}) => {
  
    const dispatch = useDispatch<AppDispatch>();
    const mutedid = useSelector((state: any) => state.globalState.id);
    const channel = useSelector((state: any) => state.globalState.channel);
    const [duration, setDuration] = useState<string>('');
  
    const muteUser = useMutation({
      mutationFn: async ({channelid,duration, muted}:{channelid:number,duration:string, muted: number}) => {
        const dt = {
          id: muted,
          duration: duration,
        }  
        const { data } = await axios.patch(`/channels/muteUser/${channelid}`, dt);
        return data;
      },
      onSuccess: () => {
      }
  });

    const handelClick = (duration: string) => {
      setDuration(duration);
    }
    const mute = () =>
    {
      muteUser.mutate({channelid: channel.id, duration: duration, muted: mutedid});
      setDuration('');
      dispatch(setisopen(false));
    }

    return(
      <div className={`w-80 h-80 z-50   bg-black bg-opacity-40 ackdrop-blur-lg drop-shadow-lg  rounded-lg ${type !== 'mute' ? 'hidden': ''}`}>
         <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold mx-auto">Mute User</h1>
     
        <div className="absolute top-14 left-0 right-0 mx-auto w-[90%] h-52 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-xl">
         <div className="h-[46%] mt-1.5 ml-2 w-[95%] relative">
          <button className={`w-[46%] h-[90%] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg absolute top-0 bottom-0 left-1 my-auto rounded-lg text-base font-bold text-blue flex justify-center items-center ${duration === '15' ? 'border-2 border-red' : ''}`} onClick={()=> handelClick('15')}> 15 minutes</button>
          <button className={`w-[46%] h-[90%] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg absolute top-0 bottom-0 right-1 my-auto rounded-lg text-base font-bold text-blue flex justify-center items-center ${duration === '30' ? 'border-2 border-red' : ''}`} onClick={()=> handelClick('30')}>30 minutes</button>
         </div>
         <div className=" h-[46%] mt-1 ml-2 w-[95%] relative">
          <button className={`w-[46%] h-[90%] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg absolute top-0 bottom-0 left-1 my-auto rounded-lg text-base font-bold text-blue flex justify-center items-center ${duration === '60' ? 'border-2 border-red' : ''}`} onClick={()=> handelClick('60')}>1 Hour</button>
          <button className={`w-[46%] h-[90%] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg absolute top-0 bottom-0 right-1 my-auto rounded-lg text-base font-bold text-blue flex justify-center items-center ${duration === '1440' ? 'border-2 border-red' : ''}` } onClick={()=> handelClick('1440')}>24 Hours</button>
         </div>
        </div>
        <button className=" w-[44%] absolute bottom-0 left-3 bg-blue text-white font-semibold text-base my-2 py-1  rounded-lg" onClick={()=> dispatch(setisopen(false))} >Cancel</button>
        <button className={`w-[44%] absolute bottom-0 right-3 bg-red text-white font-semibold text-base my-2 py-1 rounded-lg ${duration === '' ? 'cursor-not-allowed': ''}`} disabled={duration === ''} onClick={mute}>Mute</button>

       </div>     
    );
  
  }
export default Mute;