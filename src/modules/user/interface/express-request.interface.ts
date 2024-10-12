import { User } from "../schema/user.schema";
import { Request } from "express";

export interface ExpressRequest extends Request {
    user?: User
}