import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { CompanyEntity } from '../entities';

// @CustomRepository(CompanyEntity)
// export class CompanyRepository extends Repository<CompanyEntity> {
//     buildBaseQB() {
//         return this.createQueryBuilder('company');
//     }
// }

@CustomRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('company')
            .leftJoinAndSelect('company.reports', 'reports')
            .leftJoinAndSelect('company.areas', 'areas')
            .leftJoinAndSelect('company.role', 'roles')
            .leftJoinAndSelect('company.vineyards', 'vineyards')
            .orderBy('company.createdAt', 'DESC');
    }
}
