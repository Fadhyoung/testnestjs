import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../../users/user.entity';

@Entity()
export class StaffEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Event, event => event.staffEvents)
  event!: Event;

  @Column()
  eventId!: number;

  @ManyToOne(() => User, user => user.staffEvents)
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  assignedBy!: User;

  @Column()
  assignedById!: number;

  @CreateDateColumn()
  assignedAt!: Date;
}
