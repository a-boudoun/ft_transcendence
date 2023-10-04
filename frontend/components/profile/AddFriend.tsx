import axios from "@/apis/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Client } from "@/providers/QueryProvider";

const AddFriend = ({ id, Status }: { id: number; Status: any }) => {
  const sendRequest = useMutation({
    mutationKey: ["sendRequest"],
    mutationFn: async (id: number) => {
      const { data } = await axios.post(`/friendship/sendRequest`, {
        receiver: id,
      });
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(["friendStatus"]);
    },
  });

  const removeOrCancelFriend = useMutation({
    mutationKey: ["removeOrCancelFriend"],
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(`/friendship/${id}`);
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(["friendStatus"]);
      Client.refetchQueries(["friends"]);
    },
  });

  const Accept = useMutation({
    mutationKey: ["acceptFriendRequest"],
    mutationFn: async (sender: number) => {
      const { data } = await axios.patch(`/friendship/acceptRequest`, {
        sender: sender,
      });
      return data;
    },
    onSuccess: () => {
      Client.refetchQueries(["friendrequests"]);
      Client.refetchQueries(["friends"]);
    },
  });

  const handleAddFriend = async () => {
    await sendRequest.mutate(id);
  };

  const handleRemoveOrCancelFriend = async () => {
    await removeOrCancelFriend.mutate(id);
  };

  const handleAcceptFriend = async () => {
    await Accept.mutate(id);
  };

  if (Status.data?.status === "none")
    return (
      <button
        className="bg-blue text-black px-3 py-1 rounded-xl"
        onClick={handleAddFriend}
      >
        Add Friend
      </button>
    );
  else if (Status.data?.status === "pending" && Status.data?.sender != id)
  {
    return (
      <button
        className="bg-blue px-3 py-1 text-black rounded-xl"
        onClick={handleRemoveOrCancelFriend}
      >
        Cancel Request
      </button>
    );
  }
  else if (Status.data?.status === "pending" && Status.data?.sender === id)
  {
    return (
      <div className="flex flex-col gap-2">
        <button
          className="bg-blue px-3 py-1 text-black rounded-xl"
          onClick={handleAcceptFriend}
        >
          Accept
        </button>
        <button
          className="bg-red px-3 py-1 text-black rounded-xl"
          onClick={handleRemoveOrCancelFriend}
        >
          Decline
        </button>
      </div>
    );
  }

  else if (Status.data?.status === "accepted")
    return (
      <button
        className="bg-red px-3 py-1 text-black rounded-xl"
        onClick={handleRemoveOrCancelFriend}
      >
        Remove Friend
      </button>
    );
};

export default AddFriend;
