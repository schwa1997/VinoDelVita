import { Injectable } from '@nestjs/common';

import { isFunction, isNil, omit } from 'lodash';

import { In, EntityNotFoundError, SelectQueryBuilder } from 'typeorm';

import { SelectTrashMode } from '@/modules/database/constants';
import { paginate } from '@/modules/database/helpers';
import { QueryHook } from '@/modules/database/types';

import { ReportOrderType } from '../constants';
import { CreateReportDto, QueryReportDto, UpdateReportDto } from '../dtos/report.dto';
import { ReportEntity } from '../entities';
import { CompanyRepository, ReportRepository, VineyardRepository } from '../repositories';
import { AreaRepository } from '../repositories/area.repository';

import { AreaService } from './area.service';
import { CompanyService } from './company.service';
import { VineyardService } from './vineyard.service';

type FindParams = {
    [key in keyof Omit<QueryReportDto, 'limit' | 'page'>]: QueryReportDto[key];
};
/**
 * 文章数据操作
 */
@Injectable()
export class ReportService {
    constructor(
        protected repository: ReportRepository,
        protected vineyardRepository: VineyardRepository,
        protected companyRepository: CompanyRepository,
        protected areaRepository: AreaRepository,
        protected areaService: AreaService,
        protected companyService: CompanyService,
        protected vineyardService: VineyardService,
    ) {}

    /**
     * pagionation data
     * @param options options for pagination
     * @param callback add other queries
     */
    async paginate(id: string, options: QueryReportDto, callback?: QueryHook<ReportEntity>) {
        const qb = this.repository.buildBaseQB();
        qb.where('company.id = :id', { id }); // Chain the 'where' methods
        if (options.vineyard) {
            qb.where('company.id = :id', { id });
            qb.andWhere('vineyard.id = :vineyard', { vineyard: options.vineyard }); // Chain the 'andWhere' method for additional conditions
        }
        await this.buildListQuery(qb, options, callback);
        return paginate(qb, options);
    }

    protected async buildListQuery(
        qb: SelectQueryBuilder<ReportEntity>,
        options: FindParams,
        callback?: QueryHook<ReportEntity>,
    ) {
        const { orderBy, area, company, vineyard, trashed = SelectTrashMode.NONE } = options;

        if (trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY) {
            qb.withDeleted();
            if (trashed === SelectTrashMode.ONLY) qb.where(`report.deletedAt is not null`);
        }

        this.queryOrderBy(qb, orderBy);
        if (area) {
            await this.queryByArea(area, qb);
        }
        if (company) {
            await this.queryByCompany(company, qb);
        }
        if (vineyard) {
            await this.queryByVineyard(vineyard, qb);
        }

        if (callback) return callback(qb);
        return qb;
    }

    protected queryOrderBy(qb: SelectQueryBuilder<ReportEntity>, orderBy?: ReportOrderType) {
        switch (orderBy) {
            case ReportOrderType.CREATED:
                return qb.orderBy('report.createdAt', 'DESC');
            case ReportOrderType.UPDATED:
                return qb.orderBy('report.updatedAt', 'DESC');
            case ReportOrderType.CUSTOM:
                return qb.orderBy('customOrder', 'DESC');
            default:
                return qb
                    .orderBy('report.createdAt', 'DESC')
                    .addOrderBy('report.updatedAt', 'DESC')
                    .addOrderBy('report.publishedAt', 'DESC')
                    .addOrderBy('commentCount', 'DESC');
        }
    }

    protected async queryByArea(id: string, qb: SelectQueryBuilder<ReportEntity>) {
        return qb.where('area.id = :id', { id }).getMany();
    }

    protected async queryByCompany(id: string, qb: SelectQueryBuilder<ReportEntity>) {
        return qb.where('company.id = :id', { id }).getMany();
    }

    protected async queryByVineyard(id: string, qb: SelectQueryBuilder<ReportEntity>) {
        return qb.where('vineyard.id = :id', { id }).getMany();
    }

    async list(options: QueryReportDto, callback?: QueryHook<ReportEntity>) {
        const qb = this.repository.buildBaseQB();
        if (options.vineyard) {
            qb.andWhere('vineyard.id = :vineyard', { vineyard: options.vineyard }); // Chain the 'andWhere' method for additional conditions
        }
        await this.buildListQuery(qb, options, callback);
        return paginate(qb, options);
    }

    /**
     * 查询单篇文章
     * @param id
     * @param callback 添加额外的查询
     */
    async detail(id: string, callback?: QueryHook<ReportEntity>) {
        let qb = this.repository.buildBaseQB();
        qb.where(`report.id = :id`, { id });
        // if there is a callback and callback is a function, use callaback(qb).
        qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb;
        const item = await qb.getOne();
        if (!item) throw new EntityNotFoundError(ReportEntity, `The report ${id} not exists!`);
        return item;
    }

    /**
     * 创建文章
     * @param data
     */
    async create(id: string, data: CreateReportDto) {
        const createReportDto = {
            ...data,
            vineyard: await this.getVineyard(data.vineyard),
            area: await this.getArea(data.area),
            company: await this.getCompany(id),
        };
        const item = await this.repository.save(createReportDto);
        return this.detail(item.id);
    }

    protected async getCompany(id: string) {
        return !isNil(id) ? this.companyRepository.findOneOrFail({ where: { id } }) : id;
    }

    protected async getArea(id: string) {
        return !isNil(id) ? this.areaRepository.findOneOrFail({ where: { id } }) : id;
    }

    protected async getVineyard(id: string) {
        return !isNil(id) ? this.vineyardRepository.findOneOrFail({ where: { id } }) : id;
    }

    /**
     * 更新文章
     * @param data
     */
    async update(data: UpdateReportDto) {
        await this.repository.update(data.id, omit(data, ['id', 'company', 'area', 'vineyard']));
        return this.detail(data.id);
    }

    /**
     * 删除文章
     * @param ids
     * @param trash
     */
    async delete(ids: string[]) {
        const items = await this.repository.find({
            where: { id: In(ids) } as any,
            withDeleted: true,
        });
        return this.repository.remove(items);
    }

    async deleteByID(id: string) {
        const item = await this.repository.find({
            where: { id } as any,
            withDeleted: true,
        });
        return this.repository.remove(item);
    }
}
