import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../users/user.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.EVENT_ORGANIZER)
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: { id: number }) {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.EVENT_ORGANIZER)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: { id: number; role: Role },
  ) {
    return this.eventsService.update(+id, updateEventDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.EVENT_ORGANIZER)
  remove(@Param('id') id: string, @CurrentUser() user: { id: number; role: Role }) {
    return this.eventsService.remove(+id, user);
  }

  @Post(':id/register')
  @UseGuards(AuthGuard('jwt'))
  register(@Param('id') id: string, @CurrentUser() user: { id: number }) {
    return this.eventsService.register(+id, user.id);
  }

  @Post(':id/check-in/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.EVENT_ORGANIZER, Role.STAFF_CHECKIN)
  checkIn(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: { id: number; role: Role },
  ) {
    return this.eventsService.checkIn(+id, +userId, user);
  }

  @Get(':id/participants')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.EVENT_ORGANIZER, Role.STAFF_CHECKIN)
  getParticipants(@Param('id') id: string, @CurrentUser() user: { id: number; role: Role }) {
    return this.eventsService.getParticipants(+id, user);
  }
}
