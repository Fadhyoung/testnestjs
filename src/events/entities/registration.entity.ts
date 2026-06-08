import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../../users/user.entity';

export enum RegistrationStatus {
  REGISTERED = 'registered',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CANCELLED = 'cancelled',
}

@Entity()
export class Registration {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Event, event => event.registrations)
  event!: Event;

  @Column()
  eventId!: number;

  @ManyToOne(() => User, user => user.registrations)
  user!: User;

  @Column()
  userId!: number;

  @Column({ type: 'enum', enum: RegistrationStatus, default: RegistrationStatus.REGISTERED })
  status!: RegistrationStatus;

  @Column('datetime', { nullable: true })
  checkInTime?: Date;

  @ManyToOne(() => User, { nullable: true })
  checkedInBy?: User;

  @Column({ nullable: true })
  checkedInById?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
