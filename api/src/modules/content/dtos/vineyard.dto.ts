import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDateString,
    IsDefined,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    MaxLength,
    ValidateIf,
} from 'class-validator';

import { isNil } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';

import { IsDataExist } from '@/modules/database/constraints';

import { AreaEntity, InterventionEntity, VineyardEntity } from '../entities';

/**
 * 文章分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryVineyardDto {
    @MaxLength(255, {
        always: true,
        message: 'vineyardName max $constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @IsDateString({ strict: true }, { always: true })
    @IsOptional({ always: true })
    @ValidateIf((value) => !isNil(value.publishedAt))
    @Transform(({ value }) => (value === 'null' ? null : value))
    createdAt?: Date;

    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    disease?: string[];

    @IsOptional({ always: true })
    execution: string;

    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    winetype?: string;

    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    areanumber?: number;

    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    yearofplanning?: number;

    @IsDataExist(AreaEntity, {
        each: true,
        always: true,
        message: '分类不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '分类ID格式不正确',
    })
    @IsOptional({ always: true })
    reports?: string[];

    @IsDataExist(VineyardEntity, {
        each: true,
        always: true,
        message: '分类不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '分类ID格式不正确',
    })
    @IsOptional({ always: true })
    area?: string;
}

/**
 * 文章创建验证
 */
@DtoValidation({ groups: ['create'] })
export class CreateVineyardDto {
    @MaxLength(255, {
        always: true,
        message: 'vineyardName长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @IsOptional({ groups: ['update'] })
    name?: string;

    @MaxLength(255, {
        each: true,
        always: true,
        message: 'typeOfWine长度最大为$constraint1',
    })
    @IsOptional({ groups: ['update'] })
    winetype?: string;

    @IsOptional({ always: true })
    execution: string;

    @IsNotEmpty({ groups: ['create', 'update'], message: ' yearOfPlaning' })
    yearofplanning?: string;

    @IsNotEmpty({ groups: ['create'], message: 'is not empty' })
    geometry: string;

    @IsDataExist(AreaEntity, {
        each: true,
        always: true,
        message: 'area不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'areaID格式不正确',
    })
    area?: string;
}

/**
 * 文章更新验证
 */
@DtoValidation({ groups: ['update'] })
export class UpdateVineyardDto extends PartialType(CreateVineyardDto) {
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    id!: string;

    @IsDataExist(InterventionEntity, {
        each: true,
        always: true,
        message: 'area不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'areaID格式不正确',
    })
    @IsOptional({ groups: ['update'] })
    interventions?: string[];
}
@DtoValidation()
export class DeleteVineyardDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID wrong format',
    })
    @IsDefined({
        each: true,
        message: 'ID is required',
    })
    ids: string[] = [];
}
