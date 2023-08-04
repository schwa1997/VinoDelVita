import { Injectable } from '@nestjs/common';
import { isFunction, isNil } from 'lodash';
import { EntityNotFoundError, In } from 'typeorm';

import { QueryHook } from '@/modules/database/types';

import { CreateVineyardDto, UpdateVineyardDto } from '../dtos';
import { VineyardEntity } from '../entities';
import {
    AreaRepository,
    CompanyRepository,
    InterventionRepository,
    ReportRepository,
    VineyardRepository,
} from '../repositories';

@Injectable()
export class VineyardService {
    constructor(
        protected repository: VineyardRepository,
        protected vineyardRepository: VineyardRepository,
        protected reportRepository: ReportRepository,
        protected companyRepository: CompanyRepository,
        protected areaRepository: AreaRepository,
        protected interventionRepository: InterventionRepository,
    ) {}

    protected async getCompany(id: string) {
        return !isNil(id) ? this.companyRepository.findOneOrFail({ where: { id } }) : id;
    }

    async listAllByAdmin() {
        const qb = this.repository.buildBaseQB();
        return qb.getMany();
    }

    async listAllByUserId(id: string) {
        const qb = this.repository.buildBaseQB();
        return qb.where('company.id = :id', { id }).getMany();
    }

    async listByAreaId(id: string) {
        const qb = this.repository.buildBaseQB();
        return qb.where('area.id = :id', { id }).getMany();
    }

    async detail(id: string, callaback?: QueryHook<VineyardEntity>) {
        let qb = this.repository.buildBaseQB();
        qb.where(`vineyard.id=:id`, { id });
        qb = !isNil(callaback) && isFunction(callaback) ? await callaback(qb) : qb;
        const item = await qb.getOne();
        if (!item) throw new EntityNotFoundError(VineyardEntity, `the vineyard ${id} is not found`);
        return item;
    }

    async delete(ids: string[]) {
        const items = await this.repository.find({
            where: { id: In(ids) },
        });
        return this.repository.remove(items);
    }

    async deleteById(id: string) {
        try {
            // Check if the entity exists before attempting to delete
            const item = await this.repository.findOne({
                where: { id }, // Closing curly brace was missing here
            });

            if (!item) {
                throw new Error('Entity not found');
            }

            // Remove the entity from the database
            return await this.repository.remove(item);
        } catch (error) {
            // Handle any errors that occurred during the deletion process
            console.error('Error deleting entity:', error);
            throw error; // Re-throw the error to propagate it to the calling function or catch block.
        }
    }

    async create(id: string, data: CreateVineyardDto) {
        const createVineyardDto = {
            ...data,
            company: await this.getCompany(id),
            area: await this.getArea(data.area),
        };

        const item = await this.repository.save(createVineyardDto);
        return this.detail(item.id);
    }

    async update(data: UpdateVineyardDto) {
        const updateVineyardDto = {
            ...data,
            area: await this.getArea(data.area),
            interventions: await this.getIntervention(data.interventions),
        };

        const item = await this.repository.save(updateVineyardDto);
        return this.detail(item.id);
    }

    protected async getArea(id: string) {
        return !isNil(id) ? this.areaRepository.findOneOrFail({ where: { id } }) : id;
    }

    protected async getIntervention(ids: string[]) {
        return this.interventionRepository.find({
            where: { id: In(ids) },
        });
    }
}
