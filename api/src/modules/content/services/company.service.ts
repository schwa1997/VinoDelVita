import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { isFunction, isNil } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { QueryHook } from '@/modules/database/types';

import { CreateCompanyDto, UpdateCompanyDto, UpdateCompanyPSWDto } from '../dtos/company.dto';
import { CompanyEntity } from '../entities';
import { CompanyRepository } from '../repositories';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class CompanyService {
    constructor(
        protected repository: CompanyRepository,
        protected roleRepository: RoleRepository,
    ) {}

    async listAll() {
        const qb = this.repository.buildBaseQB();
        return qb.getMany();
    }

    async detail(id: string, callaback?: QueryHook<CompanyEntity>) {
        let qb = this.repository.buildBaseQB();
        qb.where(`company.id=:id`, { id });
        qb = !isNil(callaback) && isFunction(callaback) ? await callaback(qb) : qb;
        const item = await qb.getOne();
        if (!item) throw new EntityNotFoundError(CompanyEntity, `the company ${id} is not found`);
        return item;
    }

    async findByName(companyName: string, callaback?: QueryHook<CompanyEntity>) {
        let qb = this.repository.buildBaseQB();
        qb.where(`company.companyName=:companyName`, { companyName });
        qb = !isNil(callaback) && isFunction(callaback) ? await callaback(qb) : qb;
        const item = await qb.getOne();
        if (!item)
            throw new EntityNotFoundError(CompanyEntity, `the company ${companyName} is not found`);
        return item;
    }

    async delete(id: string) {
        const items = await this.repository.find({
            where: { id },
        });
        return this.repository.remove(items);
    }

    async create(data: CreateCompanyDto) {
        data.password = bcrypt.hashSync(data.password, 10);
        const fullData = {
            ...data,
            role: await this.getRole(data.role),
        };
        // Save the data to the database
        const item = await this.repository.save({
            ...fullData,
        });
        return this.detail(item.id);
    }

    protected async getRole(id: string) {
        return !isNil(id) ? this.roleRepository.findOneOrFail({ where: { id } }) : id;
    }

    async update(userId: string, data: UpdateCompanyDto) {
        const qb = this.repository.buildBaseQB();
        try {
            // Check if the company exists before updating
            const company = await qb.where('company.id = :userId', { userId }).getOne();
            if (!company) {
                throw new Error('Company not found');
            }
            // Update the company data
            await this.repository.update(userId, data);

            // Merge the updated data with the existing company and return
            return { ...company, ...data };
        } catch (error) {
            // Handle any errors that occurred during the update process
            console.error('Error updating company:', error);
            throw error; // Re-throw the error to propagate it to the calling function or catch block.
        }
    }

    async confirmPSW(userId: string, data: UpdateCompanyPSWDto) {
        const qb = this.repository.buildBaseQB();
        try {
            // Check if the company exists before updating
            const company = await qb.where('company.id = :userId', { userId }).getOne();
            if (!company) {
                throw new Error('Company not found');
            }

            // Compare the plain input password with the stored hashed password
            if (!bcrypt.compareSync(data.password, company.password)) {
                throw new Error('Company password does not match');
            }

            // Return the company data
            return company;
        } catch (error) {
            // Handle any errors that occurred during the confirmation process
            console.error('Error confirming company password:', error);
            throw error; // Re-throw the error to propagate it to the calling function or catch block.
        }
    }

    async updatePSW(userId: string, data: UpdateCompanyPSWDto) {
        const qb = this.repository.buildBaseQB();
        try {
            // Check if the company exists before updating
            const company = await qb.where('company.id = :userId', { userId }).getOne();
            if (!company) {
                throw new Error('Company not found');
            }

            data.password = bcrypt.hashSync(data.password, 10);
            // Update the company data
            await this.repository.update(userId, data);

            // Merge the updated data with the existing company and return
            return { ...company, ...data };
        } catch (error) {
            // Handle any errors that occurred during the update process
            console.error('Error updating company:', error);
            throw error; // Re-throw the error to propagate it to the calling function or catch block.
        }
    }
}
