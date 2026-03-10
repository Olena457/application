import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsIn, IsDateString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Meetup 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'A gathering for tech enthusiasts' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-04-15T18:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Kyiv, Ukraine' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({ enum: ['Public', 'Private'], default: 'Public' })
  @IsIn(['Public', 'Private'])
  @IsOptional()
  visibility?: 'Public' | 'Private';
}
