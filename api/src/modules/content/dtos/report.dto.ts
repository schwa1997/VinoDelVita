import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDateString,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';

import { SelectTrashMode } from '@/modules/database/constants';
import { IsDataExist } from '@/modules/database/constraints';

import { PaginateOptions } from '@/modules/database/types';

import { ReportOrderType } from '../constants';
import { AreaEntity, CompanyEntity, VineyardEntity } from '../entities';

/**
 * 文章分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryReportDto implements PaginateOptions {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode;

    @IsDateString({ strict: true }, { always: true })
    @IsOptional({ always: true })
    createdAt?: Date;

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
    area?: string;

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
    vineyard?: string;

    @IsDataExist(CompanyEntity, {
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
    company?: string;

    @IsEnum(ReportOrderType, {
        message: `排序规则必须是${Object.values(ReportOrderType).join(',')}其中一项`,
    })
    @IsOptional()
    orderBy?: ReportOrderType;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page: number;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 5;
}

/**
 * 文章创建验证
 */
@DtoValidation({ groups: ['create'] })
export class CreateReportDto {
    @MaxLength(255, {
        always: true,
        message: '文章标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @IsOptional({ groups: ['update'] })
    title!: string;

    @IsNotEmpty({ groups: ['create'], message: '文章内容必须填写' })
    @IsOptional({ groups: ['update'] })
    description!: string;

    @IsDateString({ strict: true }, { always: true })
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    createdAt?: Date;

    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    disease?: string;

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
    area?: string;

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
    vineyard?: string;

    @IsDataExist(CompanyEntity, {
        each: true,
        always: true,
        message: '分类不存在',
    })
    @IsNotEmpty({ message: 'company必须填写' })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '分类ID格式不正确',
    })
    @IsOptional({ always: true })
    company!: string;

    @IsNotEmpty({ groups: ['create', 'update'], message: 'the report status' })
    status?: number;
}

/**
 * 文章更新验证
 */
@DtoValidation({ groups: ['update'] })
export class UpdateReportDto extends PartialType(CreateReportDto) {
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    id!: string;
}

@DtoValidation()
export class DeleteReportDto {
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
