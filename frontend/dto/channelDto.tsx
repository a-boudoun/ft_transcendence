import { channelSchema } from "@/models/channel";
import { z } from  'zod' 

type channelDto = z.infer<typeof channelSchema>

export default channelDto ;