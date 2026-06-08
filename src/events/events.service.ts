import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Registration, RegistrationStatus } from './entities/registration.entity';
import { StaffEvent } from './entities/staff-event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Role } from '../users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
    @InjectRepository(StaffEvent)
    private readonly staffEventRepository: Repository<StaffEvent>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: number) {
    const event = this.eventRepository.create({
      ...createEventDto,
      createdById: userId,
    });
    return this.eventRepository.save(event);
  }

  async findAll() {
    return this.eventRepository.find({
      withDeleted: false,
      relations: { createdBy: true },
    });
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { createdBy: true },
    });
    if (!event) throw new NotFoundException(`Event #${id} not found`);
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto, currentUser: { id: number; role: Role }) {
    const event = await this.findOne(id);
    this.validateOwnershipOrAdmin(event, currentUser);
    Object.assign(event, updateEventDto, { updatedById: currentUser.id });
    return this.eventRepository.save(event);
  }

  async remove(id: number, currentUser: { id: number; role: Role }) {
    const event = await this.findOne(id);
    this.validateOwnershipOrAdmin(event, currentUser);
    return this.eventRepository.softRemove(event);
  }

  async register(eventId: number, userId: number) {
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) throw new NotFoundException(`Event #${eventId} not found`);

    const existing = await this.registrationRepository.findOne({
      where: { eventId, userId },
    });
    if (existing) throw new BadRequestException('Already registered for this event');

    const registration = this.registrationRepository.create({ eventId, userId });
    return this.registrationRepository.save(registration);
  }

  async checkIn(eventId: number, targetUserId: number, currentUser: { id: number; role: Role }) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: { createdBy: true },
    });
    if (!event) throw new NotFoundException(`Event #${eventId} not found`);

    if (currentUser.role === Role.EVENT_ORGANIZER && event.createdById !== currentUser.id) {
      throw new ForbiddenException('You can only check in participants for your own events');
    }

    if (currentUser.role === Role.STAFF_CHECKIN) {
      const assigned = await this.staffEventRepository.findOne({
        where: { eventId, userId: currentUser.id },
      });
      if (!assigned) throw new ForbiddenException('You are not assigned to this event');
    }

    const registration = await this.registrationRepository.findOne({
      where: { eventId, userId: targetUserId },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    registration.status = RegistrationStatus.CHECKED_IN;
    registration.checkInTime = new Date();
    registration.checkedInById = currentUser.id;
    return this.registrationRepository.save(registration);
  }

  async getParticipants(eventId: number, currentUser: { id: number; role: Role }) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: { createdBy: true },
    });
    if (!event) throw new NotFoundException(`Event #${eventId} not found`);

    if (currentUser.role === Role.EVENT_ORGANIZER && event.createdById !== currentUser.id) {
      throw new ForbiddenException('You can only view participants for your own events');
    }

    if (currentUser.role === Role.STAFF_CHECKIN) {
      const assigned = await this.staffEventRepository.findOne({
        where: { eventId, userId: currentUser.id },
      });
      if (!assigned) throw new ForbiddenException('You are not assigned to this event');
    }

    return this.registrationRepository.find({
      where: { eventId },
      relations: { user: true },
    });
  }

  private validateOwnershipOrAdmin(event: Event, currentUser: { id: number; role: Role }) {
    if (currentUser.role === Role.ADMIN) return;
    if (event.createdById !== currentUser.id) {
      throw new ForbiddenException('You do not own this event');
    }
  }
}
