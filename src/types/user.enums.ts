
export enum UserRole {
  ADMIN = 'Admin',
  STUDENT = 'Student',
  MENTOR = 'Mentor'
}

export enum UserStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  PENDING = 'Pendente'
}

export enum PermissionGroup {
  GERAL = '564c55dc-0ab8-481e-a0bc-97ea7e484b88',
  ADMIN = 'admin'
}

export enum StorageDefaults {
  DEFAULT_LIMIT_MB = 100,
  UPGRADE_INCREMENT_MB = 100
}
