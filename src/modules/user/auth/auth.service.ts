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
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<IsUser>,
        private readonly utilFunctions: UtilFunctions,
        private readonly userService: UserService,
        private mailerService: MailerService,
        private confgiService: ConfigService

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
     //forgot password
    async sendEmailForgotPassword(email: string): Promise<boolean> {
        const user = await this.userService.findUserByEmail(email);
      
        if (!user) {
          throw new NotFoundException('User not found.');
        }
      
        const token = await this.createForgotPasswordToken(email);
      
        if (token && token.newPasswordToken) {
          const resetLink = `${this.confgiService.get('RESET_LINK_BASE_URL')}/${token.newPasswordToken}`;
          const emailSent = await this.sendResetPasswordEmail(email, resetLink);
      
          return emailSent;
        }
      
        return false;
      }


      async sendResetPasswordEmail(email: string, resetLink: string): Promise<boolean> {
        try {
            const mailOptions = {
              to: email,
              subject: 'Password Reset Request',
              text: `
              Please click the following link to reset your password: ${resetLink}`,
              
              html: `
              <p>You are receiving this email because you requested a password reset for your user account at ELST Task Management.</p>

              <p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
              
              <p>Thanks for using ELST Task Management.</p>
              `,
            };
        
            await this.mailerService.sendMail(mailOptions);
        
            return true;
          } catch (error) {

            return false;
          }
      }
    


    async createForgotPasswordToken(email: string): Promise<{ newPasswordToken: string }> {
        const user = await this.userService.findUserByEmail(email);
      
        if (!user) {
          throw new NotFoundException('User not found.');
        }
      
        // Generate a random token or use any token generation mechanism of your choice
        const newPasswordToken = generateRandomToken();
      
        // Save the token to the user's record or token store
        user.forgotPasswordToken = newPasswordToken;
        await user.save();
      
        return {
          newPasswordToken,
        };
      }


      async resetPassword(resetToken: string, newPassword: string): Promise<void> {
        const user = await this.userService.findUserByResetToken(resetToken);
        if (!user) {
          throw new NotFoundException('Invalid or expired reset token');
        }
      
        // hash user password
        //generate a salt
        const salt = randomBytes(8).toString('hex');
        // hash the salt and password together
        const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
        // join the hashed and salt together
        const result = salt + '.' + hash.toString('hex');
        // Update the user's password with the new password
        user.password = result;
        user.forgotPasswordToken = null; // Clear the reset token
      
        await user.save();
      }
}

//generate random token for password reset
function generateRandomToken(): string {
    const tokenLength = 20;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
  
    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
  
    return token;
  }  