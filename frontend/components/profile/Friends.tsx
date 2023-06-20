import Title from "./Title";

const Friends = () => {
        return (
            <div className="lg:flex lg:flex-col lg:grow">
                <div className="hidden lg:block lg:bg-light-gray lg:rounded-t-3xl lg:py-4">
                    <Title isActive={true} str='Friends' src='/icons/profile/blue/Friends.svg'/>
                </div>
                <div className="grow grid place-content-center bg-light-gray lg:rounded-b-3xl">
                   Friends   
                </div>
            </div>
        )
};

export default Friends;