import { useEffect, useState, useCallback } from 'react';
import { userService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import { formatDateTime } from '../utils/auth';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const emptyForm = { nome: '', email: '', senha: '' };

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      setUsers(response.data.data);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ nome: user.nome, email: user.email, senha: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        const data = { nome: form.nome, email: form.email };
        if (form.senha) data.senha = form.senha;
        await userService.update(editingUser.id, data);
        showSuccess('Usuário atualizado com sucesso!');
      } else {
        await userService.create(form);
        showSuccess('Usuário criado com sucesso!');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    // Prevent deletion of admin user (id = 1)
    if (user.id === 1) {
      showError('O usuário administrador não pode ser excluído');
      return;
    }
    if (!window.confirm(`Excluir usuário "${user.nome}"?`)) return;
    try {
      await userService.delete(user.id);
      showSuccess('Usuário excluído com sucesso!');
      fetchUsers();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    {
      key: 'created_at',
      label: 'Criado em',
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row)} disabled={row.id === 1}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        actionLabel="+ Novo Usuário"
        onAction={openCreate}
      />

      <Table columns={columns} data={users} loading={loading} keyField="id" />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label={editingUser ? 'Nova Senha (opcional)' : 'Senha'}
            type="password"
            name="senha"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required={!editingUser}
            minLength={6}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {editingUser ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
