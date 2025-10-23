import { Link } from "react-router-dom";

const Sidebar = ({ onPublish, activeTab = 'dashboard' }) => {
    const mainNavItems = [
      { icon: 'dashboard', label: 'Dashboard', active: activeTab === 'dashboard', path: '/project/1' },
      { icon: 'database', label: 'Database', active: activeTab === 'database', path: '/project/1/database' },
      { icon: 'api', label: 'Views', active: activeTab === 'views', path: '#' },
      { icon: 'route', label: 'URLs', active: activeTab === 'urls', path: '#' },
      { icon: 'lock', label: 'Permissions', active: activeTab === 'permissions', path: '#' },
    ];
  
    const bottomNavItems = [
      { icon: 'settings', label: 'Settings', path: '#' },
    ];
  
    const handlePublish = () => {
      if (onPublish) {
        onPublish();
      } else {
        console.log("Publish project clicked");
      }
    };
  
    return (
      <aside className="glassmorphic-sidebar w-64 flex-shrink-0 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6AzxbWD3FvM5sL7gNXR1uFZ4i0cI-73SypWZafl-8PANnOH4zSz00PQdvLwPmaNwy8mwSOwHuzN2k1RInXKNkYW8z7I6CErtmdAJmQCwt8FkmYFNHgbvQ3p7Jgtev08ECYYDgBcQeTTznl--U0B6CRlB7QDFyyYyXGLHjGlucpvSVp8aFu_R4S6lTLff192RHTi8G95Rst9vJZTvDD6jzbGHjvDY_0j0cOeAcK4vDdNyHFXL4-Nnr0smCXSvMikZ2de7u15ILGOQy")'}}
            ></div>
            <h1 className="text-white text-lg font-display font-bold">Rapid Scaffolder</h1>
          </div>
          
          <nav className="flex flex-col gap-4">
            {mainNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={handlePublish}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors shadow-neumorphic border border-primary/20"
          >
            <span className="material-symbols-outlined text-primary">publish</span>
            <p className="text-primary font-medium">Publish</p>
          </button>
  
          {bottomNavItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400">{item.icon}</span>
              <p className="text-primary-text font-medium">{item.label}</p>
            </Link>
          ))}
        </div>
      </aside>
    );
  };
  
  export default Sidebar;