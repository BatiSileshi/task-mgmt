import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ExpressRequest } from "src/modules/user/interface/express-request.interface";
import { UserRole } from "src/utils/enums";

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<ExpressRequest>();
        if(request.user.role === UserRole.SuperAdmin){
            return true;
        }
        throw new HttpException('You are not allowed to access.', HttpStatus.UNAUTHORIZED);
    }
}