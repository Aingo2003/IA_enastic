function Notifications({ user }) {
  try {
    const [notifications, setNotifications] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      loadNotifications();
    }, []);

    const loadNotifications = async () => {
      try {
        const notifs = await NotificationService.getNotifications(user.objectId);
        setNotifications(notifs);
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const markAsRead = async (notificationId) => {
      try {
        await NotificationService.markAsRead(notificationId);
        loadNotifications();
      } catch (error) {
        console.error('Erreur marquage lu:', error);
      }
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="icon-loader-2 text-2xl text-blue-600 animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto" data-name="notifications" data-file="components/Notifications.js">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Vos alertes et rappels médicaux</p>
        </div>

        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.objectId} 
              className={`card ${notification.objectData.lu ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`icon-${notification.objectData.type_notification === 'rdv_rappel' ? 'calendar' : 
                      notification.objectData.type_notification === 'diagnostic_pret' ? 'stethoscope' : 'check-circle'} 
                      text-xl mr-3 ${notification.objectData.lu ? 'text-gray-500' : 'text-blue-600'}`}></div>
                    <h3 className="font-semibold text-gray-900">{notification.objectData.titre}</h3>
                  </div>
                  <p className="text-gray-700 mb-2">{notification.objectData.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.objectData.date_envoi).toLocaleDateString('fr-FR')} à {new Date(notification.objectData.date_envoi).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
                {!notification.objectData.lu && (
                  <button
                    onClick={() => markAsRead(notification.objectId)}
                    className="btn-secondary text-sm"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="icon-bell text-4xl text-gray-400 mb-4"></div>
            <p className="text-gray-500">Aucune notification pour le moment</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Notifications component error:', error);
    return null;
  }
}