export interface User {
  id: string;
  auth0Id?: string;
  provider: 'LOCAL' | 'AUTH0';
  dni: string;
  name: string;
  givenName?: string;
  familyName?: string;
  nickname?: string;
  email: string;
  emailVerified: boolean;
  picture?: string;
  locale?: string;
  role: 'SUPERADMIN' | 'DEVELOPER' | 'ADMIN' | 'EDITOR' | 'COLLABORATOR' | 'USER';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  deletedAt?: string;
}

export interface CreateUserDto {
  auth0Id?: string;
  provider?: 'LOCAL' | 'AUTH0';
  name: string;
  givenName?: string;
  familyName?: string;
  nickname?: string;
  email: string;
  emailVerified?: boolean;
  picture?: string;
  locale?: string;
  password: string;
  role: 'SUPERADMIN' | 'DEVELOPER' | 'ADMIN' | 'EDITOR' | 'COLLABORATOR' | 'USER';
  dni: string;
}

export interface UpdateUserDto {
  auth0Id?: string;
  provider?: 'LOCAL' | 'AUTH0';
  name?: string;
  givenName?: string;
  familyName?: string;
  nickname?: string;
  email?: string;
  emailVerified?: boolean;
  picture?: string;
  locale?: string;
  password?: string;
  role?: 'SUPERADMIN' | 'DEVELOPER' | 'ADMIN' | 'EDITOR' | 'COLLABORATOR' | 'USER';
  dni?: string;
}