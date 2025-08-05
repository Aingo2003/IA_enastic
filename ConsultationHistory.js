function ConsultationHistory({ user }) {
  try {
    const [consultations, setConsultations] = React.useState([]);
    const [diagnostics, setDiagnostics] = React.useState([]);
    const [medecins, setMedecins] = React.useState([]);
    const [selectedConsultation, setSelectedConsultation] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      loadHistory();
    }, []);

    const loadHistory = async () => {
      try {
        const [consultationsData, diagnosticsData, medecinsData] = await Promise.all([
          ConsultationService.getConsultationsByPatient(user.objectId),
          DiagnosticService.getDiagnosticsHistory(user.objectId),
          trickleListObjects('user', 100, true)
        ]);
        
        setConsultations(consultationsData);
        setDiagnostics(diagnosticsData);
        setMedecins(medecinsData.items.filter(u => u.objectData.type_utilisateur === 'medecin'));
      } catch (error) {
        console.error('Erreur chargement historique:', error);
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
      <div className="max-w-6xl mx-auto" data-name="consultation-history" data-file="components/ConsultationHistory.js">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique médical</h1>
          <p className="text-gray-600">Suivi de vos consultations et diagnostics</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Consultations</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {consultations.map(consultation => {
                const medecin = medecins.find(m => m.objectId === consultation.objectData.medecin_id);
                return (
                  <div key={consultation.objectId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {medecin ? `Dr. ${medecin.objectData.prenom} ${medecin.objectData.nom}` : 'Médecin'}
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
                    <button
                      onClick={() => setSelectedConsultation(consultation)}
                      className="btn-secondary text-sm"
                    >
                      Voir détails
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Diagnostics IA</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {diagnostics.map(diagnostic => (
                <div key={diagnostic.objectId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold capitalize">{diagnostic.objectData.maladie_detectee}</h3>
                      <p className="text-sm text-gray-600">Probabilité: {diagnostic.objectData.probabilite}%</p>
                      <p className="text-xs text-gray-500">
                        {new Date(diagnostic.objectData.date_diagnostic).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      diagnostic.objectData.statut === 'valide' ? 'bg-green-100 text-green-800' :
                      diagnostic.objectData.statut === 'rejete' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {diagnostic.objectData.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedConsultation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Détails de la consultation</h3>
              <div className="space-y-3">
                <p><strong>Médecin:</strong> {medecins.find(m => m.objectId === selectedConsultation.objectData.medecin_id)?.objectData.prenom} {medecins.find(m => m.objectId === selectedConsultation.objectData.medecin_id)?.objectData.nom}</p>
                <p><strong>Type:</strong> {selectedConsultation.objectData.type_consultation}</p>
                <p><strong>Date:</strong> {new Date(selectedConsultation.objectData.date_consultation).toLocaleDateString('fr-FR')}</p>
                <p><strong>Durée:</strong> {selectedConsultation.objectData.duree_minutes} minutes</p>
                {selectedConsultation.objectData.notes_medecin && (
                  <div>
                    <strong>Notes du médecin:</strong>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedConsultation.objectData.notes_medecin}</p>
                  </div>
                )}
                {selectedConsultation.objectData.prescription && (
                  <div>
                    <strong>Prescription:</strong>
                    <pre className="mt-1 p-2 bg-gray-50 rounded text-sm whitespace-pre-wrap">{selectedConsultation.objectData.prescription}</pre>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedConsultation(null)}
                className="mt-4 btn-primary"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ConsultationHistory component error:', error);
    return null;
  }
}
