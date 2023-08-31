import axios from 'axios';
import { useMutation, useQuery} from "@tanstack/react-query";
import { Client } from '@/providers/QueryProvider';

const AddFriend = ({id} : {id : string}) => {

    const Status = useQuery({
        queryKey: ['friendStatus'],
        queryFn: async ()=> {
          const {data} = await axios.get(`http://localhost:8000/friendship/status/${id}`, { withCredentials: true })
          return data;
        }
    });

    const sendRequest = useMutation({
        mutationKey: ['sendRequest'],
        mutationFn: async(name: string) => {
          const {data} = await axios.post(`http://localhost:8000/friendship/sendRequest/${name}`, name, { withCredentials: true });
          return data;
        },
        onSuccess: () => {
            Client.refetchQueries('friendStatus');
        }
    });

    const removeOrCancelFriend = useMutation({
        mutationKey: ['removeOrCancelFriend'],
        mutationFn: async(name: string) => {
            const {data} = await axios.delete(`http://localhost:8000/friendship/${name}`, { withCredentials: true });
            return data;
        },
        onSuccess: () => {
            Client.refetchQueries('friendStatus');
        }
    });

    const Accept = useMutation({
        mutationKey: ['acceptFriendRequest'],
        mutationFn: async(sender: string) => {
          const {data} = await axios.patch(`http://localhost:8000/friendship/acceptRequest/${sender}`, sender, {withCredentials: true});
          return data;
        },
        onSuccess: () => {
          Client.refetchQueries('friendrequests');
        }
      })

    const handleAddFriend = async () => {
        await sendRequest.mutate(id);
    }

    const handleRemoveOrCancelFriend = async () => {
        await removeOrCancelFriend.mutate(id);
    }

    const handleAcceptFriend = async () => {
        await Accept.mutate(id);
    }

    console.log(Status.data);
    if (Status.isLoading)
        return <div>loading...</div>
    else if (Status.data.status === 'none')
        return <button className='bg-blue text-black px-3 py-1 rounded-xl' onClick={handleAddFriend}>Add Friend</button>
    else if (Status.data.status === 'pending' && Status.data.sender != id)
        return <button className='bg-blue px-3 py-1 text-black rounded-xl' onClick={handleRemoveOrCancelFriend}>Cancel Request</button>
    else if (Status.data.status === 'pending' && Status.data.sender === id)
        return (
            <div className='flex flex-col gap-2'>
                <button className='bg-blue px-3 py-1 text-black rounded-xl' onClick={handleAcceptFriend}>Accept</button>
                <button className='bg-red px-3 py-1 text-black rounded-xl' onClick={handleRemoveOrCancelFriend}>Decline</button>
            </div>
        )
    else if (Status.data.status === 'accepted')
        return <button className='bg-red px-3 py-1 text-black rounded-xl' onClick={handleRemoveOrCancelFriend}>Remove Friend</button>

}

export default AddFriend;