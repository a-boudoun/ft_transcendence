import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import getData from "@/apis/getData";

interface userDto
{
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

const Friends = async() => {

    const friends: userDto[] = await getData(`https://jsonplaceholder.typicode.com/photos?_limit=30`);

    friends.map((friend: userDto) => {
      
      });

    return (
        <div className={`h-full mt-2 flex  flex-col overflow-y-scroll`}>
            {
                friends.map((friend: userDto) => {
                    return (
                        <Link href={`/profile/${friend.id}`} key={friend.id}>
                            click
                        </Link>
                    );
                })
            }
        </div>
    );
}
 
export default Friends;


export const Message = ({msg}:{msg: userDto}) => { 
    const path = usePathname();
    console.log(path.at(-1));
    const style = path.at(-1) === msg.id.toString() ? "bg-light-gray" : "bg-dark-gray";
    return (
        <div className={`${style} flex justify-between h-fit px-4 py-2 my-1 mx-2 rounded-xl text-white`}>
            <div className="flex items-center space-x-5">
                <Image
                className="rounded-full self-center"
                src={msg.url}
                width={42}
                height={42}
                alt=""
                />
                <h3>{msg.id}</h3>
                
            </div>
            <div className="flex items-center space-x-2  justify-between">
                <Image
                className="rounded-full"
                src="/img/block.svg"
                width={26}
                height={26}
                alt=""
                />
                <Image
                className="rounded-full"
                src="/img/play.svg"
                width={26}
                height={26}
                alt=""
                />
            </div>
        </div>
    );
}
 