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
import { CreateAreaDto, UpdateAreaDto } from '../dtos';
import { AreaService } from '../services/area.service';

@Controller('areas')
export class AreaController {
    constructor(protected service: AreaService) {}

    // only admin can list all areas
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UserRole(Role.ADMIN)
    @Get('/listAll')
    @SerializeOptions({ groups: ['area-list'] })
    async listByAdmin() {
        return this.service.listAll();
    }

    // with user jwt info, get detail of the area under this user
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @SerializeOptions({ groups: ['area-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    // with user jwt info, list areas under this user
    @UseGuards(JwtAuthGuard)
    @Get()
    @SerializeOptions({ groups: ['area-list'] })
    async list(@Request() request: any) {
        const { user } = request;
        return this.service.list(user.sub);
    }

    // with user jwt info, can delete the area with areaid
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.delete(id);
    }

    // with user jwt info, create the area
    @UseGuards(JwtAuthGuard)
    @Post('create')
    @SerializeOptions({ groups: ['area-detail'] })
    async create(
        @Body()
        data: CreateAreaDto,
        @Request() request: any,
    ) {
        const { user } = request;
        return this.service.create(user.sub, data);
    }

    // with user jwt info, update the area
    @UseGuards(JwtAuthGuard)
    @Patch('update')
    @SerializeOptions({ groups: ['area-detail'] })
    async update(
        @Body()
        data: UpdateAreaDto,
    ) {
        return this.service.update(data);
    }
}
