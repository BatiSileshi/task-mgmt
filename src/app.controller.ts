import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './modules/user/auth/auth.service';
import { ResetPasswordDto } from './modules/user/dto/auth.dto';



@ApiTags('Forgot password')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly userService: AuthService,
    ) {}


  @Get('/forgot-password/:email')
  async sendForgotPasswordEmail(@Param('email') email: string): Promise<string> {
    try {
      const isEmailSent = await this.userService.sendEmailForgotPassword(email);
      if (isEmailSent) {
        return 'Email sent';
      } else {
        throw new BadRequestException('Email not sent');
      }
    } catch (error) {
      console.log('Error', error);
      throw new BadRequestException('Error sending email');
    }
  }



  @Post('/reset-password/:resetToken')
  async resetPassword(
    @Param('resetToken') resetToken: string,
    @Body() body: ResetPasswordDto,
  ): Promise<string>{
    try {
      await this.userService.resetPassword(resetToken, body.password);
      return 'Password reset successfully.';
    }catch(error){
      throw new BadRequestException('Error while resetting.')
    }
  }


}
