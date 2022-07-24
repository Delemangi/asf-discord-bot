import {type User} from 'discord.js';
import {configuration} from './config.js';

const all = '[all]';

export function permissionCheck (user: string, command: string): boolean {
  const roles = getRoles(user);

  if (roles.includes(all)) {
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

export function rolesCommand (user: User): string {
  const permissions = configuration('permissions');

  if (user.id in permissions) {
    const userPermissions = permissions[user.id] ?? [];

    if (userPermissions.includes(all)) {
      return `<${user.tag}> Roles: All`;
    }

    if (userPermissions.length > 0) {
      return `<${user.tag}> Roles: ${userPermissions.join(', ')}`;
    }
  }

  return `<${user.tag}> Roles: -`;
}

export function permissionsCommand (user: User): string {
  const permissions = configuration('permissions');
  const roles = configuration('roles');
  const output = new Set<string>();

  if (user.id in permissions) {
    const userRoles: string[] = permissions[user.id] ?? [];

    if (userRoles.includes(all)) {
      return `<${user.tag}> Permissions: All`;
    }

    for (const role of userRoles) {
      const rolePermissions = roles[role] ?? [];

      for (const permission of rolePermissions) {
        output.add(permission);
      }
    }
  }

  if (output.size > 0) {
    return `<${user.tag}> Permissions: ${[...output].join(', ')}`;
  }

  return `<${user.tag}> Permissions: -`;
}

function getRoles (user: string): string[] {
  return configuration('permissions')[user] ?? [];
}

function getPermissions (role: string): string[] {
  return configuration('roles')[role] ?? [];
}
