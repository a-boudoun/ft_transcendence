import Title from "./Title";

const Matches = () => {
        return (
            <div className="xl:flex xl:flex-col xl:grow ">
                <div className="hidden xl:block xl:bg-light-gray xl:rounded-t-3xl xl:p-4 ">
                    <Title isActive={true} str='Matches' src='/icons/profile/Matches.svg'/>
                </div>
                <div className="grow grid place-content-center bg-light-gray xl:rounded-b-3xl">
                   matches   
                </div>
            </div>
        )
};

export default Matches;