const NotificationService = {
  async sendNotification(destinataireId, type, titre, message, rdvId = null) {
    try {
      return await trickleCreateObject('notification', {
        destinataire_id: destinataireId,
        type_notification: type,
        titre: titre,
        message: message,
        lu: false,
        date_envoi: new Date().toISOString(),
        rdv_id: rdvId
      });
    } catch (error) {
      throw error;
    }
  },

  async getNotifications(userId) {
    try {
      const notifications = await trickleListObjects('notification', 100, true);
      return notifications.items.filter(n => n.objectData.destinataire_id === userId);
    } catch (error) {
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      return await trickleUpdateObject('notification', notificationId, { lu: true });
    } catch (error) {
      throw error;
    }
  },

  async sendRdvReminder(rdvId, patientId, medecinId, dateRdv) {
    const message = `Rappel: Vous avez un rendez-vous médical le ${new Date(dateRdv).toLocaleDateString('fr-FR')} à ${new Date(dateRdv).toLocaleTimeString('fr-FR')}`;
    
    await Promise.all([
      this.sendNotification(patientId, 'rdv_rappel', 'Rappel de rendez-vous', message, rdvId),
      this.sendNotification(medecinId, 'rdv_rappel', 'Rappel de rendez-vous', message, rdvId)
    ]);
  },

  async sendConsultationComplete(consultationId, patientId, medecinId) {
    const messagePatient = 'Votre consultation est terminée. Vous pouvez consulter votre prescription dans votre historique.';
    const messageMedecin = 'Consultation terminée avec succès.';
    
    await Promise.all([
      this.sendNotification(patientId, 'consultation_terminee', 'Consultation terminée', messagePatient),
      this.sendNotification(medecinId, 'consultation_terminee', 'Consultation terminée', messageMedecin)
    ]);
  }
};