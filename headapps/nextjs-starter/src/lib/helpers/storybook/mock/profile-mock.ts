import { ProfileType } from 'lib/types';
import { stringFieldArgs } from './field-mock';

export const mockProfile = {
  fields: {
    firstName: stringFieldArgs('John'),
    lastName: stringFieldArgs('Doe'),
    role: stringFieldArgs('Developer'),
    email: stringFieldArgs('john.doe@example.com'),
  },
} as ProfileType;
