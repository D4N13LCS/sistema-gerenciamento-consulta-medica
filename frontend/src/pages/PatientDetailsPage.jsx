import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService, appointmentService, getErrorMessage } from '../services';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import PatientTimeline from '../components/PatientTimeline';

const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientRes, appointmentsRes] = await Promise.all([
          patientService.getById(id),
          appointmentService.getAll()
        ]);
        setPatient(patientRes.data.data);
        setAppointments(appointmentsRes.data.data.filter(apt => apt.paciente && apt.paciente._id.toString() === id));
      } catch (err) {
        showError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showError]);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!patient) {
    return <div className="p-6">Paciente não encontrado</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <PageHeader
        title={patient.nome}
        description="Detalhes do paciente"
        actionLabel="Voltar"
        onAction={() => navigate('/patients')}
      />

      <div className="space-y-4 sm:space-y-6">
        {/* Timeline */}
        <Card title="Timeline do Paciente">
          <PatientTimeline patient={patient} appointments={appointments} />
        </Card>

        {/* Dados Pessoais */}
        <Card title="Dados Pessoais">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <p className="mt-1 text-sm text-gray-900">{patient.nome}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(patient.dataNascimento)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <p className="mt-1 text-sm text-gray-900">{patient.cpf}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <p className="mt-1 text-sm text-gray-900">{patient.telefone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{patient.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <p className="mt-1 text-sm text-gray-900">{patient.endereco || '-'}</p>
            </div>
          </div>
        </Card>

        {/* Histórico Médico */}
        {patient.historicoMedico && (
          <Card title="Histórico Médico">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Doenças Pré-existentes</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.historicoMedico.doencasPreexistentes || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alergias</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.historicoMedico.alergias || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicamentos em Uso</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.historicoMedico.medicamentosEmUso || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cirurgias Anteriores</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.historicoMedico.cirurgiasAnteriores || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Histórico Familiar</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.historicoMedico.historicoFamiliar || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Comorbidades</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.historicoMedico.comorbidades || '-'}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Anamnese */}
        {patient.anamnese && (
          <Card title="Anamnese">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Queixa Principal</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.anamnese.queixaPrincipal || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">História da Doença Atual</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.anamnese.historiaDoencaAtual || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hábitos de Vida</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.anamnese.habitosVida || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fatores de Risco</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.anamnese.fatoresRisco || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Observações Clínicas</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.anamnese.observacoesClinicas || '-'}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Exames */}
        <Card title="Histórico de Exames">
          {patient.exames && patient.exames.length > 0 ? (
            <div className="space-y-3">
              {patient.exames.map((exam) => (
                <div key={exam._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{exam.nome}</h4>
                      <p className="text-xs text-gray-500">{formatDate(exam.data)}</p>
                    </div>
                  </div>
                  {exam.resultado && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700">Resultado</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{exam.resultado}</p>
                    </div>
                  )}
                  {exam.observacoes && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700">Observações</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{exam.observacoes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhum exame cadastrado</p>
          )}
        </Card>

        {/* Observações Gerais */}
        {patient.observacoesGerais && (
          <Card title="Observações Gerais">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{patient.observacoesGerais}</p>
          </Card>
        )}

        {/* Consultas */}
        <Card title="Consultas">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Total de consultas: {appointments.length}</p>
          </div>
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{formatDate(apt.data)} às {apt.horario}</h4>
                      <p className="text-xs text-gray-500">Status: {apt.status}</p>
                    </div>
                  </div>
                  {apt.observacoes && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700">Observações</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{apt.observacoes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma consulta cadastrada</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
