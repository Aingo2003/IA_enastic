function Dashboard({ user, onNavigate }) {
  try {
    const [diagnostics, setDiagnostics] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      loadDiagnostics();
    }, []);

    const loadDiagnostics = async () => {
      try {
        const history = await DiagnosticService.getDiagnosticsHistory(user.objectId);
        setDiagnostics(history);
      } catch (error) {
        console.error('Erreur chargement diagnostics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="max-w-6xl mx-auto" data-name="dashboard" data-file="components/Dashboard.js">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user.objectData.prenom} {user.objectData.nom}
          </h1>
          <p className="text-gray-600">Votre tableau de bord médical</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('diagnostic')}>
            <div className="flex items-center">
              <div className="icon-stethoscope text-2xl text-blue-600 mr-3"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Nouveau diagnostic</h3>
                <p className="text-sm text-gray-600">Analyser vos symptômes</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('rendez-vous')}>
            <div className="flex items-center">
              <div className="icon-calendar text-2xl text-green-600 mr-3"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Rendez-vous</h3>
                <p className="text-sm text-gray-600">Consulter un médecin</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('messaging')}>
            <div className="flex items-center">
              <div className="icon-message-circle text-2xl text-purple-600 mr-3"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Chat avec médecins</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Historique des diagnostics</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="icon-loader-2 text-2xl text-blue-600 animate-spin mx-auto mb-2"></div>
              <p>Chargement...</p>
            </div>
          ) : diagnostics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="icon-file-text text-4xl mb-2"></div>
              <p>Aucun diagnostic pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {diagnostics.map(diagnostic => (
                <div key={diagnostic.objectId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{diagnostic.objectData.maladie_detectee}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      diagnostic.objectData.statut === 'valide' ? 'bg-green-100 text-green-800' :
                      diagnostic.objectData.statut === 'rejete' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {diagnostic.objectData.statut}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Probabilité: {diagnostic.objectData.probabilite}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(diagnostic.objectData.date_diagnostic).toLocaleDateString('fr-FR')} - {diagnostic.objectData.lieu}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard component error:', error);
    return null;
  }
}