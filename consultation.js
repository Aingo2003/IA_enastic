const ConsultationService = {
  async createConsultation(patientId, medecinId, diagnosticId, typeConsultation) {
    try {
      return await trickleCreateObject('consultation', {
        patient_id: patientId,
        medecin_id: medecinId,
        diagnostic_id: diagnosticId,
        date_consultation: new Date().toISOString(),
        type_consultation: typeConsultation,
        statut: 'programmee',
        notes_medecin: '',
        prescription: '',
        duree_minutes: 0
      });
    } catch (error) {
      throw error;
    }
  },

  async getConsultationsByMedecin(medecinId) {
    try {
      const consultations = await trickleListObjects('consultation', 100, true);
      return consultations.items.filter(c => c.objectData.medecin_id === medecinId);
    } catch (error) {
      throw error;
    }
  },

  async getConsultationsByPatient(patientId) {
    try {
      const consultations = await trickleListObjects('consultation', 100, true);
      return consultations.items.filter(c => c.objectData.patient_id === patientId);
    } catch (error) {
      throw error;
    }
  },

  async updateConsultation(consultationId, updates) {
    try {
      return await trickleUpdateObject('consultation', consultationId, updates);
    } catch (error) {
      throw error;
    }
  },

  async getMedicalStatistics(medecinId) {
    try {
      const consultations = await this.getConsultationsByMedecin(medecinId);
      const diagnostics = await trickleListObjects('diagnostic', 100, true);
      
      const stats = {
        totalConsultations: consultations.length,
        consultationsTerminees: consultations.filter(c => c.objectData.statut === 'terminee').length,
        maladiesDetectees: {},
        consultationsParType: {}
      };

      consultations.forEach(consultation => {
        const diagnostic = diagnostics.items.find(d => d.objectId === consultation.objectData.diagnostic_id);
        if (diagnostic) {
          const maladie = diagnostic.objectData.maladie_detectee;
          stats.maladiesDetectees[maladie] = (stats.maladiesDetectees[maladie] || 0) + 1;
        }

        const type = consultation.objectData.type_consultation;
        stats.consultationsParType[type] = (stats.consultationsParType[type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw error;
    }
  }
};