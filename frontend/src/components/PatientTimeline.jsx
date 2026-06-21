const PatientTimeline = ({ patient, appointments }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timelineEvents = [];

  // Patient creation
  if (patient.createdAt) {
    timelineEvents.push({
      type: 'creation',
      date: patient.createdAt,
      title: 'Cadastro do paciente',
      description: `Paciente ${patient.nome} foi cadastrado no sistema`,
      icon: '👤'
    });
  }

  // Patient updates
  if (patient.updatedAt && patient.createdAt !== patient.updatedAt) {
    timelineEvents.push({
      type: 'update',
      date: patient.updatedAt,
      title: 'Atualização do prontuário',
      description: 'Informações do paciente foram atualizadas',
      icon: '📝'
    });
  }

  // Appointments
  if (appointments && appointments.length > 0) {
    appointments.forEach(apt => {
      if (apt.status === 'agendada') {
        timelineEvents.push({
          type: 'appointment_scheduled',
          date: apt.createdAt,
          title: 'Consulta agendada',
          description: `Consulta agendada para ${formatDate(apt.data)} às ${apt.horario}`,
          icon: '📅'
        });
      } else if (apt.status === 'realizada' || apt.status === 'cancelada') {
        timelineEvents.push({
          type: 'appointment_completed',
          date: apt.updatedAt || apt.createdAt,
          title: `Consulta ${apt.status === 'realizada' ? 'realizada' : 'cancelada'}`,
          description: `Consulta de ${formatDate(apt.data)} às ${apt.horario} foi ${apt.status}`,
          icon: apt.status === 'realizada' ? '✅' : '❌'
        });
      }
    });
  }

  // Exams
  if (patient.exames && patient.exames.length > 0) {
    patient.exames.forEach(exam => {
      timelineEvents.push({
        type: 'exam',
        date: exam.createdAt,
        title: 'Exame adicionado',
        description: `Exame "${exam.nome}" realizado em ${formatDate(exam.data)}`,
        icon: '🔬'
      });
    });
  }

  // Sort events by date (most recent first)
  timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getEventColor = (type) => {
    switch (type) {
      case 'creation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'update':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'appointment_scheduled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'appointment_completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'exam':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (timelineEvents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum evento registrado na timeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelineEvents.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getEventColor(event.type)} border-2`}>
              {event.icon}
            </div>
            {index < timelineEvents.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">{event.title}</span>
              <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
            </div>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientTimeline;
