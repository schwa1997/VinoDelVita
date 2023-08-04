import { Controller, Get, SerializeOptions, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/rbac/role.enum';
import { UserRole } from '../auth/rbac/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { InterventionService } from '../services';

@Controller('interventions')
export class InterventionController {
    constructor(protected service: InterventionService) {}

    // only admin can list all areas
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UserRole(Role.AGRONOMISTS, Role.ADMIN)
    @Get('/listAll')
    @SerializeOptions({ groups: ['area-list'] })
    async listByAdmin() {
        return this.service.listAll();
    }
}
