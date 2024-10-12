import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";
@Schema({ timestamps: true })
export class Issue {
    @Prop()
    title: string;
    @Prop()
    description: string;
    @Prop()
    status: string;
    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
    raiser: User;
}
export const issueSchema = SchemaFactory.createForClass(Issue);