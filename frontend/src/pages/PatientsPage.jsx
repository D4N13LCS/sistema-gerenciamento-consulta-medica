import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import { validateCPF, validatePhone, validateEmail, validateDateOfBirth } from '../utils/validators';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import Textarea from '../components/Textarea';

const emptyForm = { 
  nome: '', 
  dataNascimento: '', 
  cpf: '', 
  telefone: '', 
  email: '', 
  endereco: '', 
  historicoMedico: {
    doencasPreexistentes: '',
    alergias: '',
    medicamentosEmUso: '',
    cirurgiasAnteriores: '',
    historicoFamiliar: '',
    comorbidades: '',
  },
  anamnese: {
    queixaPrincipal: '',
    historiaDoencaAtual: '',
    habitosVida: '',
    fatoresRisco: '',
    observacoesClinicas: '',
  },
  observacoesGerais: ''
};

const PatientsPage = () => {
  const navigate = useNavigate();
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
      historicoMedico: patient.historicoMedico || emptyForm.historicoMedico,
      anamnese: patient.anamnese || emptyForm.anamnese,
      observacoesGerais: patient.observacoesGerais || '',
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

  const handleDelete = async (patient, e) => {
    e.stopPropagation();
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
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${row._id}`)}>Visualizar</Button>
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={(e) => handleDelete(row, e)}>Excluir</Button>
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

      <Table columns={columns} data={patients} loading={loading} keyField="_id" onRowClick={(row) => navigate(`/patients/${row._id}`)} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              <Input label="Data de Nascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} required />
              <Input label="CPF" name="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} required />
              <Input label="Telefone" name="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
              <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="Endereço" name="endereco" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
            </div>
          </div>

          {/* Histórico Médico */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Histórico Médico</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Textarea label="Doenças Pré-existentes" name="doencasPreexistentes" value={form.historicoMedico.doencasPreexistentes} onChange={(e) => setForm({ ...form, historicoMedico: { ...form.historicoMedico, doencasPreexistentes: e.target.value } })} rows={2} />
              <Textarea label="Alergias" name="alergias" value={form.historicoMedico.alergias} onChange={(e) => setForm({ ...form, historicoMedico: { ...form.historicoMedico, alergias: e.target.value } })} rows={2} />
              <Textarea label="Medicamentos em Uso" name="medicamentosEmUso" value={form.historicoMedico.medicamentosEmUso} onChange={(e) => setForm({ ...form, historicoMedico: { ...form.historicoMedico, medicamentosEmUso: e.target.value } })} rows={2} />
              <Textarea label="Cirurgias Anteriores" name="cirurgiasAnteriores" value={form.historicoMedico.cirurgiasAnteriores} onChange={(e) => setForm({ ...form, historicoMedico: { ...form.historicoMedico, cirurgiasAnteriores: e.target.value } })} rows={2} />
              <Textarea label="Histórico Familiar" name="historicoFamiliar" value={form.historicoMedico.historicoFamiliar} onChange={(e) => setForm({ ...form, historicoMedico: { ...form.historicoMedico, historicoFamiliar: e.target.value } })} rows={2} />
              <Textarea label="Comorbidades" name="comorbidades" value={form.historicoMedico.comorbidades} onChange={(e) => setForm({ ...form, historicoMedico: { ...form.historicoMedico, comorbidades: e.target.value } })} rows={2} />
            </div>
          </div>

          {/* Anamnese */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Anamnese</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Textarea label="Queixa Principal" name="queixaPrincipal" value={form.anamnese.queixaPrincipal} onChange={(e) => setForm({ ...form, anamnese: { ...form.anamnese, queixaPrincipal: e.target.value } })} rows={2} />
              <Textarea label="História da Doença Atual" name="historiaDoencaAtual" value={form.anamnese.historiaDoencaAtual} onChange={(e) => setForm({ ...form, anamnese: { ...form.anamnese, historiaDoencaAtual: e.target.value } })} rows={2} />
              <Textarea label="Hábitos de Vida" name="habitosVida" value={form.anamnese.habitosVida} onChange={(e) => setForm({ ...form, anamnese: { ...form.anamnese, habitosVida: e.target.value } })} rows={2} />
              <Textarea label="Fatores de Risco" name="fatoresRisco" value={form.anamnese.fatoresRisco} onChange={(e) => setForm({ ...form, anamnese: { ...form.anamnese, fatoresRisco: e.target.value } })} rows={2} />
              <div className="sm:col-span-2">
                <Textarea label="Observações Clínicas" name="observacoesClinicas" value={form.anamnese.observacoesClinicas} onChange={(e) => setForm({ ...form, anamnese: { ...form.anamnese, observacoesClinicas: e.target.value } })} rows={2} />
              </div>
            </div>
          </div>

          {/* Observações Gerais */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Observações Gerais</h3>
            <Textarea label="Observações" name="observacoesGerais" value={form.observacoesGerais} onChange={(e) => setForm({ ...form, observacoesGerais: e.target.value })} rows={3} />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingPatient ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsPage;
