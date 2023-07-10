import Messeges from "./Messeges";

const Friend = ({ isFriend }: { isFriend: boolean }) => {
    const s = isFriend ? '' : 'hidden';
    
    return (

        <div className={`${s} h-full `}>
            <Messeges/>
        </div>

    );
}

export default Friend;