import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import getData from "@/apis/getData";
import userDto from "@/dto/userDto";

const Friends = async({id, isChat} : {id: string, isChat : boolean}) => {
    const friends: userDto[] = await getData('/users');

    const link = (isChat ? '/chat/' : '/profile/');
    
    return (
        <div className={'h-full flex flex-col gap-1 overflow-y-scroll rounded-2xl'}>
            {

                friends.map((friend: userDto) => {
                    return (
                        <Link href={`${link}${friend.username}`} >
                            <Friend user={friend} isChat={isChat} /> 
                        </Link>
                    );
                })
            }   
        </div>
    );
}

export default Friends;

export const Friend = ({user, isChat}: {user: userDto, isChat : boolean}) => {
    // const path = usePathname();
    // console.log(path.at(-1));
    // const style = path.at(-1) === user.id.toString() ? "bg-light-gray" : "bg-dark-gray";

    return (
        <div className={`flex justify-between px-4 py-2 mx-2 rounded-xl text-white bg-dark-gray`}>
            <div className="grow flex items-center gap-4">
                <Image  className="rounded-full self-center"  src={user.image}    width={48}  height={48}   alt="user image"
                />
                <h3>{user.username}</h3> 
            </div>
            <div className="flex items-center gap-4">
                {!isChat && 
                    <Image className="" src="/icons/navBar/chat.svg" width={24} height={24} alt="chat"
                    />
                }
                <Image className="" src="/icons/navBar/game.svg" width={24} height={24} alt="challenge"
                />
            </div>
        </div>
    );
}