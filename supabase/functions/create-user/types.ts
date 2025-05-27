
export interface CreateUserRequest {
  email: string;
  name: string;
  role: string;
  password: string;
  is_mentor: boolean;
}

export interface CreateUserResponse {
  success: boolean;
  existed?: boolean;
  profileCreated?: boolean;
  error?: string;
}

export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
}
