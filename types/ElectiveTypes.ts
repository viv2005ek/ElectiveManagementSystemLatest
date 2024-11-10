export interface Elective {
  elective_id: number;
  name: string;
  code: string;
  professor_id?: number;
  program: string;
  semester: number;
  capacity: number;
}

export interface Preference {
  preference_id: number;
  student_id: number;
  elective_id: number;
  preference_rank: 1 | 2 | 3;
}

export interface StudentElective {
  student_elective_id: number;
  student_id: number;
  elective_id: number;
  assigned_at: Date;
}

export interface Request {
  request_id: number;
  student_id: number;
  current_elective_id: number;
  requested_elective_id: number;
  status: "Pending" | "Approved" | "Rejected";
  request_date: Date;
  response_date?: Date;
}
