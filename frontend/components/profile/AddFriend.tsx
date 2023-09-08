import axios from '@/apis/axios';
import { useMutation, useQuery} from "@tanstack/react-query";
import { Client } from '@/providers/QueryProvider';

const AddFriend = ({name, Status} : {name: string, Status: any}) => {

    const sendRequest = useMutation({
        mutationKey: ['sendRequest'],
        mutationFn: async(name: string) => {
          const {data} = await axios.post(`/friendship/sendRequest`, {receiver: name});
          return data;
        },
        onSuccess: () => {
            Client.refetchQueries('friendStatus');
        }
    });

    const removeOrCancelFriend = useMutation({
        mutationKey: ['removeOrCancelFriend'],
        mutationFn: async(name: string) => {
            const {data} = await axios.delete(`/friendship/${name}`);
            return data;
        },
        onSuccess: () => {
            Client.refetchQueries('friendStatus');
        }
    });

    const Accept = useMutation({
        mutationKey: ['acceptFriendRequest'],
        mutationFn: async(sender: string) => {
          const {data} = await axios.patch(`/friendship/acceptRequest`, {sender: sender});
          return data;
        },
        onSuccess: () => {
          Client.refetchQueries('friendrequests');
        }
    })

    const handleAddFriend = async () => {
        await sendRequest.mutate(name);
    }

    const handleRemoveOrCancelFriend = async () => {
        await removeOrCancelFriend.mutate(name);
    }

    const handleAcceptFriend = async () => {
        await Accept.mutate(name);
    }

    if (Status.data?.status === 'none')
        return <button className='bg-blue text-black px-3 py-1 rounded-xl' onClick={handleAddFriend}>Add Friend</button>
    else if (Status.data?.status === 'pending' && Status.data?.sender != name)
        return <button className='bg-blue px-3 py-1 text-black rounded-xl' onClick={handleRemoveOrCancelFriend}>Cancel Request</button>
    else if (Status.data?.status === 'pending' && Status.data?.sender === name)
        return (
            <div className='flex flex-col gap-2'>
                <button className='bg-blue px-3 py-1 text-black rounded-xl' onClick={handleAcceptFriend}>Accept</button>
                <button className='bg-red px-3 py-1 text-black rounded-xl' onClick={handleRemoveOrCancelFriend}>Decline</button>
            </div>
        )
    else if (Status.data?.status === 'accepted')
        return <button className='bg-red px-3 py-1 text-black rounded-xl' onClick={handleRemoveOrCancelFriend}>Remove Friend</button>

}

export default AddFriend;