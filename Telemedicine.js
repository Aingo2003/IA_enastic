function Telemedicine({ user, onNavigate }) {
  try {
    const [consultations, setConsultations] = React.useState([]);
    const [selectedConsultation, setSelectedConsultation] = React.useState(null);
    const [showPrescription, setShowPrescription] = React.useState(false);
    const [prescriptionData, setPrescriptionData] = React.useState({
      medicaments: '',
      posologie: '',
      duree_traitement: '',
      recommandations: ''
    });
    const [patients, setPatients] = React.useState([]);

    React.useEffect(() => {
      loadConsultations();
    }, []);

    const loadConsultations = async () => {
      try {
        const [consultationsData, patientsData] = await Promise.all([
          ConsultationService.getConsultationsByMedecin(user.objectId),
          trickleListObjects('user', 100, true)
        ]);
        setConsultations(consultationsData);
        setPatients(patientsData.items.filter(u => u.objectData.type_utilisateur === 'patient'));
      } catch (error) {
        console.error('Erreur chargement consultations:', error);
      }
    };

    const startConsultation = async (consultationId) => {
      try {
        await ConsultationService.updateConsultation(consultationId, {
          statut: 'en_cours',
          date_consultation: new Date().toISOString()
        });
        loadConsultations();
      } catch (error) {
        console.error('Erreur démarrage consultation:', error);
      }
    };

    const endConsultation = async (consultationId, notes) => {
      try {
        await ConsultationService.updateConsultation(consultationId, {
          statut: 'terminee',
          notes_medecin: notes,
          duree_minutes: 30
        });
        setSelectedConsultation(null);
        loadConsultations();
      } catch (error) {
        console.error('Erreur fin consultation:', error);
      }
    };

    const savePrescription = async () => {
      if (!selectedConsultation) return;

      const prescription = `
PRESCRIPTION MÉDICALE

Médicaments: ${prescriptionData.medicaments}
Posologie: ${prescriptionData.posologie}
Durée du traitement: ${prescriptionData.duree_traitement}
Recommandations: ${prescriptionData.recommandations}

Dr. ${user.objectData.prenom} ${user.objectData.nom}
Date: ${new Date().toLocaleDateString('fr-FR')}
      `.trim();

      try {
        await ConsultationService.updateConsultation(selectedConsultation.objectId, {
          prescription: prescription
        });
        setShowPrescription(false);
        setPrescriptionData({ medicaments: '', posologie: '', duree_traitement: '', recommandations: '' });
        loadConsultations();
      } catch (error) {
        console.error('Erreur sauvegarde prescription:', error);
      }
    };

    return (
      <div className="max-w-6xl mx-auto" data-name="telemedicine" data-file="components/Telemedicine.js">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Module de Télémédecine</h1>
          <p className="text-gray-600">Gérez vos consultations et prescriptions en ligne</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Consultations programmées</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {consultations.filter(c => c.objectData.statut === 'programmee').map(consultation => {
                const patient = patients.find(p => p.objectId === consultation.objectData.patient_id);
                return (
                  <div key={consultation.objectId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {patient ? `${patient.objectData.prenom} ${patient.objectData.nom}` : 'Patient'}
                        </h3>
                        <p className="text-sm text-gray-600">{consultation.objectData.type_consultation}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Programmée
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startConsultation(consultation.objectId)}
                        className="btn-primary text-sm"
                      >
                        Démarrer
                      </button>
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="btn-secondary text-sm"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Consultations en cours</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {consultations.filter(c => c.objectData.statut === 'en_cours').map(consultation => {
                const patient = patients.find(p => p.objectId === consultation.objectData.patient_id);
                return (
                  <div key={consultation.objectId} className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {patient ? `${patient.objectData.prenom} ${patient.objectData.nom}` : 'Patient'}
                        </h3>
                        <p className="text-sm text-gray-600">{consultation.objectData.type_consultation}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        En cours
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onNavigate('video-call')}
                        className="btn-primary text-sm"
                      >
                        <div className="icon-video text-sm mr-1"></div>
                        Rejoindre
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Notes de consultation:');
                          if (notes) endConsultation(consultation.objectId, notes);
                        }}
                        className="btn-secondary text-sm"
                      >
                        Terminer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {selectedConsultation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Détails de la consultation</h3>
              <div className="space-y-3 mb-4">
                <p><strong>Patient:</strong> {patients.find(p => p.objectId === selectedConsultation.objectData.patient_id)?.objectData.prenom} {patients.find(p => p.objectId === selectedConsultation.objectData.patient_id)?.objectData.nom}</p>
                <p><strong>Type:</strong> {selectedConsultation.objectData.type_consultation}</p>
                <p><strong>Date:</strong> {new Date(selectedConsultation.objectData.date_consultation).toLocaleDateString('fr-FR')}</p>
                <p><strong>Statut:</strong> {selectedConsultation.objectData.statut}</p>
                {selectedConsultation.objectData.notes_medecin && (
                  <p><strong>Notes:</strong> {selectedConsultation.objectData.notes_medecin}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPrescription(true)}
                  className="btn-primary"
                >
                  Créer prescription
                </button>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="btn-secondary"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {showPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Prescription numérique</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Médicaments</label>
                  <textarea
                    value={prescriptionData.medicaments}
                    onChange={(e) => setPrescriptionData({...prescriptionData, medicaments: e.target.value})}
                    className="input-field h-20"
                    placeholder="Liste des médicaments..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Posologie</label>
                  <textarea
                    value={prescriptionData.posologie}
                    onChange={(e) => setPrescriptionData({...prescriptionData, posologie: e.target.value})}
                    className="input-field h-20"
                    placeholder="Instructions de prise..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Durée du traitement</label>
                  <input
                    type="text"
                    value={prescriptionData.duree_traitement}
                    onChange={(e) => setPrescriptionData({...prescriptionData, duree_traitement: e.target.value})}
                    className="input-field"
                    placeholder="Ex: 7 jours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Recommandations</label>
                  <textarea
                    value={prescriptionData.recommandations}
                    onChange={(e) => setPrescriptionData({...prescriptionData, recommandations: e.target.value})}
                    className="input-field h-20"
                    placeholder="Conseils et recommandations..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={savePrescription} className="btn-primary">
                  Sauvegarder prescription
                </button>
                <button
                  onClick={() => setShowPrescription(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Telemedicine component error:', error);
    return null;
  }
}