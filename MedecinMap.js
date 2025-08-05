function MedecinMap({ user, onNavigate }) {
  try {
    const [medecins, setMedecins] = React.useState([]);
    const [userLocation, setUserLocation] = React.useState(null);
    const [selectedSpecialite, setSelectedSpecialite] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    const specialites = [
      { value: '', label: 'Toutes spécialités' },
      { value: 'medecine_generale', label: 'Médecine générale' },
      { value: 'pediatrie', label: 'Pédiatrie' },
      { value: 'cardiologie', label: 'Cardiologie' },
      { value: 'dermatologie', label: 'Dermatologie' },
      { value: 'neurologie', label: 'Neurologie' },
      { value: 'gynecologie', label: 'Gynécologie' }
    ];

    React.useEffect(() => {
      loadUserLocation();
    }, []);

    React.useEffect(() => {
      if (userLocation) {
        searchMedecins();
      }
    }, [userLocation, selectedSpecialite]);

    const loadUserLocation = async () => {
      try {
        const location = await GeolocationService.getUserLocation();
        setUserLocation(location);
      } catch (error) {
        console.error('Erreur géolocalisation:', error);
        setUserLocation({ latitude: 12.1348, longitude: 15.0557 });
      }
    };

    const searchMedecins = async () => {
      if (!userLocation) return;
      
      try {
        setIsLoading(true);
        const medecinsProches = await GeolocationService.getMedecinsNearby(
          userLocation.latitude, 
          userLocation.longitude, 
          selectedSpecialite || null
        );
        
        const medecinsData = await trickleListObjects('user', 100, true);
        const medecinsWithLocation = medecinsProches.map(loc => {
          const medecin = medecinsData.items.find(m => m.objectId === loc.objectData.medecin_id);
          return {
            ...medecin,
            location: loc.objectData,
            distance: GeolocationService.calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              loc.objectData.latitude,
              loc.objectData.longitude
            ).toFixed(1)
          };
        });
        
        setMedecins(medecinsWithLocation);
      } catch (error) {
        console.error('Erreur recherche médecins:', error);
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
      <div className="max-w-6xl mx-auto" data-name="medecin-map" data-file="components/MedecinMap.js">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Médecins à proximité</h1>
          <p className="text-gray-600">Trouvez les médecins les plus proches selon votre spécialité</p>
        </div>

        <div className="mb-6">
          <select
            value={selectedSpecialite}
            onChange={(e) => setSelectedSpecialite(e.target.value)}
            className="input-field max-w-xs"
          >
            {specialites.map(spec => (
              <option key={spec.value} value={spec.value}>{spec.label}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medecins.map(medecin => (
            <div key={medecin.objectId} className="card">
              <div className="flex items-center mb-4">
                <img
                  src={medecin.objectData?.photo_profile || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face'}
                  alt="Photo médecin"
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-900">
                    Dr. {medecin.objectData?.prenom} {medecin.objectData?.nom}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">{medecin.location?.specialite?.replace('_', ' ')}</p>
                  <p className="text-xs text-blue-600">{medecin.distance} km</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 flex items-center mb-2">
                  <div className="icon-map-pin text-sm mr-2"></div>
                  {medecin.location?.adresse}, {medecin.location?.ville}
                </p>
                <div className={`inline-block px-2 py-1 rounded text-xs ${
                  medecin.location?.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {medecin.location?.disponible ? 'Disponible' : 'Indisponible'}
                </div>
              </div>

              <button
                onClick={() => onNavigate('rendez-vous')}
                className="w-full btn-primary"
                disabled={!medecin.location?.disponible}
              >
                Prendre rendez-vous
              </button>
            </div>
          ))}
        </div>

        {medecins.length === 0 && (
          <div className="text-center py-12">
            <div className="icon-map-pin text-4xl text-gray-400 mb-4"></div>
            <p className="text-gray-500">Aucun médecin trouvé dans votre région</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('MedecinMap component error:', error);
    return null;
  }
}
