import { Exclude, Expose, Type } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinTable,
    OneToMany,
    ManyToMany,
} from 'typeorm';

import { CompanyEntity } from './company.entity';
import { ReportEntity } from './report.entity';
import { VineyardEntity } from './vineyard.entity';

@Exclude()
@Entity({ schema: 'public', name: 'areas' })
export class AreaEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column({ comment: 'area Name', type: 'text' })
    name: string;

    @Expose({ groups: ['area-detail'] })
    @Type(() => Date)
    @CreateDateColumn({ comment: 'creation timestamp' })
    CreatedAt: Date;

    @Expose()
    @Column({ comment: 'area code', type: 'text', unique: true })
    code: string;

    @Expose()
    @Column('geometry', { spatialFeatureType: 'Geometry', srid: 4326 })
    geometry: string;

    @Expose()
    @ManyToMany((type) => CompanyEntity, (company) => company.areas)
    @JoinTable()
    companies: CompanyEntity[];

    @Expose()
    @OneToMany((type) => VineyardEntity, (vineyard) => vineyard.area)
    @JoinTable()
    vineyards: VineyardEntity[];

    @Expose()
    @OneToMany((type) => ReportEntity, (report) => report.area)
    @JoinTable()
    reports: ReportEntity[];
}
