import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';
import { AuthService } from './auth/auth.service';
import { UserService } from './user.service';
import { UtilFunctions } from 'src/utils/utils';
import { UserController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    ],
    providers: [AuthService, UserService, UtilFunctions],
    controllers: [UserController],
    exports: [UserService]
})
export class UsersModule {}