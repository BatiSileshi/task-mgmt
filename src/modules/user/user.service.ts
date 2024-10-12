import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IsUser } from "./interface/user.interface";
import { ArchiveUserDto, UpdateUserDto } from "./dto/user.dto";
import { User } from "./schema/user.schema";
import { UtilFunctions } from "src/utils/utils";
import { UserRole } from "src/utils/enums";

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') 
        private userModel: Model<IsUser>,
        private readonly utilFunctions: UtilFunctions,
    ){}
    async createUser(firstName: string, lastName: string, email:string, password:string, phoneNumber: string, jobTitle: string, location: string, role: string):Promise<IsUser>{
        const existingUser = await this.findUserByEmail(email);
        if(existingUser){
            throw new BadRequestException("User already exist with this email.")
        }
        try {
            const hashedPassword = await this.utilFunctions.hashPassword(password);
            const newRole = UserRole.User;
            const user = await this.userModel.create({ firstName, lastName, email, password:hashedPassword, phoneNumber, jobTitle, location, role:newRole });
            return user;
        } catch (error) {
            throw new BadRequestException(`Error creating user: ${error.message}`);
        }
    }
    async getAllUsers():Promise<IsUser[]>{
        const users = await this.userModel.find();
        if(!users){
            throw new NotFoundException('Users not found.')
        }
        return users;
    }
    async getUser(id: string):Promise<User>{
        const user = await this.userModel.findById(id);
        if(!user){
            throw new NotFoundException('User not found.')
        }
        return user as User;
    }
    async findUserByEmail(email: string):Promise<IsUser>{
        return await this.userModel.findOne({ email }).exec();

    }
    async updateUser(updateUserDto: UpdateUserDto, ):Promise<IsUser>{
        const { id, ...userData } = updateUserDto;
        const user = await this.userModel.findByIdAndUpdate(id, userData, {new: true});
        return user;
    }
    async archiveUser(archiveUserDto: ArchiveUserDto): Promise<User>{
        const { id, ...archiveData } = archiveUserDto;
        return await this.userModel.findByIdAndUpdate(
            id,
            {isArchived: true, deletedAt: new Date()}, {new: true}
        )
    }
    async restoreUser(id: string): Promise<User>{
        return await this.userModel.findByIdAndUpdate(
            id,
            {isArchived: false, deletedAt: null, deletedBy: null}, {new: true}
        )
    }
    async deleteUser(id: string): Promise<boolean> {
        await this.userModel.findByIdAndDelete(id);
        return true;
    }
}