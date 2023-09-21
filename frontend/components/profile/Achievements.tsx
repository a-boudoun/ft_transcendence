import Title from "./Title";

const Achievements = ({user} : {user : any}) => {
  return (
    <div className="flex flex-col grow rounded-3xl shadow-2xl xl:bg-white xl:bg-opacity-20 xl:ackdrop-blur-lg xl:drop-shadow-lg">
      <div className="hidden xl:block rounded-t-3xl p-4 ">
        <Title
          isActive={true}
          str="Achievements"
          src="/icons/profile/Achievements.svg"
        />
      </div>
      <div className="flex flex-col gap-4 p-4 xl:rounded-b-3xl">
        <div className="flex flex-col p-4 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-2xl">
          <h3 className="text-3xl ">YOU ARE HER</h3>
          <p className="text-[12px] text-blue"> you login for the first time</p>
        </div>
        {
          user.wins > 0 &&
          <div className="flex flex-col  p-4 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-2xl">
            <h3 className="text-3xl "> DASR </h3>
            <p className="text-[12px] text-blue"> you won your first game </p>
          </div>
        }
      </div>
    </div>
  );
};

export default Achievements;
