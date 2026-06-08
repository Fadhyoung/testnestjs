import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert } from 'typeorm';
import { Photo } from '../photos/photo.entity';
import { Registration } from '../events/entities/registration.entity';
import { StaffEvent } from '../events/entities/staff-event.entity';
import { Event } from '../events/entities/event.entity';
import * as bcrypt from 'bcrypt';

export enum Role {
  ADMIN = 'admin',
  EVENT_ORGANIZER = 'event_organizer',
  CUSTOMER = 'customer',
  STAFF_CHECKIN = 'staff_checkin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Photo, photo => photo.user)
  photos!: Photo[];

  @OneToMany(() => Registration, registration => registration.user)
  registrations!: Registration[];

  @OneToMany(() => StaffEvent, staffEvent => staffEvent.user)
  staffEvents!: StaffEvent[];

  @OneToMany(() => Event, event => event.createdBy)
  createdEvents!: Event[];
}
