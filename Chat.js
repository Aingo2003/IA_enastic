function Chat({ user }) {
  try {
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
      // Ajouter un message de bienvenue
      setMessages([
        {
          id: 1,
          sender: 'Assistant Médical IA',
          content: 'Bonjour ! Je suis votre assistant médical virtuel. Comment puis-je vous aider aujourd\'hui ?',
          timestamp: new Date().toISOString(),
          isBot: true
        }
      ]);
    }, []);

    const sendMessage = async () => {
      if (!newMessage.trim()) return;

      const userMessage = {
        id: Date.now(),
        sender: `${user.objectData.prenom} ${user.objectData.nom}`,
        content: newMessage,
        timestamp: new Date().toISOString(),
        isBot: false
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsLoading(true);

      try {
        // Assistant médical IA avec GPT
        const systemPrompt = `Tu es un assistant médical virtuel expert spécialisé dans les maladies tropicales. 
        Contexte médical: Tu travailles pour la plateforme Santé Connectée Tchad qui utilise des modèles IA entraînés sur des datasets Kaggle Medical et WHO avec une précision >85%.
        
        Instructions:
        - Réponds aux questions médicales de manière professionnelle et bienveillante
        - Pour les symptômes, suggère toujours d'utiliser notre système de diagnostic IA
        - Recommande une consultation médicale pour un diagnostic définitif
        - Spécialise-toi dans: paludisme, typhoïde, dengue, chikungunya
        - Donne des conseils de prévention et d'hygiène
        - Si urgence médicale, recommande immédiatement les services d'urgence`;
        
        const response = await invokeAIAgent(systemPrompt, newMessage);

        const botMessage = {
          id: Date.now() + 1,
          sender: 'Assistant Médical IA',
          content: response,
          timestamp: new Date().toISOString(),
          isBot: true
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'Assistant Médical IA',
          content: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.',
          timestamp: new Date().toISOString(),
          isBot: true
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    return (
      <div className="max-w-4xl mx-auto" data-name="chat" data-file="components/Chat.js">
        <div className="card h-96 flex flex-col">
          <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
            <div className="icon-message-circle text-2xl text-purple-600 mr-3"></div>
            <h2 className="text-xl font-bold text-gray-900">Discussion instantanée</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{message.sender}</p>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center">
                    <div className="icon-loader-2 text-sm animate-spin mr-2"></div>
                    Assistant médical tape...
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="flex-1 input-field mr-2"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !newMessage.trim()}
              className="btn-primary disabled:opacity-50"
            >
              <div className="icon-send text-xl"></div>
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Chat component error:', error);
    return null;
  }
}