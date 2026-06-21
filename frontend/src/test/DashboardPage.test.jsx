import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import ToastContext from '../contexts/ToastContext';

vi.mock('../services', () => ({
  dashboardService: {
    getStats: vi.fn().mockResolvedValue({
      data: {
        data: {
          totalConsultas: 10,
          totalMedicos: 5,
          totalEspecialidades: 3,
          totalUsuarios: 2,
        },
      },
    }),
  },
  getErrorMessage: vi.fn(),
}));

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <ToastContext.Provider value={{ showSuccess: vi.fn(), showError: vi.fn(), showInfo: vi.fn() }}>
        <DashboardPage />
      </ToastContext.Provider>
    </MemoryRouter>
  );

describe('DashboardPage', () => {
  it('should render dashboard stats', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Total de Consultas')).toBeInTheDocument();
    expect(screen.getByText('Total de Médicos')).toBeInTheDocument();
  });
});
