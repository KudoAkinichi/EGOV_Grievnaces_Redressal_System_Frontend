export interface Department {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  departmentId: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}
