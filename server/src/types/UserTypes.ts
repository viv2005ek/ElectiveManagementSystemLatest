import {UserRole} from "@prisma/client";

export interface User {
  id: string;
  role: UserRole;
  student?: any; // Assuming you have a Student type from Prisma
  faculty?: any; // Assuming you have a Faculty type from Prisma
  admin?: any; // You can refine this if you have an Admin type
}
