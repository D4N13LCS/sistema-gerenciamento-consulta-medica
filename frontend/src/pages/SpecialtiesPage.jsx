import { useEffect, useState, useCallback } from 'react';
import { specialtyService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

const emptyForm = { nome: '', descricao: '' };

const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchSpecialties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await specialtyService.getAll();
      setSpecialties(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  const openCreate = () => {
    setEditingSpecialty(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (specialty) => {
    setEditingSpecialty(specialty);
    setForm({ nome: specialty.nome, descricao: specialty.descricao || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSpecialty) {
        await specialtyService.update(editingSpecialty._id, form);
        showSuccess('Especialidade atualizada com sucesso!');
      } else {
        await specialtyService.create(form);
        showSuccess('Especialidade criada com sucesso!');
      }
      setModalOpen(false);
      fetchSpecialties();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (specialty) => {
    if (!window.confirm(`Excluir especialidade "${specialty.nome}"?`)) return;
    try {
      await specialtyService.delete(specialty._id);
      showSuccess('Especialidade excluída com sucesso!');
      fetchSpecialties();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (row) => row.descricao || '—',
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
        title="Especialidades"
        description="Gerencie as especialidades médicas"
        actionLabel="+ Nova Especialidade"
        onAction={openCreate}
      />

      <Table columns={columns} data={specialties} loading={loading} keyField="_id" />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSpecialty ? 'Editar Especialidade' : 'Nova Especialidade'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <Textarea label="Descrição" name="descricao" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingSpecialty ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SpecialtiesPage;
