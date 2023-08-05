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
} from 'typeorm';

import { AreaEntity } from './area.entity';
import { CompanyEntity } from './company.entity';
import { InterventionEntity } from './intervention.entity';
import { ReportEntity } from './report.entity';

/**
 * VineyardEntity
 */
@Exclude()
@Entity({ schema: 'public', name: 'vineyards' })
export class VineyardEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column({ comment: 'vineyardName', type: 'text' })
    name: string;

    @Expose()
    @Column({ comment: 'vineyards typeOfWine', type: 'text' })
    winetype: string;

    @Expose()
    @Column({ comment: 'vineyards AreaOrder', type: 'integer', nullable: false })
    areanumber: number;

    @Expose()
    @Column({ comment: 'vineyards yearOfPlaning', type: 'text' })
    yearofplanning: string;

    @Expose()
    @Column('geometry', { spatialFeatureType: 'Geometry', srid: 4326 })
    geometry: string;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: 'createdAt',
    })
    createdAt: Date;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: 'executedAt',
    })
    executedAt: Date;

    @Expose()
    @Column({ comment: 'vineyards attribute performed', type: 'text', nullable: true })
    execution: string;

    @Expose()
    @OneToMany((type) => ReportEntity, (report) => report.vineyard)
    @JoinTable()
    reports: ReportEntity[];

    @Expose()
    @ManyToOne((type) => AreaEntity, (area) => area.vineyards, {
        nullable: false,
    })
    @JoinTable()
    area: AreaEntity;

    @Expose()
    @ManyToOne((type) => CompanyEntity, (company) => company.vineyards, {
        nullable: false,
    })
    @JoinTable()
    company: CompanyEntity;

    @Expose()
    @ManyToMany((type) => InterventionEntity, (intervention) => intervention.vineyards, {
        nullable: true,
    })
    @JoinTable()
    interventions: InterventionEntity[];
}
