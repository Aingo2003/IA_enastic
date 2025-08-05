const MessagingService = {
  async getConversations(userId) {
    try {
      const conversations = await trickleListObjects('conversation', 100, true);
      return conversations.items.filter(conv => 
        conv.objectData.participant1_id === userId || 
        conv.objectData.participant2_id === userId
      );
    } catch (error) {
      throw error;
    }
  },

  async createConversation(participant1Id, participant2Id, type = 'chat') {
    try {
      return await trickleCreateObject('conversation', {
        participant1_id: participant1Id,
        participant2_id: participant2Id,
        type_conversation: type,
        statut: 'active',
        date_creation: new Date().toISOString()
      });
    } catch (error) {
      throw error;
    }
  },

  async getMessages(conversationId) {
    try {
      const messages = await trickleListObjects('message', 100, true);
      return messages.items.filter(msg => 
        msg.objectData.conversation_id === conversationId
      );
    } catch (error) {
      throw error;
    }
  },

  async sendMessage(conversationId, senderId, contenu, type = 'texte') {
    try {
      return await trickleCreateObject('message', {
        conversation_id: conversationId,
        sender_id: senderId,
        contenu: contenu,
        type_message: type,
        date_envoi: new Date().toISOString(),
        lu: false
      });
    } catch (error) {
      throw error;
    }
  },

  async markAsRead(messageId) {
    try {
      return await trickleUpdateObject('message', messageId, {
        lu: true
      });
    } catch (error) {
      throw error;
    }
  }
};