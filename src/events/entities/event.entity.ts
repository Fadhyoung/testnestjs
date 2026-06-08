import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert } from 'typeorm';
import { User } from '../../users/user.entity';
import { Registration } from './registration.entity';
import { StaffEvent } from './staff-event.entity';

export enum EventDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXTREME = 'extreme',
}

export enum EventRouteType {
  LOOP = 'loop',
  POINT_TO_POINT = 'point_to_point',
  OUT_AND_BACK = 'out_and_back',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  shortDescription?: string;

  @Column('date')
  eventDate!: string;

  @Column('datetime', { nullable: true })
  registrationStart?: Date;

  @Column('datetime', { nullable: true })
  registrationEnd?: Date;

  @Column('time', { nullable: true })
  startTime?: string;

  @Column('time', { nullable: true })
  cutOffTime?: string;

  @Column({ nullable: true })
  location?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column('decimal', { precision: 8, scale: 2 })
  distance!: number;

  @Column('int', { nullable: true })
  elevationGain?: number;

  @Column('int', { nullable: true })
  elevationLoss?: number;

  @Column({ type: 'enum', enum: EventDifficulty, default: EventDifficulty.INTERMEDIATE })
  difficulty!: EventDifficulty;

  @Column({ type: 'enum', enum: EventRouteType, default: EventRouteType.LOOP })
  routeType!: EventRouteType;

  @Column({ nullable: true })
  terrainType?: string;

  @Column('int', { nullable: true })
  itraPoints?: number;

  @Column('int')
  maxParticipants!: number;

  @Column('int', { default: 1 })
  minParticipants!: number;

  @Column('int', { default: 17 })
  minAge!: number;

  @Column({ default: false })
  isTeamEvent!: boolean;

  @Column('int', { nullable: true })
  teamSize?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  entryFee!: number;

  @Column({ default: 'IDR' })
  currency!: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  earlyBirdFee?: number;

  @Column('datetime', { nullable: true })
  earlyBirdDeadline?: Date;

  @Column({ nullable: true })
  bannerImage?: string;

  @Column({ nullable: true })
  routeMap?: string;

  @Column({ nullable: true })
  gpxTrack?: string;

  @Column()
  organizerName!: string;

  @Column()
  contactEmail!: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  hashtag?: string;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status!: EventStatus;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column('datetime', { nullable: true })
  publishedAt?: Date;

  @Column('json', { nullable: true })
  mandatoryKit?: string[];

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => User)
  createdBy!: User;

  @Column()
  createdById!: number;

  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User;

  @Column({ nullable: true })
  updatedById?: number;

  @OneToMany(() => Registration, registration => registration.event)
  registrations!: Registration[];

  @OneToMany(() => StaffEvent, staffEvent => staffEvent.event)
  staffEvents!: StaffEvent[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now();
    }
  }
}
