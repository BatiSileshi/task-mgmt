import { promisify } from "util";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { sign } from 'jsonwebtoken';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UtilFunctions } from "src/utils/utils";
import { IsUser, LoginUserInterface } from "../interface/user.interface";
import { UserRole } from "src/utils/enums";
import { UserService } from "../user.service";
import { jwtConstants } from "src/utils/constants";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<IsUser>,
        private readonly utilFunctions: UtilFunctions,
        private readonly userService: UserService,
    ){}
    async onModuleInit(){
        await this.createDefaultSuperAdmin();
    }

    async createDefaultSuperAdmin(){
        const superAdminExists = await this.userModel.exists({ role: UserRole.SuperAdmin }); 
        if(!superAdminExists){
            const hashedPassword = await this.utilFunctions.hashPassword('P@ssw0rd');
            const superAdminCommand = {
                firstName: 'Super',
                lastName: 'Admin',
                email: 'superadmin@gmail.com',
                password: hashedPassword,
                role: UserRole.SuperAdmin
            };
            const superAdmin = new this.userModel(superAdminCommand);
            await superAdmin.save();
            console.log('Super admin created successfully.')
        } else {
            console.log('SuperAdmin already exists.');
        }
    }
    async loginUser(email: string, password: string):Promise<LoginUserInterface>{
        const user = await this.userService.findUserByEmail(email);
        console.log("🚀 ~ AuthService ~ loginUser ~ user:", user)
        if(!user){
            throw new NotFoundException('User not found with this credential.')
        }
        if(user.isArchived === true){
            throw new BadRequestException("You are blocked.")
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('Incorrect password.');
        }
        try{
            const accessToken = this.generateJwt(user);
            const refreshToken = this.generateRefreshToken(user);
            return {
                accessToken,
                refreshToken
            };

        }catch(error){
            throw new BadRequestException("Error login. Try again later.")
            // console.log(error)
        }
    }

    generateJwt(user: IsUser): string{
        return sign({
            id: user._id,
            email: user.email,
            firstName: user.firstName, 
       }, jwtConstants.secret, { expiresIn: '1h' }
       );
    }
    
    generateRefreshToken(user: IsUser,): string {
        return sign({
            id: user._id,
            email: user.email,
            firstName: user.firstName
        }, jwtConstants.refreshSecret, { expiresIn: '7h' });
    }
}