const BottomNav = () => {
    return (
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-1 sm:p-2 shadow-lg group hover:px-3 sm:hover:px-4 transition-all duration-300 z-50">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <a className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full hover:bg-white/20 transition-colors" href="#">
            <span className="material-symbols-outlined text-lg sm:text-xl">dashboard</span>
            <span className="hidden group-hover:inline text-xs sm:text-sm font-medium max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap">
              Dashboard
            </span>
          </a>
          <a className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full hover:bg-white/20 transition-colors" href="#">
            <span className="material-symbols-outlined text-lg sm:text-xl">folder</span>
            <span className="hidden group-hover:inline text-xs sm:text-sm font-medium max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap">
              Projects
            </span>
          </a>
          <a className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full hover:bg-white/20 transition-colors" href="#">
            <span className="material-symbols-outlined text-lg sm:text-xl">grid_view</span>
            <span className="hidden group-hover:inline text-xs sm:text-sm font-medium max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap">
              Templates
            </span>
          </a>
          <a className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full hover:bg-white/20 transition-colors" href="#">
            <span className="material-symbols-outlined text-lg sm:text-xl">settings</span>
            <span className="hidden group-hover:inline text-xs sm:text-sm font-medium max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap">
              Settings
            </span>
          </a>
        </div>
      </nav>
    );
  };
  
  export default BottomNav;