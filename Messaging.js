function Messaging({ user }) {
  try {
    const [conversations, setConversations] = React.useState([]);
    const [selectedConv, setSelectedConv] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [showNewConv, setShowNewConv] = React.useState(false);

    React.useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [convs, allUsers] = await Promise.all([
          MessagingService.getConversations(user.objectId),
          trickleListObjects('user', 100, true)
        ]);
        setConversations(convs);
        setUsers(allUsers.items.filter(u => u.objectId !== user.objectId));
      } catch (error) {
        console.error('Erreur chargement:', error);
      }
    };

    const selectConversation = async (conv) => {
      setSelectedConv(conv);
      try {
        const msgs = await MessagingService.getMessages(conv.objectId);
        setMessages(msgs);
      } catch (error) {
        console.error('Erreur messages:', error);
      }
    };

    const sendMessage = async () => {
      if (!newMessage.trim() || !selectedConv) return;

      try {
        await MessagingService.sendMessage(
          selectedConv.objectId,
          user.objectId,
          newMessage
        );
        setNewMessage('');
        selectConversation(selectedConv);
      } catch (error) {
        console.error('Erreur envoi:', error);
      }
    };

    const startNewConversation = async (otherUserId) => {
      try {
        const newConv = await MessagingService.createConversation(
          user.objectId,
          otherUserId
        );
        setShowNewConv(false);
        loadData();
        selectConversation(newConv);
      } catch (error) {
        console.error('Erreur nouvelle conversation:', error);
      }
    };

    return (
      <div className="max-w-6xl mx-auto" data-name="messaging" data-file="components/Messaging.js">
        <div className="flex h-96 bg-white rounded-lg shadow-md">
          <div className="w-1/3 border-r border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Messages</h2>
              <button
                onClick={() => setShowNewConv(true)}
                className="btn-primary text-sm"
              >
                <div className="icon-plus text-sm"></div>
              </button>
            </div>

            {showNewConv && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Nouveau message</h3>
                {users.map(otherUser => (
                  <button
                    key={otherUser.objectId}
                    onClick={() => startNewConversation(otherUser.objectId)}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded"
                  >
                    {otherUser.objectData.prenom} {otherUser.objectData.nom}
                    <span className="text-xs text-gray-500 block">
                      {otherUser.objectData.type_utilisateur}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setShowNewConv(false)}
                  className="btn-secondary w-full mt-2"
                >
                  Annuler
                </button>
              </div>
            )}

            <div className="space-y-2">
              {conversations.map(conv => {
                const otherUserId = conv.objectData.participant1_id === user.objectId 
                  ? conv.objectData.participant2_id 
                  : conv.objectData.participant1_id;
                const otherUser = users.find(u => u.objectId === otherUserId);
                
                return (
                  <div
                    key={conv.objectId}
                    onClick={() => selectConversation(conv)}
                    className={`p-3 rounded cursor-pointer ${
                      selectedConv?.objectId === conv.objectId 
                        ? 'bg-blue-100' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold">
                      {otherUser ? `${otherUser.objectData.prenom} ${otherUser.objectData.nom}` : 'Utilisateur'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {otherUser?.objectData.type_utilisateur}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-gray-200 flex justify-between">
                  <div>
                    <h3 className="font-semibold">Conversation</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">
                      <div className="icon-phone text-sm mr-1"></div>
                      Appel
                    </button>
                    <button className="btn-primary text-sm">
                      <div className="icon-video text-sm mr-1"></div>
                      Vidéo
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.objectId}
                      className={`flex ${
                        msg.objectData.sender_id === user.objectId 
                          ? 'justify-end' 
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.objectData.sender_id === user.objectId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.objectData.contenu}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.objectData.date_envoi).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 input-field mr-2"
                  />
                  <button
                    onClick={sendMessage}
                    className="btn-primary"
                  >
                    <div className="icon-send text-xl"></div>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Messaging component error:', error);
    return null;
  }
}