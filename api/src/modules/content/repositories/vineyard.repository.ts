import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { ReportEntity, VineyardEntity } from '../entities';

@CustomRepository(VineyardEntity)
export class VineyardRepository extends Repository<VineyardEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('vineyard')
            .leftJoinAndSelect('vineyard.area', 'area')
            .leftJoinAndSelect('vineyard.company', 'company')
            .leftJoinAndSelect('vineyard.reports', 'reports')
            .leftJoinAndSelect('vineyard.interventions', 'interventions')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(r.id)', 'count')
                    .from(ReportEntity, 'r')
                    .where('r.vineyard.id = vineyard.id');
            }, 'reportCount')
            .loadRelationCountAndMap('vineyard.reportCount', 'vineyard.reports');
    }
}
