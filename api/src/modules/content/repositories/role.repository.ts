import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { RoleEntity } from '../entities';

@CustomRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('role')
            .leftJoinAndSelect('role.companies', 'company')
            .getMany();
    }
}
