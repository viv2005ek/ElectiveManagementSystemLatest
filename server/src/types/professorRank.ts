export interface ProfessorRank {
  id: string;
  name: string;
  priority: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProfessorRankInput {
  name: string;
  priority: number;
}

export interface UpdateProfessorRankInput {
  name?: string;
  priority?: number;
}