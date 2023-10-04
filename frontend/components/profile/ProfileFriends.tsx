import Frineds from "@/components/common/Friends";
import { User2 } from "lucide-react";

const ProfileFriends = ({ id, isMe }: { id: number; isMe: boolean }) => {
  return (
    <div className="h-full lg:flex lg:flex-col lg:grow lg:rounded-3xl lg:shadow-2xl lg:bg-white lg:bg-opacity-20 lg:ackdrop-blur-lg lg:drop-shadow-lg">
      <div className="hidden lg:block rounded-t-3xl py-4">
      <div className={`h-[56px] w-fit flex justify-center items-center m-auto p-2 border-b border-blue`}>
          <User2 size={28} color="#7ac7c4" strokeWidth={2}/>
          <h2 className="hidden lg:inline text-[28px] ml-4">Friends</h2>
        </div>
      </div>
        <Frineds id={id} isMe={isMe} />
    </div>
  );
};

export default ProfileFriends;
