import Title from "./Title";

const Achievements = () => {
        return (
            <div className="xl:flex xl:flex-col xl:grow">
                <div className="hidden xl:block xl:bg-light-gray xl:rounded-t-3xl xl:p-4 ">
                    <Title isActive={true} str='Achievements' src='/icons/profile/blue/Achievements.svg'/>
                </div>
                <div className="grow grid place-content-center bg-light-gray xl:rounded-b-3xl">
                   achievements   
                </div>
            </div>
        )
};

export default Achievements;