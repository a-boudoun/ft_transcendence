import Title from "./Title";

const Matches = ({id} : {id : string | null}) => {
        return (
            <div className="xl:flex xl:flex-col xl:grow xl:rounded-3xl xl:shadow-2xl">
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