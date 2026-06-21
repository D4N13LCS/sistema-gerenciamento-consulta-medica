import { useEffect, useState, useCallback } from 'react';
import { doctorService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const emptyForm = { nome: '', especialidade: '', crm: '', telefone: '' };

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
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

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const openCreate = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      nome: doctor.nome,
      especialidade: doctor.especialidade,
      crm: doctor.crm,
      telefone: doctor.telefone,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleDelete = async (doctor) => {
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
    { key: 'especialidade', label: 'Especialidade' },
    { key: 'crm', label: 'CRM' },
    { key: 'telefone', label: 'Telefone' },
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
          <Input label="Especialidade" name="especialidade" value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} required />
          <Input label="CRM" name="crm" value={form.crm} onChange={(e) => setForm({ ...form, crm: e.target.value })} required />
          <Input label="Telefone" name="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingDoctor ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorsPage;
