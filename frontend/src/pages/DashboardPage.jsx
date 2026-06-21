import { useEffect, useState } from 'react';
import { dashboardService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data.data);
      } catch (err) {
        showError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showError]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Visão geral do sistema de agendamento</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total de Consultas" value={stats?.totalConsultas} icon="📅" color="primary" />
        <StatCard title="Total de Médicos" value={stats?.totalMedicos} icon="👨‍⚕️" color="green" />
        <StatCard title="Especialidades" value={stats?.totalEspecialidades} icon="🏥" color="purple" />
        <StatCard title="Usuários" value={stats?.totalUsuarios} icon="👥" color="orange" />
      </div>
    </div>
  );
};

export default DashboardPage;
