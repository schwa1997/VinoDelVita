import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { VineyardEntity } from '.';

@Exclude()
@Entity({ schema: 'public', name: 'interventions' })
export class InterventionEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: 'intervention type', type: 'text' })
    type: string;

    @Expose()
    @Column({ comment: 'intervention description.', type: 'text' })
    description: string;

    @ManyToMany(() => VineyardEntity, (vineyard) => vineyard.interventions, {
        nullable: true,
    })
    vineyards: VineyardEntity[];
}
