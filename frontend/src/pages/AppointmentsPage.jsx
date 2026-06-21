import { useEffect, useState, useCallback } from 'react';
import { appointmentService, patientService, doctorService, specialtyService, getErrorMessage } from '../services';
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
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
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

  const fetchPatients = useCallback(async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  }, [showError]);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await doctorService.getAll();
      setDoctors(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  }, [showError]);

  const fetchSpecialties = useCallback(async () => {
    try {
      const response = await specialtyService.getAll();
      setSpecialties(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  }, [showError]);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
    fetchSpecialties();
  }, [fetchAppointments, fetchPatients, fetchDoctors, fetchSpecialties]);

  const openCreate = () => {
    setEditingAppointment(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (appointment) => {
    setEditingAppointment(appointment);
    setForm({
      paciente: appointment.paciente?._id || appointment.paciente,
      medico: appointment.medico?._id || appointment.medico,
      especialidade: appointment.especialidade?._id || appointment.especialidade,
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

  const handleDelete = async (appointment, e) => {
    e.stopPropagation();
    const patientName = appointment.paciente?.nome || appointment.paciente;
    if (!window.confirm(`Excluir consulta de "${patientName}"?`)) return;
    try {
      await appointmentService.delete(appointment._id);
      showSuccess('Consulta excluída com sucesso!');
      fetchAppointments();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  // Get available specialties based on selected doctor
  const getAvailableSpecialties = () => {
    if (!form.medico) return specialties;
    const selectedDoctor = doctors.find(d => d._id === form.medico);
    if (!selectedDoctor || !selectedDoctor.especialidades) return specialties;
    return specialties.filter(s => selectedDoctor.especialidades.some(es => es._id === s._id || es === s._id));
  };

  const handleMedicoChange = (value) => {
    setForm({ ...form, medico: value, especialidade: '' });
  };

  const columns = [
    {
      key: 'paciente',
      label: 'Paciente',
      render: (row) => row.paciente?.nome || row.paciente || '-',
    },
    {
      key: 'medico',
      label: 'Médico',
      render: (row) => row.medico?.nome || row.medico || '-',
    },
    {
      key: 'especialidade',
      label: 'Especialidade',
      render: (row) => row.especialidade?.nome || row.especialidade || '-',
    },
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
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={(e) => handleDelete(row, e)}>Excluir</Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Select
              label="Paciente"
              name="paciente"
              value={form.paciente}
              onChange={(e) => setForm({ ...form, paciente: e.target.value })}
              options={patients.map(p => ({ value: p._id, label: p.nome }))}
              required
            />
            <Select
              label="Médico"
              name="medico"
              value={form.medico}
              onChange={(e) => handleMedicoChange(e.target.value)}
              options={doctors.map(d => ({ value: d._id, label: d.nome }))}
              required
            />
            <Select
              label="Especialidade"
              name="especialidade"
              value={form.especialidade}
              onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
              options={getAvailableSpecialties().map(s => ({ value: s._id, label: s.nome }))}
              required
              disabled={!form.medico}
            />
            <Input label="Data" type="date" name="data" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
            <Input label="Horário" type="time" name="horario" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} required />
            <Select label="Status" name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={statusOptions} />
          </div>
          <Textarea label="Observações" name="observacoes" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingAppointment ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
