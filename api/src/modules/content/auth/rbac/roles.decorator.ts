import { SetMetadata } from '@nestjs/common';

import { Role } from './role.enum';

export const ROLES_KEY = 'role';
export const UserRole = (...roles: Role[]) => SetMetadata('roles', roles);
