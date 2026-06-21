import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AuthContext from '../contexts/AuthContext';
import ToastContext from '../contexts/ToastContext';

const mockLogin = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false, loading: false, user: null, logout: vi.fn() }}>
        <ToastContext.Provider value={{ showSuccess: mockShowSuccess, showError: mockShowError, showInfo: vi.fn() }}>
          <LoginPage />
        </ToastContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('should show validation error for empty fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Preencha todos os campos');
  });

  it('should call login on valid submit', async () => {
    mockLogin.mockResolvedValue({ id: 1, email: 'admin@test.com' });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('E-mail'), 'admin@test.com');
    await user.type(screen.getByLabelText('Senha'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'admin123');
    });
  });

  it('should show error on login failure', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Credenciais inválidas' } },
    });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('E-mail'), 'wrong@test.com');
    await user.type(screen.getByLabelText('Senha'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciais inválidas');
    });
  });
});
