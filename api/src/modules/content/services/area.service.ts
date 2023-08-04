import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { isFunction, isNil } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { QueryHook } from '@/modules/database/types';

import { CreateAreaDto, UpdateAreaDto } from '../dtos';
import { AreaEntity, CompanyEntity } from '../entities';
import { AreaRepository, CompanyRepository } from '../repositories';

@Injectable()
export class AreaService {
    constructor(
        protected repository: AreaRepository,
        protected companyRepository: CompanyRepository,
    ) {}

    protected async getCompany(id: string) {
        return !isNil(id) ? this.companyRepository.findOneOrFail({ where: { id } }) : id;
    }

    async listAll() {
        const qb = this.repository.buildBaseQB();
        const items = await qb.getMany();
        return items;
    }

    async list(id: string) {
        const qb = this.repository.buildBaseQB();
        return qb.where('companies.id = :id', { id }).getMany();
    }

    async detail(id: string, callaback?: QueryHook<AreaEntity>) {
        let qb = this.repository.buildBaseQB();
        qb.where(`area.id=:id`, { id });
        qb = !isNil(callaback) && isFunction(callaback) ? await callaback(qb) : qb;
        const item = await qb.getOne();
        if (!item) throw new EntityNotFoundError(AreaEntity, `the area ${id} is not found`);
        return item;
    }

    async delete(id: string) {
        const item = await this.repository.find({
            where: { id },
        });
        return this.repository.remove(item);
    }

    async create(userId: string, data: CreateAreaDto) {
        try {
            const company: CompanyEntity = await this.getCompany(userId);
            const companies: CompanyEntity[] = [company];
            const item = await this.repository.save({
                ...data,
                companies,
            });
            return await this.detail(item.id);
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error occurred during area creation:', error);

            // Customize the error response to include more information
            throw new HttpException(
                'Failed to create area. Please check the request data.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async update(data: UpdateAreaDto) {
        const item = await this.repository.save({
            ...data,
        });
        return this.detail(item.id);
    }

    async listByCompanyId() {
        return this.repository.find({
            order: {
                name: 'DESC',
                id: 'DESC',
            },
            take: 10,
        });
    }
}
