import { useEffect, useState, useCallback } from 'react';
import { patientService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import { validateCPF, validatePhone, validateEmail, validateDateOfBirth } from '../utils/validators';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const emptyForm = { 
  nome: '', 
  dataNascimento: '', 
  cpf: '', 
  telefone: '', 
  email: '', 
  endereco: '', 
  historicoExames: '', 
  anamnese: '', 
  observacoesMedicas: '' 
};

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await patientService.getAll();
      setPatients(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const openCreate = () => {
    setEditingPatient(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      nome: patient.nome,
      dataNascimento: patient.dataNascimento,
      cpf: patient.cpf,
      telefone: patient.telefone,
      email: patient.email,
      endereco: patient.endereco || '',
      historicoExames: patient.historicoExames || '',
      anamnese: patient.anamnese || '',
      observacoesMedicas: patient.observacoesMedicas || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validations
    if (!form.nome || form.nome.trim() === '') {
      showError('Nome é obrigatório');
      return;
    }
    
    if (!form.dataNascimento || form.dataNascimento.trim() === '') {
      showError('Data de nascimento é obrigatória');
      return;
    }
    
    if (!validateDateOfBirth(form.dataNascimento)) {
      showError('Data de nascimento não pode ser futura');
      return;
    }
    
    if (!form.cpf || form.cpf.trim() === '') {
      showError('CPF é obrigatório');
      return;
    }
    
    if (!validateCPF(form.cpf)) {
      showError('CPF inválido');
      return;
    }
    
    if (!form.telefone || form.telefone.trim() === '') {
      showError('Telefone é obrigatório');
      return;
    }
    
    if (!validatePhone(form.telefone)) {
      showError('Telefone inválido');
      return;
    }
    
    if (!form.email || form.email.trim() === '') {
      showError('Email é obrigatório');
      return;
    }
    
    if (!validateEmail(form.email)) {
      showError('Email inválido');
      return;
    }
    
    setSaving(true);
    try {
      if (editingPatient) {
        await patientService.update(editingPatient._id, form);
        showSuccess('Paciente atualizado com sucesso!');
      } else {
        await patientService.create(form);
        showSuccess('Paciente criado com sucesso!');
      }
      setModalOpen(false);
      fetchPatients();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (patient) => {
    if (!window.confirm(`Excluir paciente "${patient.nome}"?`)) return;
    try {
      await patientService.delete(patient._id);
      showSuccess('Paciente excluído com sucesso!');
      fetchPatients();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'email', label: 'Email' },
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
        title="Pacientes"
        description="Gerencie o cadastro de pacientes"
        actionLabel="+ Novo Paciente"
        onAction={openCreate}
      />

      <Table columns={columns} data={patients} loading={loading} keyField="_id" />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <Input label="Data de Nascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} required />
          <Input label="CPF" name="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} required />
          <Input label="Telefone" name="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Endereço" name="endereco" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
          <Input label="Histórico de Exames" name="historicoExames" value={form.historicoExames} onChange={(e) => setForm({ ...form, historicoExames: e.target.value })} />
          <Input label="Anamnese" name="anamnese" value={form.anamnese} onChange={(e) => setForm({ ...form, anamnese: e.target.value })} />
          <Input label="Observações Médicas" name="observacoesMedicas" value={form.observacoesMedicas} onChange={(e) => setForm({ ...form, observacoesMedicas: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingPatient ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsPage;
