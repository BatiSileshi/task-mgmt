import { Controller, Post, Get, Put, Delete, Body, Res, UseGuards, Param, NotFoundException} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ArchiveUserDto, CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { LoginUserDto } from "./dto/auth.dto";
import { AuthService } from "./auth/auth.service";
import { AuthGuard } from "src/utils/guards/user/auth.guard";
import { CurrentUser } from "./decorator/user.decorator";
import { User } from "./schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { SuperAdminGuard } from "src/utils/guards/user/admin.guard";

@ApiTags('Users')
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
    @Get('get-my-profile')
    @ApiOperation({summary: 'Get currently logged in user information'})
    @UseGuards(AuthGuard)
    async getUser(@CurrentUser() user: User){
        return this.userService.getUser(user.id);
    }
    @Get('get-user/:id')
    @ApiOperation({summary: 'See other user profile'})
    @UseGuards(AuthGuard)
    async getUserProfile(@Param('id') id: string){
        return this.userService.getUser(id);
    }
    @Get('get-user-by-email/:email')
    @ApiOperation({summary: 'Get user by email'})
    async getUserByEmail(@Param('email') email: string) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found.`);
        }
        return user;
    }
    @Put('update-profile')
    @ApiOperation({ summary: 'Update profile', description: 'Logged in user can update his profile' })
    @UseGuards(AuthGuard)
    async updateUser(@Body() body: UpdateUserDto, @CurrentUser() user: User){
        return await this.userService.updateUser(body, user);
    }
    @Delete('archive-user')
    @ApiOperation({summary: 'Admin can archive user'})
    @UseGuards(AuthGuard, SuperAdminGuard)
    async archiveUser(@Body() archiveUser: ArchiveUserDto){
        return await this.userService.archiveUser(archiveUser);
    }
    @Put('restore-user/:id')
    @ApiOperation({summary: 'Admin can restore archived user'})
    @UseGuards(AuthGuard, SuperAdminGuard)
    async restoreUser(@Param('id') id: string){
        return await this.userService.restoreUser(id);
    }
    @Delete('delete-user/:id')
    @ApiOperation({summary: 'Admin can delete user'})
    @UseGuards(AuthGuard, SuperAdminGuard)
    async deleteUser(@Param('id') id: string){
        return await this.userService.deleteUser(id);
    }
}