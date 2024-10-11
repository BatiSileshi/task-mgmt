import { promisify } from "util";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { sign } from 'jsonwebtoken';
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(
        
    ){}
}