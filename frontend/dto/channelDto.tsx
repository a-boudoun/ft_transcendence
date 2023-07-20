import { channelSchema } from "@/models/channel";
import { z } from  'zod' 


type channelDto = z.infer<typeof channelSchema>

// interface channelDto {
//     name?: string;
//     image?: string;
//     type?: string;
//     owner?: string;
//     password?: string;
// }

export default channelDto ;