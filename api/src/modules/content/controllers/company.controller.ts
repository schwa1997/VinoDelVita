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

import { AuthService } from '@/modules/content/services/auth.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { Role } from '../auth/rbac/role.enum';
import { UserRole } from '../auth/rbac/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
    AuthCompanyDto,
    CreateCompanyDto,
    UpdateCompanyDto,
    UpdateCompanyPSWDto,
} from '../dtos/company.dto';
import { CompanyService } from '../services';

@Controller('companies')
export class CompanyController {
    constructor(protected service: CompanyService, protected authService: AuthService) {}

    @Get(':id')
    @SerializeOptions({ groups: ['company-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        console.log(id);
        return this.service.detail(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UserRole(Role.ADMIN)
    @UseGuards(JwtAuthGuard)
    @Get()
    @SerializeOptions({ groups: ['company-list'] })
    async list() {
        return this.service.listAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UserRole(Role.ADMIN)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.delete(id);
    }

    @Post('auth/login')
    async login(
        @Body()
        data: AuthCompanyDto,
    ) {
        return this.authService.login(data.companyName, data.password);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UserRole(Role.ADMIN)
    @Get('auth/:id')
    @SerializeOptions({ groups: ['company-detail'] })
    async authDetail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.authService.profile(id);
    }

    @Post('signup')
    @SerializeOptions({ groups: ['company-detail'] })
    async create(
        @Body()
        data: CreateCompanyDto,
    ) {
        return this.service.create(data);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update')
    @SerializeOptions({ groups: ['company-detail'] })
    async update(
        @Body()
        data: UpdateCompanyDto,
        @Request() request: any,
    ) {
        const { user } = request;
        return this.service.update(user.sub, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update/confirmpassword')
    async confirmpassword(
        @Body()
        data: UpdateCompanyPSWDto,
        @Request() request: any,
    ) {
        const { user } = request;
        return this.service.confirmPSW(user.sub, data);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/password')
    async updatePSW(
        @Body()
        data: UpdateCompanyPSWDto,
        @Request() request: any,
    ) {
        const { user } = request;
        return this.service.updatePSW(user.sub, data);
    }
}
