import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { AreaEntity, ReportEntity, VineyardEntity } from '../entities';

@CustomRepository(AreaEntity)
export class AreaRepository extends Repository<AreaEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('area')
            .leftJoinAndSelect('area.companies', 'companies')
            .leftJoinAndSelect('area.reports', 'reports')
            .leftJoinAndSelect('area.vineyards', 'vineyards')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(v.id)', 'count')
                    .from(VineyardEntity, 'v')
                    .where('v.area.id = area.id');
            }, 'vineyardCount')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(r.id)', 'count')
                    .from(ReportEntity, 'r')
                    .where('r.area.id = area.id');
            }, 'reportCount')
            .loadRelationCountAndMap('area.reportCount', 'area.reports')
            .loadRelationCountAndMap('area.vineyardCount', 'area.vineyards');
    }
}
