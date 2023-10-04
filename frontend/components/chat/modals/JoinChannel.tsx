import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { AppDispatch } from "@/redux/store";
import { setisopen, setMembership, setcurrentchannel } from "@/redux/features/globalState";
import axios from "@/apis/axios";
import { userDto } from "@/dto/userDto";
import Image from "next/image";
import { toast } from "react-toastify";


const JoinChannel = ({type}:{type:string}) => {


    const dispatch = useDispatch<AppDispatch>();
    const showToast = () => {
      toast.error('Wrong password', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
   
    const [input, setInput] = useState("");
    const channel = useSelector((state: any) => state.globalState.channel);
    const user = useSelector((state: any) => state.globalState.user);
    const [error, setError] = useState('');
    const [isDelayed, setIsDelayed] = useState(false);

    

    const joinChannel = useMutation({
      mutationFn: async (user: userDto) => {
        const dt = {
          user: user,
          password: input,
        }
          const { data } = await axios.patch(`/channels/${channel.id}/joinChannel`, dt);
          if(data === "Wrong password")
          {
            
            showToast();
            setError("Wrong password");
            
            return;
          }
          else
          {
            const membership = data.memberships?.find((member: any) => member.member?.username === user.username);
            dispatch(setMembership(membership));
            dispatch(setcurrentchannel(data));
            dispatch(setisopen(false));
          }
          return data;
      },
      onSuccess: () => {
      }
  });

    const onChange = (e: any) => {
      setInput(e.target.value);
    }

    const onClick = () => 
    {
        joinChannel.mutate(user)
    }

    return(
      <div className={`shadow-2xl w-96 h-96 bg-black bg-opacity-40 ackdrop-blur-lg drop-shadow-lg rounded-lg ${type !== 'joinchannel' ? 'hidden': ''}`}>
        <Image
          className="absolute left-0 right-0 top-10 h-32 w-32  rounded-full mx-auto my-3"
          src={channel.image}
          width={1000}
          height={1000}
          alt=""
        />
        <h1 className="absolute h-1 top-48 left-0 right-0  text-white font-semibold">{channel.name}</h1>
        <input type="password" className={`${channel.type === "Protected" ? '': 'hidden' } w-1/2 absolute top-60 left-24 rounded-md py-1 px-3 outline-none`} placeholder="Enter Password" autoComplete="current-password"  onChange={onChange} />
        <div className="absolute h-1 top-[72%] left-0 right-0 text-[#FF9494]">{error}</div>
        <button className=" w-[96%] absolute bottom-0 left-0 bg-blue text-white font-semibold text-base m-2 py-1 rounded-lg" onClick={onClick}>Join</button>
      </div>
    );
  }

  export default JoinChannel;