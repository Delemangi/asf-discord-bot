import {configuration} from './config';

export function permissionCheck (user: string, command: string): boolean {
  const roles = getRoles(user);

  if (roles.includes('All')) {
    return true;
  }

  for (const role of roles) {
    const permissions = getPermissions(role);

    if (permissions.includes(command)) {
      return true;
    }
  }

  return false;
}

function getRoles (user: string): string[] {
  return configuration('permissions')[user] ?? [];
}

function getPermissions (role: string): string[] {
  return configuration('roles')[role] ?? [];
}
