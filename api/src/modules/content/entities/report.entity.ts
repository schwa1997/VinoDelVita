import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AreaEntity } from './area.entity';
import { CompanyEntity } from './company.entity';
import { VineyardEntity } from './vineyard.entity';

/**
 * 文章模型
 */
@Exclude()
@Entity({ schema: 'public', name: 'reports' })
export class ReportEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column({ comment: 'report tiitle', type: 'text' })
    title: string;

    @Expose()
    @Column({ comment: 'report description', type: 'text' })
    description: string;

    @Expose()
    @Column({ comment: 'report diseases', type: 'text' })
    disease: string;

    @Expose()
    @Column({ comment: 'report status', type: 'integer' })
    status: number;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: 'creation timestap',
    })
    createdAt: Date;

    @Expose()
    @Type(() => Date)
    @UpdateDateColumn({
        comment: 'update timestap',
    })
    updatedAt: Date;

    @Expose()
    @Type(() => AreaEntity)
    @ManyToOne(() => AreaEntity, (area) => area.reports, {
        cascade: true,
    })
    @JoinTable()
    area: AreaEntity;

    @Expose()
    @ManyToOne((type) => CompanyEntity, (company) => company.reports, {
        cascade: true,
    })
    @JoinTable()
    company!: CompanyEntity;

    @Expose()
    @ManyToOne((type) => VineyardEntity, (vineyard) => vineyard.reports)
    @JoinTable()
    vineyard: VineyardEntity;

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: 'deletion timestamp',
    })
    deletedAt: Date;
}
