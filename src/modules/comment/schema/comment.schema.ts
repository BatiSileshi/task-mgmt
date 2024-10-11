import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop()
    comment: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User'})
    creator: User;
}
export const commentSchema = SchemaFactory.createForClass(User);