import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const database = (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'schwa',
    database: 'GIS2023',
    entities: ['../modules/content/entities/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
});

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'schwa',
    database: 'GIS2023',
    entities: ['../modules/content/entities/*.entity{.ts,.js}'],
    synchronize: true,
});
