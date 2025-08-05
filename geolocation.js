const GeolocationService = {
  async addMedecinLocation(medecinId, latitude, longitude, adresse, ville, specialite) {
    try {
      return await trickleCreateObject('medecin_localisation', {
        medecin_id: medecinId,
        latitude: latitude,
        longitude: longitude,
        adresse: adresse,
        ville: ville,
        specialite: specialite,
        disponible: true
      });
    } catch (error) {
      throw error;
    }
  },

  async getMedecinsNearby(userLat, userLng, specialite = null, radius = 10) {
    try {
      const locations = await trickleListObjects('medecin_localisation', 100, true);
      let medecinsProches = locations.items.filter(loc => {
        const distance = this.calculateDistance(userLat, userLng, 
          loc.objectData.latitude, loc.objectData.longitude);
        return distance <= radius && loc.objectData.disponible;
      });

      if (specialite) {
        medecinsProches = medecinsProches.filter(loc => 
          loc.objectData.specialite === specialite);
      }

      return medecinsProches.sort((a, b) => {
        const distA = this.calculateDistance(userLat, userLng, 
          a.objectData.latitude, a.objectData.longitude);
        const distB = this.calculateDistance(userLat, userLng, 
          b.objectData.latitude, b.objectData.longitude);
        return distA - distB;
      });
    } catch (error) {
      throw error;
    }
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  toRad(deg) {
    return deg * (Math.PI/180);
  },

  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
      }
      
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        error => reject(error)
      );
    });
  }
};