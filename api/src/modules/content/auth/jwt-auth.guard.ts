// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { jwtConstants } from './constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            // eslint-disable-next-line no-prototype-builtins
            if (!payload.hasOwnProperty('role')) {
                throw new UnauthorizedException('Invalid token payload');
            }

            request.user = payload; // Set the user information in the request
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token has expired');
            } else if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token');
            } else {
                throw new UnauthorizedException();
            }
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
