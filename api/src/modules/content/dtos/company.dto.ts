import { IsString, Length, IsEmail, IsNotEmpty, IsUUID, IsDefined } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { IsDataExist } from '@/modules/database/constraints';

import { RoleEntity } from '../entities';

@DtoValidation({ groups: ['create'] })
export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty({ groups: ['create'], message: 'companyName can not be empty' })
    @Length(1, 100)
    companyName: string;

    @IsString()
    @IsNotEmpty({ groups: ['create'], message: 'password can not be empty' })
    @Length(6, 20)
    password: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty({ groups: ['create'], message: 'email can not be empty' })
    email: string;

    @IsString()
    @IsNotEmpty({ groups: ['create'], message: 'phone can not be empty' })
    phone: string;

    @IsDataExist(RoleEntity, {
        each: true,
        always: true,
        message: '分类不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '分类ID格式不正确',
    })
    @IsNotEmpty({ always: true })
    role?: string;
}

@DtoValidation({ groups: ['query'] })
export class QueryCompanyDto {}

@DtoValidation({ groups: ['auth'] })
export class AuthCompanyDto {
    @IsString()
    @IsNotEmpty({ groups: ['auth'], message: 'companyName can not be empty' })
    @Length(1, 100)
    companyName: string;

    @IsString()
    @IsNotEmpty({ groups: ['auth'], message: 'companyName can not be empty' })
    @Length(6, 20)
    password: string;
}

@DtoValidation({ groups: ['update'] })
export class UpdateCompanyDto {
    @IsUUID(undefined, { groups: ['update'], message: 'wrong id format' })
    @IsDefined({ groups: ['update'], message: 'you need provide id' })
    id!: string;
}

@DtoValidation({ groups: ['update'] })
export class UpdateCompanyPSWDto {
    @IsString()
    @IsNotEmpty({ groups: ['update'], message: 'company password can not be empty' })
    @Length(6, 20)
    password: string;
}

@DtoValidation()
export class DeleteCompanyDto {
    @IsUUID(undefined, { groups: ['delete'], message: 'id wrong format' })
    @IsDefined({ groups: ['delete'], message: 'you must provide id' })
    id!: string;
}
