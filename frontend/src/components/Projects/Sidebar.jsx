import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ onPublish, activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const mainNavItems = [
    { icon: 'dashboard', label: 'Dashboard', active: activeTab === 'dashboard', path: '/project/1' },
    { icon: 'database', label: 'Database', active: activeTab === 'database', path: '/project/1/database' },
    { icon: 'api', label: 'Views', active: activeTab === 'views', path: '/project/1/views' },
    { icon: 'route', label: 'URLs', active: activeTab === 'urls', path: '/project/1/urls' },
    { icon: 'lock', label: 'Permissions', active: activeTab === 'permissions', path: '/project/1/permissions' },
  ];

  const bottomNavItems = [
    { icon: 'settings', label: 'Settings', path: '/project/1/settings' },
  ];

  const handlePublish = () => {
    navigate("/publish");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    } else if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "RS";
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.username) {
      return user.username;
    }
    return "User";
  };

  return (
    <aside className="w-64 flex-shrink-0 p-6 flex flex-col justify-between bg-[#1A1A1A] border-r border-gray-800 h-screen overflow-hidden">
      {/* Top Section - Fixed height */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-sm">
                {getUserInitials()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-white text-lg font-display font-bold">Rapid Scaffolder</h1>
            <p className="text-gray-400 text-sm">
              {user?.profile?.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2">
          {mainNavItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors flex-shrink-0 ${
                item.active 
                  ? 'bg-black/20 shadow-neumorphic-inset' 
                  : 'hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined ${
                item.active ? 'text-primary' : 'text-gray-400'
              }`}>
                {item.icon}
              </span>
              <p className={`font-medium ${
                item.active ? 'text-primary' : 'text-primary-text'
              }`}>
                {item.label}
              </p>
              {item.label === 'Permissions' && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded ml-auto">
                  SOON
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Bottom Section - Fixed height */}
      <div className="flex-shrink-0 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 mb-2">
          <div className="bg-primary/20 rounded-full size-8 flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-xs">
                {getUserInitials()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {getUserDisplayName()}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Publish Button */}
        <button 
          onClick={handlePublish}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors shadow-neumorphic border border-primary/20 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-primary">publish</span>
          <p className="text-primary font-medium">Publish</p>
        </button>

        {/* Settings Link */}
        {bottomNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors flex-shrink-0 ${
              activeTab === 'settings' 
                ? 'bg-black/20 shadow-neumorphic-inset' 
                : 'hover:bg-white/5'
            }`}
          >
            <span className={`material-symbols-outlined ${
              activeTab === 'settings' ? 'text-primary' : 'text-gray-400'
            }`}>
              {item.icon}
            </span>
            <p className={`font-medium ${
              activeTab === 'settings' ? 'text-primary' : 'text-primary-text'
            }`}>
              {item.label}
            </p>
          </Link>
        ))}

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0 text-gray-300 hover:text-red-300 border border-transparent hover:border-red-500/20"
        >
          <span className="material-symbols-outlined">logout</span>
          <p className="font-medium">Logout</p>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;