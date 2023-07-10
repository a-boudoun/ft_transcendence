import ChNav from "./ChNav";
import Messeges from "./Messeges";

const Channel = ({isChannel}:{isChannel: boolean}) => {
    const s = isChannel ? '' : 'hidden';
    return (
        <div className={`${s} h-full`}>
            <ChNav />
            <Messeges />
        </div>
    );
}

export default Channel;