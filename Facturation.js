function Facturation({ user }) {
  try {
    const [factures, setFactures] = React.useState([]);
    const [selectedFacture, setSelectedFacture] = React.useState(null);
    const [patients, setPatients] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      loadFactures();
    }, []);

    const loadFactures = async () => {
      try {
        const [facturesData, patientsData] = await Promise.all([
          user.objectData.type_utilisateur === 'medecin' 
            ? FacturationService.getFacturesByMedecin(user.objectId)
            : FacturationService.getFacturesByPatient(user.objectId),
          trickleListObjects('user', 100, true)
        ]);
        
        setFactures(facturesData);
        setPatients(patientsData.items.filter(u => u.objectData.type_utilisateur === 'patient'));
      } catch (error) {
        console.error('Erreur chargement factures:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const downloadPDF = (facture) => {
      const patient = patients.find(p => p.objectId === facture.objectData.patient_id);
      const pdfContent = FacturationService.generatePDF(facture, patient, user);
      
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${facture.objectData.numero_facture}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="icon-loader-2 text-2xl text-blue-600 animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto" data-name="facturation" data-file="components/Facturation.js">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Facturation</h1>
          <p className="text-gray-600">Gestion des factures médicales</p>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3">N° Facture</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Patient</th>
                  <th className="text-left py-3">Montant TTC</th>
                  <th className="text-left py-3">Statut</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {factures.map(facture => {
                  const patient = patients.find(p => p.objectId === facture.objectData.patient_id);
                  return (
                    <tr key={facture.objectId} className="border-b border-gray-100">
                      <td className="py-3">{facture.objectData.numero_facture}</td>
                      <td className="py-3">{new Date(facture.objectData.date_facture).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3">
                        {patient ? `${patient.objectData.prenom} ${patient.objectData.nom}` : 'Patient'}
                      </td>
                      <td className="py-3">{facture.objectData.montant_ttc} FCFA</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          facture.objectData.statut_paiement === 'paye' ? 'bg-green-100 text-green-800' :
                          facture.objectData.statut_paiement === 'annule' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {facture.objectData.statut_paiement}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedFacture(facture)}
                            className="btn-secondary text-sm"
                          >
                            Détails
                          </button>
                          <button
                            onClick={() => downloadPDF(facture)}
                            className="btn-primary text-sm"
                          >
                            <div className="icon-download text-sm mr-1"></div>
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedFacture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Détails de la facture</h3>
              <div className="space-y-2">
                <p><strong>Numéro:</strong> {selectedFacture.objectData.numero_facture}</p>
                <p><strong>Date:</strong> {new Date(selectedFacture.objectData.date_facture).toLocaleDateString('fr-FR')}</p>
                <p><strong>Montant HT:</strong> {selectedFacture.objectData.montant_ht} FCFA</p>
                <p><strong>TVA:</strong> {selectedFacture.objectData.tva} FCFA</p>
                <p><strong>Montant TTC:</strong> {selectedFacture.objectData.montant_ttc} FCFA</p>
                <p><strong>Statut:</strong> {selectedFacture.objectData.statut_paiement}</p>
              </div>
              <button
                onClick={() => setSelectedFacture(null)}
                className="mt-4 btn-primary w-full"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Facturation component error:', error);
    return null;
  }
}