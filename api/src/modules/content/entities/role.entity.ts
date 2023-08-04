import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CompanyEntity } from '.';

@Exclude()
@Entity({ schema: 'public', name: 'roles' })
export class RoleEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: 'role Name', type: 'text' })
    name: string;

    @OneToMany(() => CompanyEntity, (company) => company.role, {
        deferrable: 'INITIALLY IMMEDIATE',
    })
    companies!: CompanyEntity[];
}
