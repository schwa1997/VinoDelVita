import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Request,
    SerializeOptions,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/rbac/role.enum';
import { UserRole } from '../auth/rbac/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateVineyardDto, DeleteVineyardDto, UpdateVineyardDto } from '../dtos';
import { VineyardService } from '../services/vineyard.service';

@Controller('vineyards')
export class VineyardController {
    constructor(protected service: VineyardService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UserRole(Role.ADMIN) // 自定义的角色装饰器
    @Get('listByAdmin')
    @SerializeOptions({ groups: ['report-list'] })
    async listByAdmin() {
        return this.service.listAllByAdmin();
    }

    @UseGuards(JwtAuthGuard)
    @Get('listVineyards')
    @SerializeOptions({ groups: ['vineyard-list'] })
    async list(
        @Request()
        request: any,
    ) {
        const { user } = request;
        return this.service.listAllByUserId(user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('area/:id')
    @SerializeOptions({ groups: ['vineyard-list'] })
    async listByAreaId(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.listByAreaId(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @SerializeOptions({ groups: ['vineyard-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(
        @Body()
        data: DeleteVineyardDto,
    ) {
        const { ids } = data;
        return this.service.delete(ids);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteById(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.deleteById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('area/create')
    @SerializeOptions({ groups: ['vineyard-detail'] })
    async create(
        @Body()
        data: CreateVineyardDto,
        @Request() request: any,
    ) {
        const { user } = request;
        return this.service.create(user.sub, data);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    @SerializeOptions({ groups: ['report-detail'] })
    async update(
        @Body()
        data: UpdateVineyardDto,
    ) {
        return this.service.update(data);
    }
}
