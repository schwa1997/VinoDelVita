import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { ReportEntity } from '../entities';

@CustomRepository(ReportEntity)
export class ReportRepository extends Repository<ReportEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('report')
            .leftJoinAndSelect(`report.area`, 'area')
            .leftJoinAndSelect(`report.company`, 'company')
            .leftJoinAndSelect(`report.vineyard`, 'vineyard')
            .orderBy('report.createdAt', 'DESC');
    }
}
