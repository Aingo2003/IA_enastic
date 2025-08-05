function MedecinDashboard({ user, onNavigate }) {
  try {
    const [consultations, setConsultations] = React.useState([]);
    const [statistics, setStatistics] = React.useState(null);
    const [patients, setPatients] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [consultationsData, statsData, patientsData] = await Promise.all([
          ConsultationService.getConsultationsByMedecin(user.objectId),
          ConsultationService.getMedicalStatistics(user.objectId),
          trickleListObjects('user', 100, true)
        ]);
        
        setConsultations(consultationsData.slice(0, 5));
        setStatistics(statsData);
        setPatients(patientsData.items.filter(u => u.objectData.type_utilisateur === 'patient'));
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="icon-loader-2 text-2xl text-blue-600 animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto" data-name="medecin-dashboard" data-file="components/MedecinDashboard.js">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord - Dr. {user.objectData.prenom} {user.objectData.nom}
          </h1>
          <p className="text-gray-600">Vue d'ensemble de votre pratique médicale</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center">
              <div className="icon-users text-2xl text-blue-600 mr-3"></div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900">{statistics?.totalConsultations || 0}</h3>
                <p className="text-sm text-blue-600">Consultations totales</p>
              </div>
            </div>
          </div>

          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center">
              <div className="icon-check-circle text-2xl text-green-600 mr-3"></div>
              <div>
                <h3 className="text-2xl font-bold text-green-900">{statistics?.consultationsTerminees || 0}</h3>
                <p className="text-sm text-green-600">Consultations terminées</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border-purple-200">
            <div className="flex items-center">
              <div className="icon-video text-2xl text-purple-600 mr-3"></div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900">{statistics?.consultationsParType?.video || 0}</h3>
                <p className="text-sm text-purple-600">Téléconsultations</p>
              </div>
            </div>
          </div>

          <div className="card bg-orange-50 border-orange-200">
            <div className="flex items-center">
              <div className="icon-stethoscope text-2xl text-orange-600 mr-3"></div>
              <div>
                <h3 className="text-2xl font-bold text-orange-900">{Object.keys(statistics?.maladiesDetectees || {}).length}</h3>
                <p className="text-sm text-orange-600">Maladies diagnostiquées</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Consultations récentes</h2>
            <div className="space-y-3">
              {consultations.map(consultation => {
                const patient = patients.find(p => p.objectId === consultation.objectData.patient_id);
                return (
                  <div key={consultation.objectId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {patient ? `${patient.objectData.prenom} ${patient.objectData.nom}` : 'Patient'}
                        </h3>
                        <p className="text-sm text-gray-600">{consultation.objectData.type_consultation}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(consultation.objectData.date_consultation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        consultation.objectData.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                        consultation.objectData.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultation.objectData.statut}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => onNavigate('telemedicine')}
              className="w-full mt-4 btn-primary"
            >
              Voir toutes les consultations
            </button>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques des maladies</h2>
            <div className="space-y-3">
              {Object.entries(statistics?.maladiesDetectees || {}).map(([maladie, count]) => (
                <div key={maladie} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{maladie}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MedecinDashboard component error:', error);
    return null;
  }
}