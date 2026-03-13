import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError, Schema } from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private readonly schema: Schema<unknown>) {}

  async transform(value: unknown): Promise<unknown> {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    try {
      const castedValue = this.schema.cast(value, {
        stripUnknown: true,
      }) as Record<string, unknown>;

      const validatedValue = await this.schema.validate(castedValue, {
        abortEarly: false,
        stripUnknown: true,
      });

      return validatedValue;
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: err.inner.map((e: ValidationError) => ({
            field: e.path ?? 'unknown',
            message: e.message,
          })),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
