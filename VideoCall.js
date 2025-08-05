function VideoCall({ user, onNavigate }) {
  try {
    const [isCallActive, setIsCallActive] = React.useState(false);
    const [callType, setCallType] = React.useState('video');
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);

    const startCall = () => {
      setIsCallActive(true);
    };

    const endCall = () => {
      setIsCallActive(false);
      onNavigate('messaging');
    };

    const toggleMute = () => {
      setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
      setIsVideoOff(!isVideoOff);
    };

    if (!isCallActive) {
      return (
        <div className="max-w-4xl mx-auto" data-name="video-call" data-file="components/VideoCall.js">
          <div className="card text-center">
            <div className="icon-video text-6xl text-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold mb-4">Démarrer un appel</h2>
            
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => {setCallType('video'); startCall();}}
                className="btn-primary flex items-center"
              >
                <div className="icon-video text-xl mr-2"></div>
                Appel vidéo
              </button>
              <button
                onClick={() => {setCallType('audio'); startCall();}}
                className="btn-secondary flex items-center"
              >
                <div className="icon-phone text-xl mr-2"></div>
                Appel vocal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col">
        <div className="flex-1 relative">
          {callType === 'video' && !isVideoOff ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="icon-user text-6xl mb-4"></div>
                <p>Vidéo en cours...</p>
                <p className="text-sm text-gray-400">
                  {user.objectData.prenom} {user.objectData.nom}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="icon-phone text-6xl mb-4"></div>
                <p>Appel en cours...</p>
                <p className="text-sm text-gray-400">
                  {callType === 'video' ? 'Vidéo désactivée' : 'Appel vocal'}
                </p>
              </div>
            </div>
          )}

          {callType === 'video' && (
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-white text-xs">Vous</div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-800 flex justify-center space-x-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-600' : 'bg-gray-600'
            } text-white hover:opacity-80`}
          >
            <div className={`icon-${isMuted ? 'mic-off' : 'mic'} text-xl`}></div>
          </button>

          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoOff ? 'bg-red-600' : 'bg-gray-600'
              } text-white hover:opacity-80`}
            >
              <div className={`icon-${isVideoOff ? 'video-off' : 'video'} text-xl`}></div>
            </button>
          )}

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <div className="icon-phone-off text-xl"></div>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('VideoCall component error:', error);
    return null;
  }
}