import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Request,
    SerializeOptions,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/rbac/role.enum';
import { UserRole } from '../auth/rbac/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
    CreateReportDto,
    DeleteReportDto,
    QueryReportDto,
    UpdateReportDto,
} from '../dtos/report.dto';
import { ReportService } from '../services';

@Controller('reports')
export class ReportController {
    constructor(protected service: ReportService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UserRole(Role.ADMIN) // 自定义的角色装饰器
    @Get()
    @SerializeOptions({ groups: ['report-list'] })
    async list(
        @Query()
        options: QueryReportDto,
    ) {
        return this.service.list(options);
    }

    // by the jwt
    @UseGuards(JwtAuthGuard)
    @Get('/paginate')
    @SerializeOptions({ groups: ['report-list'] })
    async paginate(
        @Query()
        options: QueryReportDto,
        @Request() request: any,
    ) {
        const { user } = request;
        return this.service.paginate(user.sub, options);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @SerializeOptions({ groups: ['report-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @SerializeOptions({ groups: ['report-detail'] })
    async store(
        @Body()
        data: CreateReportDto,
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
        data: UpdateReportDto,
    ) {
        return this.service.update(data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(
        @Body()
        data: DeleteReportDto,
    ) {
        const { ids } = data;
        return this.service.delete(ids);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteByID(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.deleteByID(id);
    }
}
