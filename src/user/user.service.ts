import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService) {}

    async getUserByEmail(email: string){
        // call db
        return await this.prismaService.user.findFirst({ where:{ email } })
    }

    async createUser(registerDto: RegisterDto){
        return await this.prismaService.user.create({ data: registerDto });
    }
}
