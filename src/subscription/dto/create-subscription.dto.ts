import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsDecimal,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  price: string;

  @IsOptional()
  @IsEnum(['USD', 'EUR', 'GBP'])
  currency?: 'USD' | 'EUR' | 'GBP';

  @IsNotEmpty()
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly'])
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @IsNotEmpty()
  @IsEnum([
    'sports',
    'news',
    'entertainment',
    'lifestyle',
    'technology',
    'finance',
    'politics',
    'other',
  ])
  category:
    | 'sports'
    | 'news'
    | 'entertainment'
    | 'lifestyle'
    | 'technology'
    | 'finance'
    | 'politics'
    | 'other';

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsEnum(['active', 'cancelled', 'expired'])
  status?: 'active' | 'cancelled' | 'expired';

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  renewalDate?: string;
}
