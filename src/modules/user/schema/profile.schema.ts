import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
@Schema({ timestamps: true })
export class Profile {
    @Prop()
    phoneNumber: string;
    @Prop()
    jobTitle: string;
    @Prop()
    location: string;

}
export const profileSchema = SchemaFactory.createForClass(Profile);