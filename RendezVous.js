function RendezVous({ user }) {
  try {
    const [rendezVous, setRendezVous] = React.useState([]);
    const [medecins, setMedecins] = React.useState([]);
    const [showNewRdv, setShowNewRdv] = React.useState(false);
    const [formData, setFormData] = React.useState({
      medecin_id: '',
      date_rdv: '',
      type_consultation: 'video',
      motif: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [rdvData, medecinData] = await Promise.all([
          trickleListObjects('rendez_vous', 100, true),
          trickleListObjects('user', 100, true)
        ]);
        
        setRendezVous(rdvData.items.filter(rdv => rdv.objectData.patient_id === user.objectId));
        setMedecins(medecinData.items.filter(u => u.objectData.type_utilisateur === 'medecin'));
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        await trickleCreateObject('rendez_vous', {
          ...formData,
          patient_id: user.objectId,
          statut: 'demande'
        });
        
        setShowNewRdv(false);
        setFormData({ medecin_id: '', date_rdv: '', type_consultation: 'video', motif: '' });
        loadData();
      } catch (error) {
        console.error('Erreur création rendez-vous:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto" data-name="rendez-vous" data-file="components/RendezVous.js">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes rendez-vous</h1>
          <button
            onClick={() => setShowNewRdv(true)}
            className="btn-primary"
          >
            <div className="icon-plus text-xl mr-2"></div>
            Nouveau rendez-vous
          </button>
        </div>

        {showNewRdv && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Nouveau rendez-vous</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Médecin</label>
                  <select
                    value={formData.medecin_id}
                    onChange={(e) => setFormData({...formData, medecin_id: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Sélectionner un médecin</option>
                    {medecins.map(medecin => (
                      <option key={medecin.objectId} value={medecin.objectId}>
                        Dr. {medecin.objectData.prenom} {medecin.objectData.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Date et heure</label>
                  <input
                    type="datetime-local"
                    value={formData.date_rdv}
                    onChange={(e) => setFormData({...formData, date_rdv: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Type de consultation</label>
                  <select
                    value={formData.type_consultation}
                    onChange={(e) => setFormData({...formData, type_consultation: e.target.value})}
                    className="input-field"
                  >
                    <option value="video">Consultation vidéo</option>
                    <option value="appel_vocal">Appel vocal</option>
                    <option value="presentiell">Consultation présentielle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Motif</label>
                  <input
                    type="text"
                    value={formData.motif}
                    onChange={(e) => setFormData({...formData, motif: e.target.value})}
                    className="input-field"
                    placeholder="Motif de la consultation"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowNewRdv(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Demande...' : 'Demander rendez-vous'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {rendezVous.map(rdv => {
            const medecin = medecins.find(m => m.objectId === rdv.objectData.medecin_id);
            return (
              <div key={rdv.objectId} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {medecin ? `Dr. ${medecin.objectData.prenom} ${medecin.objectData.nom}` : 'Médecin non trouvé'}
                    </h3>
                    <p className="text-gray-600">{rdv.objectData.motif}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(rdv.objectData.date_rdv).toLocaleDateString('fr-FR')} - {rdv.objectData.type_consultation}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${
                    rdv.objectData.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                    rdv.objectData.statut === 'annule' ? 'bg-red-100 text-red-800' :
                    rdv.objectData.statut === 'termine' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rdv.objectData.statut}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error('RendezVous component error:', error);
    return null;
  }
}