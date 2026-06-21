import { useEffect, useState, useCallback } from 'react';
import { appointmentService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import { formatDate, STATUS_LABELS, STATUS_COLORS } from '../utils/auth';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

const emptyForm = {
  paciente: '',
  medico: '',
  especialidade: '',
  data: '',
  horario: '',
  observacoes: '',
  status: 'agendada',
};

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const openCreate = () => {
    setEditingAppointment(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (appointment) => {
    setEditingAppointment(appointment);
    setForm({
      paciente: appointment.paciente,
      medico: appointment.medico,
      especialidade: appointment.especialidade,
      data: appointment.data?.split('T')[0] || appointment.data,
      horario: appointment.horario,
      observacoes: appointment.observacoes || '',
      status: appointment.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAppointment) {
        await appointmentService.update(editingAppointment._id, form);
        showSuccess('Consulta atualizada com sucesso!');
      } else {
        await appointmentService.create(form);
        showSuccess('Consulta criada com sucesso!');
      }
      setModalOpen(false);
      fetchAppointments();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (appointment) => {
    if (!window.confirm(`Excluir consulta de "${appointment.paciente}"?`)) return;
    try {
      await appointmentService.delete(appointment._id);
      showSuccess('Consulta excluída com sucesso!');
      fetchAppointments();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const columns = [
    { key: 'paciente', label: 'Paciente' },
    { key: 'medico', label: 'Médico' },
    { key: 'especialidade', label: 'Especialidade' },
    {
      key: 'data',
      label: 'Data',
      render: (row) => formatDate(row.data),
    },
    { key: 'horario', label: 'Horário' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[row.status] || ''}`}>
          {STATUS_LABELS[row.status] || row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Consultas"
        description="Gerencie os agendamentos de consultas"
        actionLabel="+ Nova Consulta"
        onAction={openCreate}
      />

      <Table columns={columns} data={appointments} loading={loading} keyField="_id" />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAppointment ? 'Editar Consulta' : 'Nova Consulta'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Paciente" name="paciente" value={form.paciente} onChange={(e) => setForm({ ...form, paciente: e.target.value })} required />
            <Input label="Médico" name="medico" value={form.medico} onChange={(e) => setForm({ ...form, medico: e.target.value })} required />
            <Input label="Especialidade" name="especialidade" value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} required />
            <Input label="Data" type="date" name="data" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
            <Input label="Horário" type="time" name="horario" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} required />
            <Select label="Status" name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={statusOptions} />
          </div>
          <Textarea label="Observações" name="observacoes" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingAppointment ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
