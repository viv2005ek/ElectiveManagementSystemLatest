export interface Admin {
  id: string;
  registrationNumber: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  credentialId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdminInput {
  registrationNumber: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  password: string;
}

export interface UpdateAdminInput {
  registrationNumber?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
} 