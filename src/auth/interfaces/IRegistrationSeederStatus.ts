import { User } from '@prisma/client';

export interface RegistrationSeederStatus {
  success: boolean;
  message: string;
  data?: User[];
}
