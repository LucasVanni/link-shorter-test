import { User } from '@prisma/client';

export interface IRegistrationStatus {
  success: boolean;
  message: string;
  data?: User;
}
