
export const USER_CONSTANTS = {
  PERMISSION_GROUPS: {
    GERAL: '564c55dc-0ab8-481e-a0bc-97ea7e484b88',
    ADMIN: 'admin'
  },
  
  STORAGE: {
    DEFAULT_LIMIT_MB: 100,
    UPGRADE_INCREMENT_MB: 100
  },
  
  ROLES: {
    ADMIN: 'Admin',
    STUDENT: 'Student',
    MENTOR: 'Mentor'
  },
  
  STATUS: {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    PENDING: 'Pendente'
  }
} as const;
