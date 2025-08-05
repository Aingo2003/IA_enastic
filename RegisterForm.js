function RegisterForm({ onRegister, onNavigate }) {
  try {
    const [formData, setFormData] = React.useState({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      mot_de_passe: '',
      photo_profile: '',
      type_utilisateur: 'patient'
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({
            ...formData,
            photo_profile: reader.result
          });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const user = await Auth.register(formData);
        onRegister(user);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="max-w-md mx-auto" data-name="register-form" data-file="components/RegisterForm.js">
        <div className="card">
          <div className="text-center mb-6">
            <div className="icon-user-plus text-4xl text-green-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
            <p className="text-gray-600">Créez votre compte médical</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Photo de profil
              </label>
              <input
                type="file"
                name="photo_profile"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field"
              />
              {formData.photo_profile && (
                <div className="mt-2">
                  <img 
                    src={formData.photo_profile} 
                    alt="Aperçu" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Type d'utilisateur
              </label>
              <select
                name="type_utilisateur"
                value={formData.type_utilisateur}
                onChange={handleChange}
                className="input-field"
              >
                <option value="patient">Patient</option>
                <option value="medecin">Médecin</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="icon-loader-2 text-xl animate-spin mr-2"></div>
                  Inscription...
                </div>
              ) : (
                'S\'inscrire'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:text-blue-800"
            >
              Déjà un compte ? Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RegisterForm component error:', error);
    return null;
  }
}