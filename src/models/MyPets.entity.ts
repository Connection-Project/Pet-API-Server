import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity({ name: 'MyPets' })
export class MyPet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    represent: boolean;

    @Column()
    name: string;

    @Column()
    breed: string;

    @Column()
    gender: string;

    @Column()
    birthDay: Date;

    @Column()
    togetherDay: Date;

    @Column({ nullable: true })
    imageKey: string;

    @Column({ nullable: true })
    imagePath: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.pet, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn()
    user: User;

    constructor(partial: Partial<MyPet>) {
        Object.assign(this, partial);
    }
}
