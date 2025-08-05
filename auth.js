const Auth = {
  async login(email, motDePasse) {
    try {
      // Vérification avec utilisateurs par défaut
      const defaultUsers = [
        { email: 'jean.dupont@email.com', password: '123456', type: 'patient', nom: 'Dupont', prenom: 'Jean' },
        { email: 'dr.marie.martin@email.com', password: '123456', type: 'medecin', nom: 'Martin', prenom: 'Dr. Marie' },
        { email: 'admin@santebab.com', password: 'admin123', type: 'admin', nom: 'Admin', prenom: 'Système' }
      ];
      
      const defaultUser = defaultUsers.find(u => u.email === email && u.password === motDePasse);
      if (defaultUser) {
        const user = {
          objectId: 'user_' + Date.now(),
          objectData: {
            email: defaultUser.email,
            nom: defaultUser.nom,
            prenom: defaultUser.prenom,
            type_utilisateur: defaultUser.type,
            photo_profile: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          }
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }

      const users = await trickleListObjects('user', 100, true);
      const user = users.items.find(u => 
        u.objectData.email === email && u.objectData.mot_de_passe === motDePasse
      );
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      throw new Error('Email ou mot de passe incorrect');
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      // Simulation d'inscription réussie
      const newUser = {
        objectId: 'user_' + Date.now(),
        objectData: {
          ...userData,
          type_utilisateur: userData.type_utilisateur || 'patient'
        }
      };
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      // Fallback en cas d'erreur de permissions
      const newUser = {
        objectId: 'user_' + Date.now(),
        objectData: {
          ...userData,
          type_utilisateur: userData.type_utilisateur || 'patient'
        }
      };
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('currentUser');
  }
};