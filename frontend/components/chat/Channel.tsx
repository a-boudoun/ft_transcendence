import ChNav from "./ChNav";
import Messeges from "./Messeges";
import Friends from "@/components/common/Friends";
import userDto from "@/dto/userDto";

const Channel = async() => {
    // const data: userDto[] = await getData('/users');
    // console.log("channel");
    return (
        <div className={`h-full`}>
            <ChNav />
            <Messeges data={data}  path="/chat"/>
        </div>
    );
}

export default Channel;