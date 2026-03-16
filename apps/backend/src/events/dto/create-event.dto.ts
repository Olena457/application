import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsIn,
  IsDateString,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

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
  // New field for tags
  @ApiPropertyOptional({
    example: ['Tech', 'Networking'],
    description: 'List of tag names (max 5)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5, { message: 'You can add up to 5 tags only' })
  tags?: string[];
}
