import { RolesBuilder } from 'nest-access-control';

import { Role } from './role.enum';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

// prettier-ignore
RBAC_POLICY
  .grant(Role.USER)
    .readOwn('employeeData')
  .grant(Role.ADMIN)
    .read('employeeData')
    .update('employeeData')
    .delete('employeeData')
  .deny(Role.ADMIN)
    .read('managedEmployeeData')
