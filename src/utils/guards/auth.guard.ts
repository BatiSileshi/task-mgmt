import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ExpressRequest } from "src/modules/user/interface/express-request.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<ExpressRequest>();
        // console.log("🚀 ~ AuthGuard ~ canActivate ~ request:", request)
        // console.log("🚀 USERRRRRR", request.user)
        if(request.user){
            return true;
        }
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
}