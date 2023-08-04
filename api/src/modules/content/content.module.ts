import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../database/database.module';

import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import * as controllers from './controllers';
import * as entities from './entities';
import * as repositories from './repositories';
import * as services from './services';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '600s' },
        }),
        TypeOrmModule.forFeature(Object.values(entities)),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
    controllers: Object.values(controllers),
    providers: [...Object.values(services), JwtStrategy],
    exports: [
        ...Object.values(services),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
})
export class ContentModule {}
