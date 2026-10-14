export interface AppUserSession {
  appUserId: string;
  provider: string;
  providerSubject: string;
  displayName: string;
  email?: string;
  role: 'owner' | 'manager' | 'editor' | 'customer';
  tenantId: string;
}

export interface AuthAdapter {
  getCurrentSession(token?: string): Promise<AppUserSession | null>;
  mapIdentityToAppUser(provider: string, providerSubject: string, metadata: { email?: string; displayName?: string }): Promise<string>;
  hasRole(requiredRoles: string[], session: AppUserSession): boolean;
}
