import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/appointments', label: 'Consultas', icon: '📅' },
  { to: '/doctors', label: 'Médicos', icon: '👨‍⚕️' },
  { to: '/specialties', label: 'Especialidades', icon: '🏥' },
  { to: '/users', label: 'Usuários', icon: '👥' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">⚕️</span>
            ClínicaMed
          </h1>
          <p className="text-xs text-gray-400 mt-1">Sistema de Agendamento</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-sm text-gray-300 mb-3 truncate">
            {user?.nome || user?.email}
          </div>
          <Button variant="ghost" size="sm" className="w-full text-gray-300 hover:text-white hover:bg-sidebar-hover" onClick={logout}>
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
