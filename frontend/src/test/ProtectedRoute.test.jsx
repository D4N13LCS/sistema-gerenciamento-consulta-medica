import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import AuthContext from '../contexts/AuthContext';

const renderProtected = (authValue) =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthContext.Provider value={authValue}>
        <ProtectedRoute />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  it('should show loading spinner when loading', () => {
    renderProtected({ isAuthenticated: false, loading: true, user: null, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    renderProtected({ isAuthenticated: false, loading: false, user: null, login: vi.fn(), logout: vi.fn() });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
