import getData from "@/apis/getData";
import ChNav from "./ChNav";
import Messeges from "./Messeges";
import Friends from "@/components/common/Friends";
import userDto from "@/dto/userDto";

const Channel = async() => {
    const data: userDto[] = await getData('/users');
    console.log("channel");
    return (
            <ChNav data={data}  path="/chat"/>
    );
}

export default Channel;