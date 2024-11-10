export interface Request {
  request_id: number;
  student_id: number;
  current_elective_id: number;
  requested_elective_id: number;
  status: "Pending" | "Approved" | "Rejected";
  request_date: Date;
  response_date?: Date;
}

export interface AdminSetting {
  setting_id: number;
  name: string;
  value: boolean;
}
