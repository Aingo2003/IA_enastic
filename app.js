class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Une erreur s'est produite</h1>
            <p className="text-gray-600 mb-4">Nous sommes désolés, quelque chose d'inattendu s'est produit.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState('home');
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      const user = Auth.getCurrentUser();
      setCurrentUser(user);
      setIsLoading(false);
    }, []);

    const handleLogin = (user) => {
      setCurrentUser(user);
      if (user.objectData.type_utilisateur === 'medecin') {
        setCurrentPage('medecin-dashboard');
      } else if (user.objectData.type_utilisateur === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    };

    const handleLogout = () => {
      Auth.logout();
      setCurrentUser(null);
      setCurrentPage('home');
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="icon-loader-2 text-4xl text-blue-600 animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        
        <main className="container mx-auto px-4 py-8">
          {currentPage === 'home' && !currentUser && (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Santé Connectée Tchad
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Diagnostic précoce des maladies tropicales par intelligence artificielle
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                <div className="card text-left">
                  <div className="icon-brain text-3xl text-blue-600 mb-3"></div>
                  <h3 className="font-bold text-lg mb-2">IA Avancée</h3>
                  <p className="text-sm text-gray-600">Modèles entraînés sur datasets Kaggle Medical et WHO avec précision >85%</p>
                </div>
                <div className="card text-left">
                  <div className="icon-microscope text-3xl text-green-600 mb-3"></div>
                  <h3 className="font-bold text-lg mb-2">Maladies Tropicales</h3>
                  <p className="text-sm text-gray-600">Diagnostic de paludisme, typhoïde, dengue, chikungunya et plus</p>
                </div>
                <div className="card text-left">
                  <div className="icon-clock text-3xl text-purple-600 mb-3"></div>
                  <h3 className="font-bold text-lg mb-2">Diagnostic Rapide</h3>
                  <p className="text-sm text-gray-600">Résultats en temps réel avec recommandations personnalisées</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="btn-primary"
                >
                  Se connecter
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="btn-secondary"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          )}

          {currentPage === 'login' && (
            <LoginForm onLogin={handleLogin} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'register' && (
            <RegisterForm onRegister={handleLogin} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'dashboard' && currentUser && (
            <Dashboard user={currentUser} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'diagnostic' && currentUser && (
            <DiagnosticForm user={currentUser} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'rendez-vous' && currentUser && (
            <RendezVous user={currentUser} />
          )}

          {currentPage === 'chat' && currentUser && (
            <Chat user={currentUser} />
          )}

          {currentPage === 'messaging' && currentUser && (
            <Messaging user={currentUser} />
          )}

          {currentPage === 'video-call' && currentUser && (
            <VideoCall user={currentUser} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'medecin-dashboard' && currentUser && (
            <MedecinDashboard user={currentUser} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'telemedicine' && currentUser && (
            <Telemedicine user={currentUser} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'consultation-history' && currentUser && (
            <ConsultationHistory user={currentUser} />
          )}

          {currentPage === 'notifications' && currentUser && (
            <Notifications user={currentUser} />
          )}

          {currentPage === 'facturation' && currentUser && (
            <Facturation user={currentUser} />
          )}

          {currentPage === 'medecin-map' && currentUser && (
            <MedecinMap user={currentUser} onNavigate={setCurrentPage} />
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);