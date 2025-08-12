export interface School {
  id: string;
  name: string;
  code: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    tests: number;
  };
}

export interface CreateSchoolRequest {
  name: string;
  code: string;
  address?: string;
}