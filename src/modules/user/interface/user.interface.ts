import { Document } from "mongoose";
export interface IsUser extends Document {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
}