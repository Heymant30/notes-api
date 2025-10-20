import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService){}

    async register(registerDto: RegisterDto){
        // check email already exists or not
        // stored hashed password
        // create User
        // return jwt token after registration completion
        const user = await this.userService.getUserByEmail(registerDto.email);
        if(user){
            throw new ConflictException("Email already taken")
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
        console.log(hashedPassword)
        const newUser = await this.userService.createUser({...registerDto, password: hashedPassword})
        const payload = {
            sub: newUser.id,
            email: newUser.email
        }
        this.logger.log(`new user has been created with id ${newUser.id}`)
        return {
            access_token: await this.jwtService.signAsync(payload),
        };   
    }

    async login(loginDto: LoginDto){
        // 1. get user from db
        // 2. match the password
        // 3. create and return jwt token
        const user = await this.userService.getUserByEmail(loginDto.email)
        if(!user) {
            throw new UnauthorizedException('Invali Credentials'); 
        }

        const isPassSame = await bcrypt.compare(loginDto.password, user.password);
        if(!isPassSame){
            throw new UnauthorizedException('Invali Credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email
        }
        return {
            access_token: await this.jwtService.signAsync(payload),
        };   
    }
}
