const FacturationService = {
  async createFacture(consultationId, patientId, medecinId, typeConsultation) {
    try {
      const tarifs = {
        video: 25000,
        vocal: 20000,
        presentiel: 30000,
        urgence: 40000
      };

      const montantHT = tarifs[typeConsultation] || 25000;
      const tva = montantHT * 0.18; // 18% TVA
      const montantTTC = montantHT + tva;
      const numeroFacture = 'FCT-' + Date.now();

      return await trickleCreateObject('facture', {
        consultation_id: consultationId,
        patient_id: patientId,
        medecin_id: medecinId,
        numero_facture: numeroFacture,
        montant_ht: montantHT,
        tva: tva,
        montant_ttc: montantTTC,
        statut_paiement: 'en_attente',
        date_facture: new Date().toISOString()
      });
    } catch (error) {
      throw error;
    }
  },

  async getFacturesByMedecin(medecinId) {
    try {
      const factures = await trickleListObjects('facture', 100, true);
      return factures.items.filter(f => f.objectData.medecin_id === medecinId);
    } catch (error) {
      throw error;
    }
  },

  async getFacturesByPatient(patientId) {
    try {
      const factures = await trickleListObjects('facture', 100, true);
      return factures.items.filter(f => f.objectData.patient_id === patientId);
    } catch (error) {
      throw error;
    }
  },

  generatePDF(facture, patient, medecin) {
    const pdfContent = `
FACTURE MÉDICALE

Numéro: ${facture.objectData.numero_facture}
Date: ${new Date(facture.objectData.date_facture).toLocaleDateString('fr-FR')}

MÉDECIN:
Dr. ${medecin.objectData.prenom} ${medecin.objectData.nom}
${medecin.objectData.email}

PATIENT:
${patient.objectData.prenom} ${patient.objectData.nom}
${patient.objectData.email}

DÉTAILS:
Consultation médicale
Montant HT: ${facture.objectData.montant_ht} FCFA
TVA (18%): ${facture.objectData.tva} FCFA
Montant TTC: ${facture.objectData.montant_ttc} FCFA

Statut: ${facture.objectData.statut_paiement}

Santé Connectée Tchad
    `.trim();

    return pdfContent;
  }
};