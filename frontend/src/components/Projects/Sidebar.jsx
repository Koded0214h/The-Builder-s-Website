const Sidebar = ({ onPublish }) => {
    const mainNavItems = [
      { icon: 'dashboard', label: 'Dashboard', active: true },
      { icon: 'database', label: 'Database' },
      { icon: 'api', label: 'Views' },
      { icon: 'route', label: 'URLs' },
      { icon: 'lock', label: 'Permissions' },
    ];
  
    const bottomNavItems = [
      { icon: 'settings', label: 'Settings' },
    ];
  
    const handlePublish = () => {
      if (onPublish) {
        onPublish();
      } else {
        console.log("Publish project clicked");
        // Add your publish logic here
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
              <a
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-black/20 shadow-neumorphic-inset' 
                    : 'hover:bg-white/5'
                }`}
                href="#"
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
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Publish Button */}
          <button 
            onClick={handlePublish}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors shadow-neumorphic border border-primary/20"
          >
            <span className="material-symbols-outlined text-primary">publish</span>
            <p className="text-primary font-medium">Publish</p>
          </button>
  
          {/* Settings Link */}
          {bottomNavItems.map((item, index) => (
            <a
              key={index}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-gray-400">{item.icon}</span>
              <p className="text-primary-text font-medium">{item.label}</p>
            </a>
          ))}
        </div>
      </aside>
    );
  };
  
  export default Sidebar;