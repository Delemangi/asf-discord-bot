import type {User} from 'discord.js';
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

export function rolesCommand (user: User): string {
  const permissions: {[index: string]: string[]} = configuration('permissions');

  if (user.id in permissions) {
    const userPermissions: string[] = permissions[user.id];

    if (userPermissions.length > 0) {
      return `<${user.tag}> ${userPermissions.join(', ')}`;
    }
  }

  return `<${user.tag}> -`;
}

export function permissionsCommand (user: User): string {
  const permissions: {[index: string]: string[]} = configuration('permissions');
  const roles: {[index: string]: string[]} = configuration('roles');
  const output: Set<string> = new Set();

  if (user.id in permissions) {
    const userRoles: string[] = permissions[user.id];

    if (userRoles.includes('All')) {
      return `<${user.tag}> All`;
    }

    for (const role of userRoles) {
      const rolePermissions: string[] = roles[role] ?? [];

      for (const permission of rolePermissions) {
        output.add(permission);
      }
    }
  }

  if (output.size > 0) {
    return `<${user.tag}> ${[...output].join(', ')}`;
  }

  return `<${user.tag}> -`;
}

function getRoles (user: string): string[] {
  return configuration('permissions')[user] ?? [];
}

function getPermissions (role: string): string[] {
  return configuration('roles')[role] ?? [];
}
