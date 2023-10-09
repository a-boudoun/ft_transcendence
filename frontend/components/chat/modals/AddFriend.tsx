import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppDispatch } from "@/redux/store";
import { setisopen } from "@/redux/features/globalState";
import axios from "@/apis/axios";
import { Client } from "@/providers/QueryProvider";
import Image from "next/image";
import { useDebounce } from "@uidotdev/usehooks";
import { userDto } from "@/dto/userDto";

const AddFriend = ({ type }: { type: string }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const channel = useSelector((state: any) => state.globalState.channel);

  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getFriends = useQuery({
    queryKey: ["searchFriend", debouncedSearchQuery],
    queryFn: async () => {
      if (!channel.id || !debouncedSearchQuery) 
        return null; 
      const { data } = await axios.get(
        `/friendship/search/${channel.id}/${debouncedSearchQuery}`
      );

      return data;
    },
  });

  return (
    <div
      className={`w-96 h-96  bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg rounded-lg ${
        type !== "addFriend" ? "hidden" : ""
      }`}
    >
      <h1 className="absolute left-0 right-0 top-5 text-blue font-semibold mx-auto">
        Invite to chat
      </h1>
      <input
        type="txt"
        className="bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg w-11/12 absolute top-14 left-0 right-0 mx-auto rounded-md py-1.5 px-2 outline-none text-md text-white"
        placeholder="Enter Username"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <div className="w-11/12 h-[72%] absolute top-[26%] left-0 right-0 mx-auto rounded-md bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg  overflow-auto scrollbarl">
        {getFriends.data?.length === 0 ? (
          <h1 className="text-white text-center mt-5">No Friends</h1>
        ) : (
          getFriends.data?.map((friend: userDto) => (
            <Friend key={friend.id} friend={friend} setinput={setSearchQuery} />
          ))
        )}
      </div>
    </div>
  );
};

export const Friend = ({
  friend,
  setinput,
}: {
  friend: userDto;
  setinput: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const channel = useSelector((state: any) => state.globalState.channel);
  const addFriend = useMutation({
    mutationFn: async (channelid: number) => {
      const { data } = await axios.patch(
        `/channels/${channelid}/addFriendtoChannel`,
        friend
      );
      return data;
    },
    onSuccess: () => {
      dispatch(setisopen(false));
      Client.refetchQueries(["channels"]);
      Client.refetchQueries(["channel"]);
    },
  });

  const handelClick = () => {
    setinput("");
    addFriend.mutate(channel.id);
  };
  return (
    <div className="my-2 mx-auto w-[92%] h-12 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-md flex items-center justify-between">
      <div className="flex items-center">
        <Image
          className="mx-2 h-8 w-8 rounded-full"
          src={friend?.image}
          width={1000}
          height={1000}
          alt=""
        />
        <h1 className="ml-2 text-blue font-semibold ">{friend.username}</h1>
      </div>
      <button
        className="bg-blue text-white   px-3 mx-3 rounded-md"
        onClick={handelClick}
      >
        add
      </button>
    </div>
  );
};

export default AddFriend;
