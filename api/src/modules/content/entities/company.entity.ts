import { Exclude, Expose, Type } from 'class-transformer';

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AreaEntity } from './area.entity';
import { ReportEntity } from './report.entity';
import { RoleEntity } from './role.entity';
import { VineyardEntity } from './vineyard.entity';

@Exclude()
@Entity({ schema: 'public', name: 'companies' })
export class CompanyEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column({ comment: 'company Name', type: 'text' })
    companyName: string;

    @Expose()
    @Column({ comment: 'company password', type: 'text' })
    password: string;

    @Expose()
    @Column({ comment: 'company-email', type: 'text' })
    email: string;

    @Expose()
    @Column({ comment: 'company-phone', type: 'text' })
    phone: string;

    @Expose({ groups: ['company-detail'] })
    @Type(() => Date)
    @CreateDateColumn({
        comment: 'creation timestamp',
    })
    createdAt: Date;

    @Expose({ groups: ['company-detail'] })
    @Type(() => Date)
    @UpdateDateColumn({
        comment: 'update timestamp',
    })
    updatedAt: Date;

    @Expose()
    @OneToMany((type) => ReportEntity, (report) => report.company)
    @JoinTable()
    reports: ReportEntity[];

    @Expose()
    @Type(() => AreaEntity)
    @ManyToMany((type) => AreaEntity, (area) => area.companies)
    areas: AreaEntity[];

    @Expose()
    @OneToMany((type) => VineyardEntity, (vineyard) => vineyard.company)
    @JoinTable()
    vineyards: VineyardEntity[];

    @Expose()
    @ManyToOne(() => RoleEntity, (role) => role.companies)
    @JoinTable()
    role: RoleEntity;
}
