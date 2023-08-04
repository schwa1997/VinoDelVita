import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'permissons' })
@Exclude()
export class PermissionEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '权限名称' })
    name!: string;

    @Expose()
    @Column({
        comment: '权限描述',
        type: 'text',
        nullable: true,
    })
    description?: string;

    // @Expose({ groups: ['permission-list', 'permission-detail'] })
    // @ManyToMany((type) => RoleEntity, (role) => role.permissions)
    // @JoinTable()
    // roles!: RoleEntity[];
}
