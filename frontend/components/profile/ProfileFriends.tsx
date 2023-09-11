import Title from "./Title";
import Frineds from "@/components/common/Friends";

const ProfileFriends = ({username} : {username : string}) => {
        return (
            <div className="lg:flex lg:flex-col lg:grow lg:rounded-3xl lg:shadow-2xl lg:bg-white lg:bg-opacity-20 lg:ackdrop-blur-lg lg:drop-shadow-lg">
                <div className="hidden lg:block rounded-t-3xl py-4">
                    <Title isActive={true} str='Friends' src='/icons/profile/Friends.svg'/>
                </div>
                <div className="h-full grow rounded-b-3xl overflow-hidden p-4">
                    <Frineds username={username} />   
                </div>
            </div>
        )
};

export default ProfileFriends;