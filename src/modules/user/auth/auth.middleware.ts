import { Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "../user.service";
import { ExpressRequest } from "../interface/express-request.interface";
import { NextFunction } from "express";
import { jwtConstants } from "src/utils/constants";
import { JwtPayload, verify } from 'jsonwebtoken';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
    ){}
    async use(req:ExpressRequest, _:Response, next: NextFunction){
        if(!req.headers.authorization){
            req.user = null;
            next();
            return ;
        }
        const accessToken = req.headers.authorization.split(' ')[1];
        try {
            const decode = verify(accessToken, jwtConstants.secret) as JwtPayload;
            const user = await this.userService.getUser(decode.id);            
            req.user = user;
            next();
        }catch(error){
            console.error("Error verifying token or fetching user:", error);
            req.user = null;
            next();
        }

    }
}