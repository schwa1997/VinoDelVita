import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ContentModule } from '@/modules/content/content.module';

import { AuthService } from '../services/auth.service';

import { jwtConstants } from './constants';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
    imports: [
        ContentModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '600s' },
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
    exports: [AuthService],
})
export class AuthModule {}
