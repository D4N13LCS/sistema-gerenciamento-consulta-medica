import { describe, it, expect, beforeEach } from 'vitest';
import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  clearAuth,
  STATUS_LABELS,
} from '../utils/auth';

describe('auth utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve token', () => {
    setToken('test-token');
    expect(getToken()).toBe('test-token');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('should store and retrieve user', () => {
    const user = { id: 1, nome: 'Test', email: 'test@test.com' };
    setStoredUser(user);
    expect(getStoredUser()).toEqual(user);
  });

  it('should clear auth data', () => {
    setToken('token');
    setStoredUser({ id: 1 });
    clearAuth();
    expect(getToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it('should have status labels defined', () => {
    expect(STATUS_LABELS.agendada).toBe('Agendada');
    expect(STATUS_LABELS.confirmada).toBe('Confirmada');
  });
});
