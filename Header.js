function Header({ currentUser, onLogout, onNavigate, currentPage }) {
  try {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2"
              >
                <div className="icon-heart-pulse text-2xl text-red-500"></div>
                <span className="text-xl font-bold text-gray-900">Santé Connectée</span>
              </button>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              {currentUser && (
                <>
                  {currentUser.objectData.type_utilisateur === 'medecin' ? (
                    <>
                      <button
                        onClick={() => onNavigate('medecin-dashboard')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'medecin-dashboard' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Tableau de bord
                      </button>
                      <button
                        onClick={() => onNavigate('telemedicine')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'telemedicine' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Télémédecine
                      </button>
                      <button
                        onClick={() => onNavigate('facturation')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'facturation' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Facturation
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'dashboard' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Tableau de bord
                      </button>
                      <button
                        onClick={() => onNavigate('diagnostic')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'diagnostic' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Diagnostic
                      </button>
                      <button
                        onClick={() => onNavigate('rendez-vous')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'rendez-vous' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Rendez-vous
                      </button>
                      <button
                        onClick={() => onNavigate('consultation-history')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'consultation-history' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Historique
                      </button>
                      <button
                        onClick={() => onNavigate('medecin-map')}
                        className={`text-gray-600 hover:text-blue-600 ${currentPage === 'medecin-map' ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        Médecins
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onNavigate('chat')}
                    className={`text-gray-600 hover:text-blue-600 ${currentPage === 'chat' ? 'text-blue-600 font-semibold' : ''}`}
                  >
                    Assistant IA
                  </button>
                  <button
                    onClick={() => onNavigate('messaging')}
                    className={`text-gray-600 hover:text-blue-600 ${currentPage === 'messaging' ? 'text-blue-600 font-semibold' : ''}`}
                  >
                    Messages
                  </button>
                  <button
                    onClick={() => onNavigate('notifications')}
                    className={`text-gray-600 hover:text-blue-600 ${currentPage === 'notifications' ? 'text-blue-600 font-semibold' : ''}`}
                  >
                    <div className="icon-bell text-xl"></div>
                  </button>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={currentUser.objectData.photo_profile || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-700">
                      {currentUser.objectData.prenom} {currentUser.objectData.nom}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <div className="icon-log-out text-xl"></div>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="btn-primary"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}