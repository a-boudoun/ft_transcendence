import Title from "./Title";
import Frineds from "@/components/common/Friends";

const ProfileFriends = () => {
        return (
            <div className="lg:flex lg:flex-col lg:grow">
                <div className="hidden lg:block bg-light-gray rounded-t-3xl py-4">
                    <Title isActive={true} str='Friends' src='/icons/profile/Friends.svg'/>
                </div>
                <div className="h-full grow bg-light-gray rounded-b-3xl overflow-hidden p-4">
                   <Frineds isChat={false} />   
                </div>
            </div>
        )
};

export default ProfileFriends;