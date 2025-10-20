import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
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

        return {
            access_token: this.jwtService.signAsync(payload),
        };   
    }
}
