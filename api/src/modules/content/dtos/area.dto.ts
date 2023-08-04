import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { IsDataExist } from '@/modules/database/constraints';

import { CompanyEntity } from '../entities';

@DtoValidation({ groups: ['query'] })
export class QueryAreaDto {
    @IsNotEmpty({ groups: ['query'], message: 'is not empty' })
    name?: string;

    @IsDataExist(CompanyEntity, {
        message: 'company non exist',
    })
    @IsUUID(undefined, { message: 'company ID wong format' })
    companies?: string[];
}

@DtoValidation({ groups: ['create'] })
export class CreateAreaDto {
    @MaxLength(25, { always: true, message: 'the name of board is no longer than 25' })
    @IsNotEmpty({ groups: ['create'], message: 'is not empty' })
    name!: string;

    @IsNotEmpty({ groups: ['create'], message: 'is not empty' })
    code: string;

    @IsNotEmpty({ groups: ['create'], message: 'is not empty' })
    geometry: string;

    @IsDataExist(CompanyEntity, {
        each: true,
        always: true,
        message: 'company not exist',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'company ID format not correct',
    })
    @IsOptional({ always: true })
    company?: string;
}

@DtoValidation({ groups: ['update'] })
export class UpdateAreaDto {
    @IsUUID(undefined, { groups: ['update'], message: 'wrong id format' })
    @IsDefined({ groups: ['update'], message: 'you need provide id' })
    id!: string;

    @MaxLength(25, { always: true, message: 'the name of board is no longer than 25' })
    @IsNotEmpty({ groups: ['update'], message: 'is not empty' })
    name!: string;

    @IsDataExist(CompanyEntity, {
        each: true,
        always: true,
        message: 'company not exist',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'company ID format not correct',
    })
    @IsOptional({ always: true })
    company?: string;
}

@DtoValidation()
export class DeleteAreaDto {
    @IsUUID(undefined, { groups: ['delete'], message: 'id wrong format' })
    @IsDefined({ groups: ['delete'], message: 'you must provide id' })
    id!: string;
}
