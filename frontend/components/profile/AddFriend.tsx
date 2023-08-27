import axios from 'axios';
import { useMutation, useQuery} from "@tanstack/react-query";
import { Client } from '@/Providers/QueryProvider';

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
        return <button className='bg-blue text-sm px-4 py-[2px] text-black rounded-md' onClick={handleAddFriend}>Add Friend</button>
    else if (Status.data.status === 'pending' && Status.data.sender != id)
        return <button className='bg-blue text-sm px-4 py-[2px]  text-black rounded-md' onClick={handleRemoveOrCancelFriend}>Cancel Request</button>
    else if (Status.data.status === 'pending' && Status.data.sender === id)
        return (
            <div className=''>
                <button className='bg-red text-sm px-4 py-[2px]  text-white rounded-md' onClick={handleRemoveOrCancelFriend}>Decline</button>
                <button className='bg-blue text-sm px-4 py-[2px]  text-black rounded-md' onClick={handleAcceptFriend}>Accept</button>
            </div>
        )
    else if (Status.data.status === 'accepted')
        return <button className='bg-red text-sm px-4 py-[2px]  text-black rounded-md' onClick={handleRemoveOrCancelFriend}>Remove Friend</button>

}

export default AddFriend;