import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { AreaEntity, InterventionEntity } from '../entities';

@CustomRepository(InterventionEntity)
export class InterventionRepository extends Repository<AreaEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('intervention');
    }
}
