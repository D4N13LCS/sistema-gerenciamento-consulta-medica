import { useEffect, useState, useCallback } from 'react';
import { doctorService, specialtyService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import { validateCRM, validatePhone } from '../utils/validators';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const emptyForm = { nome: '', especialidades: [], crm: '', telefone: '' };

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await doctorService.getAll();
      setDoctors(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
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
    fetchDoctors();
    fetchSpecialties();
  }, [fetchDoctors, fetchSpecialties]);

  const openCreate = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      nome: doctor.nome,
      especialidades: (doctor.especialidades || []).map(spec => spec._id || spec),
      crm: doctor.crm,
      telefone: doctor.telefone,
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
    
    if (!form.especialidades || form.especialidades.length === 0) {
      showError('Pelo menos uma especialidade é obrigatória');
      return;
    }
    
    if (!form.crm || form.crm.trim() === '') {
      showError('CRM é obrigatório');
      return;
    }
    
    if (!validateCRM(form.crm)) {
      showError('CRM inválido');
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
    
    setSaving(true);
    try {
      if (editingDoctor) {
        await doctorService.update(editingDoctor._id, form);
        showSuccess('Médico atualizado com sucesso!');
      } else {
        await doctorService.create(form);
        showSuccess('Médico criado com sucesso!');
      }
      setModalOpen(false);
      fetchDoctors();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doctor, e) => {
    e.stopPropagation();
    if (!window.confirm(`Excluir médico "${doctor.nome}"?`)) return;
    try {
      await doctorService.delete(doctor._id);
      showSuccess('Médico excluído com sucesso!');
      fetchDoctors();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    {
      key: 'especialidades',
      label: 'Especialidades',
      render: (row) => (
        <div>
          {row.especialidades && row.especialidades.length > 0
            ? row.especialidades.map((spec) => (
                <span key={spec._id || spec} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                  {spec.nome || spec}
                </span>
              ))
            : '-'}
        </div>
      ),
    },
    { key: 'crm', label: 'CRM' },
    { key: 'telefone', label: 'Telefone' },
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
        title="Médicos"
        description="Gerencie o cadastro de médicos"
        actionLabel="+ Novo Médico"
        onAction={openCreate}
      />

      <Table columns={columns} data={doctors} loading={loading} keyField="_id" />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? 'Editar Médico' : 'Novo Médico'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidades</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
              {specialties.map((specialty) => (
                <label key={specialty._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.especialidades.includes(specialty._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, especialidades: [...form.especialidades, specialty._id] });
                      } else {
                        setForm({ ...form, especialidades: form.especialidades.filter(id => id !== specialty._id) });
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{specialty.nome}</span>
                </label>
              ))}
            </div>
            {form.especialidades.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Pelo menos uma especialidade é obrigatória</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input label="CRM" name="crm" value={form.crm} onChange={(e) => setForm({ ...form, crm: e.target.value })} required />
            <Input label="Telefone" name="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving} disabled={form.especialidades.length === 0}>{editingDoctor ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorsPage;
