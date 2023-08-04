import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcrypt';

import { CompanyService } from '@/modules/content/services';

@Injectable()
export class AuthService {
    constructor(private userService: CompanyService, private jwtService: JwtService) {}

    async login(companyName: string, password: string) {
        try {
            const user = await this.userService.findByName(companyName);

            if (!user) {
                throw new Error('User not found');
            }

            if (bcrypt.compareSync(password, user.password)) {
                const payload = {
                    companyName: user.companyName,
                    role: user.role.name,
                    sub: user.id,
                };
                const accessToken = this.jwtService.sign(payload);
                const { role } = payload;
                const username = payload.companyName;
                const id = payload.sub;

                return {
                    accessToken,
                    role,
                    username,
                    id,
                };
            }
            throw new Error('Invalid password');
        } catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
        }
    }

    async validateUserByJwt(payload: any) {
        if (payload.userName === 'admin') {
            return { userName: 'admin' };
        }
        return null;
    }

    async validateAdminByJwt(payload: any) {
        if (payload.role === 'admin') {
            return { role: 'admin' };
        }
        return null;
    }

    async profile(id: string) {
        const user = await this.userService.detail(id);
        return user;
    }
}
