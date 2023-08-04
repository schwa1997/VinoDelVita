import { Injectable } from '@nestjs/common';

import { InterventionRepository } from '../repositories';

@Injectable()
export class InterventionService {
    constructor(protected repository: InterventionRepository) {}

    async listAll() {
        const qb = this.repository.buildBaseQB();
        const items = await qb.getMany();
        return items;
    }
}
