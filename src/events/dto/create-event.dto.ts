import {
  IsString, IsOptional, IsNumber, IsDateString, IsEnum,
  IsBoolean, IsArray, IsObject, Min, IsUrl,
} from 'class-validator';
import { EventDifficulty, EventRouteType, EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsDateString()
  eventDate!: string;

  @IsDateString()
  @IsOptional()
  registrationStart?: string;

  @IsDateString()
  @IsOptional()
  registrationEnd?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  cutOffTime?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsNumber()
  @Min(0.1)
  distance!: number;

  @IsNumber()
  @IsOptional()
  elevationGain?: number;

  @IsNumber()
  @IsOptional()
  elevationLoss?: number;

  @IsEnum(EventDifficulty)
  @IsOptional()
  difficulty?: EventDifficulty;

  @IsEnum(EventRouteType)
  @IsOptional()
  routeType?: EventRouteType;

  @IsString()
  @IsOptional()
  terrainType?: string;

  @IsNumber()
  @IsOptional()
  itraPoints?: number;

  @IsNumber()
  @Min(1)
  maxParticipants!: number;

  @IsNumber()
  @IsOptional()
  minParticipants?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minAge?: number;

  @IsBoolean()
  @IsOptional()
  isTeamEvent?: boolean;

  @IsNumber()
  @IsOptional()
  teamSize?: number;

  @IsNumber()
  @Min(0)
  entryFee!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  earlyBirdFee?: number;

  @IsDateString()
  @IsOptional()
  earlyBirdDeadline?: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsString()
  @IsOptional()
  routeMap?: string;

  @IsString()
  @IsOptional()
  gpxTrack?: string;

  @IsString()
  organizerName!: string;

  @IsString()
  contactEmail!: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  hashtag?: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsArray()
  @IsOptional()
  mandatoryKit?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
