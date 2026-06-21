import { describe, it, expect, vi } from 'vitest';
import { getErrorMessage } from '../services';

describe('getErrorMessage', () => {
  it('should return API error message', () => {
    const error = {
      response: { data: { message: 'Credenciais inválidas' } },
    };
    expect(getErrorMessage(error)).toBe('Credenciais inválidas');
  });

  it('should return validation errors', () => {
    const error = {
      response: {
        data: {
          errors: [{ message: 'E-mail inválido' }, { message: 'Senha obrigatória' }],
        },
      },
    };
    expect(getErrorMessage(error)).toBe('E-mail inválido, Senha obrigatória');
  });

  it('should return default message for unknown errors', () => {
    expect(getErrorMessage(new Error('network'))).toBe('Ocorreu um erro inesperado. Tente novamente.');
  });
});
