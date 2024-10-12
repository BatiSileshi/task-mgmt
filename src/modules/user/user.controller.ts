import { Controller, Post, Get, Put, Delete, Body, Res, UseGuards} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user.dto";
import { LoginUserDto } from "./dto/auth.dto";
import { AuthService } from "./auth/auth.service";
import { AuthGuard } from "src/utils/guards/auth.guard";

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly authService: AuthService,
    ){}
    @Post('create-user')
    @ApiOperation({summary: 'User registration'})
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ){
        const user = await this.userService.createUser(createUserDto.firstName, createUserDto.lastName, createUserDto.email, createUserDto.password, createUserDto.phoneNumber, createUserDto.jobTitile, createUserDto.location, createUserDto.role);
        return user;
    }
    @Post('login')
    @ApiOperation({summary: "Login endpoint"})
    async loginUser(
        @Body() loginUserDto: LoginUserDto
    ){
        const user = await this.authService.loginUser(loginUserDto.email, loginUserDto.password);        
        return user;
    }

}