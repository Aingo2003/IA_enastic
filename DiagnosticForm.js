function DiagnosticForm({ user, onNavigate }) {
  try {
    const [symptomes, setSymptomes] = React.useState([]);
    const [nouveauSymptome, setNouveauSymptome] = React.useState('');
    const [lieu, setLieu] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [resultat, setResultat] = React.useState(null);
    const [error, setError] = React.useState('');

    const symptomesCommuns = [
      'Fièvre', 'Maux de tête', 'Fatigue', 'Nausées', 'Vomissements',
      'Diarrhée', 'Douleurs abdominales', 'Frissons', 'Douleurs musculaires',
      'Éruption cutanée', 'Toux', 'Difficultés respiratoires'
    ];

    const ajouterSymptome = (symptome) => {
      if (symptome && !symptomes.includes(symptome)) {
        setSymptomes([...symptomes, symptome]);
        setNouveauSymptome('');
      }
    };

    const retirerSymptome = (symptome) => {
      setSymptomes(symptomes.filter(s => s !== symptome));
    };

    const handleDiagnostic = async () => {
      if (symptomes.length === 0) {
        setError('Veuillez sélectionner au moins un symptôme');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const prediction = await DiagnosticService.predictDisease(symptomes);
        setResultat(prediction);
        
        await DiagnosticService.saveDiagnostic(
          user.objectId,
          symptomes,
          prediction,
          lieu
        );
      } catch (err) {
        setError('Erreur lors du diagnostic: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto" data-name="diagnostic-form" data-file="components/DiagnosticForm.js">
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="icon-stethoscope text-3xl text-blue-600 mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">Diagnostic IA</h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sélectionnez vos symptômes</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Symptômes communs
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {symptomesCommuns.map(symptome => (
                    <button
                      key={symptome}
                      onClick={() => ajouterSymptome(symptome)}
                      className={`text-left p-2 rounded border ${
                        symptomes.includes(symptome)
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {symptome}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Ajouter un autre symptôme
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={nouveauSymptome}
                    onChange={(e) => setNouveauSymptome(e.target.value)}
                    className="input-field flex-1 mr-2"
                    placeholder="Autre symptôme..."
                  />
                  <button
                    type="button"
                    onClick={() => ajouterSymptome(nouveauSymptome)}
                    className="btn-secondary"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Lieu du diagnostic
                </label>
                <input
                  type="text"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  className="input-field"
                  placeholder="Ville, région..."
                />
              </div>

              <button
                onClick={handleDiagnostic}
                disabled={isLoading || symptomes.length === 0}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="icon-loader-2 text-xl animate-spin mr-2"></div>
                    Analyse en cours...
                  </div>
                ) : (
                  'Lancer le diagnostic IA'
                )}
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Symptômes sélectionnés</h3>
              <div className="space-y-2 mb-6">
                {symptomes.map(symptome => (
                  <div key={symptome} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span>{symptome}</span>
                    <button
                      onClick={() => retirerSymptome(symptome)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <div className="icon-x text-sm"></div>
                    </button>
                  </div>
                ))}
              </div>

              {resultat && (
                <div className="card bg-green-50 border-green-200">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Résultat du diagnostic</h4>
                  <div className="space-y-2">
                    <p><strong>Maladie détectée:</strong> {resultat.maladie}</p>
                    <p><strong>Probabilité:</strong> {resultat.probabilite.toFixed(1)}%</p>
                    <p><strong>Description:</strong> {resultat.description}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => onNavigate('rendez-vous')}
                      className="btn-primary"
                    >
                      Prendre rendez-vous
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DiagnosticForm component error:', error);
    return null;
  }
}
