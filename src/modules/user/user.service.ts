import { BadRequestException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IsUser } from "./interface/user.interface";

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') 
        private userModel: Model<IsUser>
    ){}
    async createUser(firstName: string, lastName: string, email:string, password:string):Promise<IsUser>{
        try {
            const user = await this.userModel.create({ firstName, lastName, email, password });
            return user;
        } catch (error) {
            throw new BadRequestException(`Error creating user: ${error.message}`);
        }
    }

}