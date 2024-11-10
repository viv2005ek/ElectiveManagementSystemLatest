export interface Student {
  student_id: number;
  name: string;
  program: string;
  year: number;
  email: string;
}

export interface Professor {
  professor_id: number;
  name: string;
  department: string;
  email: string;
}

export interface Admin {
  admin_id: number;
  name: string;
  email: string;
  created_at: Date;
}
