import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { AppDispatch } from '@/redux/store';
import { setisopen } from '@/redux/features/globalState';
import axios from 'axios';
import { Client } from '@/providers/QueryProvider';
import { userDto } from '@/dto/userDto';
import Image from 'next/image';
import { useDebounce } from "@uidotdev/usehooks"

 const AddFriend = ({type}:{type:string}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [friends, setFriends] = useState<any>([]);
    const user = useSelector((state: any) => state.globalState.user);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const channel = useSelector((state: any) => state.globalState.channel);
    

    const debouncedSearchQuery = useDebounce(searchQuery, 200);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    const getFriends = useMutation({
          mutationFn: async (channelid: number) => {
            if(!debouncedSearchQuery)
            {
              setFriends([]);
              return;
            }
            const { data } = await axios.get(`http://localhost:8000/friendship/search/${channelid}/${debouncedSearchQuery}`, { withCredentials: true });
            if(data)
              setFriends(data);
            return data;
          }
      });


      useEffect(() => {
        if(!channel?.id )
          return;
          getFriends.mutate(channel.id);
      }, [debouncedSearchQuery]);

    return(
      <div className={`w-96 h-96  bg-bg bg-cover bg-no-repeat rounded-lg ${type !== 'addFriend' ? 'hidden': ''}`}>
         <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold mx-auto">Invite to chat</h1>
         <input type="txt" className="bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg w-11/12 absolute top-14 left-0 right-0 mx-auto rounded-md py-1.5 px-2 outline-none text-md text-white" placeholder="Enter Username" value={searchQuery}  onChange={handleInputChange}/>
          <div className="w-11/12 h-[72%] absolute top-[26%] left-0 right-0 mx-auto rounded-md bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg  overflow-y-scroll">
            { friends.length === 0 ? <h1 className="text-white text-center mt-5">No Friends</h1> : 
              friends?.map((friend: any) => (
                <Friend key={friend.id} friend={friend} setinput={setSearchQuery}/>
              ))
            }
          </div>
      </div>
    );


  }
  export const Friend = ({friend, setinput}:{friend: any, setinput:any}) => {
    const dispatch = useDispatch<AppDispatch>();
    const channel = useSelector((state: any) => state.globalState.channel);
    const addFriend = useMutation({
      mutationFn: async (channelid: number) => {
          const { data } = await axios.patch(`http://localhost:8000/channels/${channelid}/addFriendtoChannel`, friend, { withCredentials: true });
          return data;
      },
      onSuccess: () => {
          dispatch(setisopen(false));
          Client.refetchQueries('channels');
          Client.refetchQueries('channel');
      }
  });

    const handelClick = () => {
      setinput('');
      addFriend.mutate(channel.id);
    }
    return(
      <div className="my-2 mx-auto w-[92%] h-12 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <Image
            className="mx-2 h-8 w-8 rounded-full"
            src={friend?.image}
            width={1000}
            height={1000}
            alt=""
          />
          <h1 className="ml-2 text-blue font-semibold " >{friend.username}</h1>
        </div>
        <button className="bg-blue text-white   px-3 mx-3 rounded-md" onClick={handelClick}>add</button>
      </div>
    );
  }

  export default AddFriend;