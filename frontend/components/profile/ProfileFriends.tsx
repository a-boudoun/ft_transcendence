import Title from "./Title";
import Frineds from "@/components/common/Friends";

const ProfileFriends = () => {
        return (
            <div className="lg:flex lg:flex-col lg:grow">
                <div className="hidden lg:block lg:bg-light-gray lg:rounded-t-3xl lg:py-4">
                    <Title isActive={true} str='Friends' src='/icons/profile/blue/Friends.svg'/>
                </div>
                <div className="grow grid place-content-center bg-light-gray xl:rounded-b-3xl">
                   <Frineds />   
                </div>
            </div>
        )
};

export default ProfileFriends;