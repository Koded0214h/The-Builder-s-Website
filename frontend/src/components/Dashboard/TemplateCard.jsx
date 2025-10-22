const TemplateCard = ({ template }) => {
    return (
      <div className="flex h-full flex-1 flex-col gap-3 sm:gap-4 rounded-xl bg-[#2e1835] shadow-[0_0_15px_rgba(0,0,0,0.2)] min-w-[280px] sm:min-w-72 border border-transparent hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 group">
        <div 
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-t-xl flex flex-col" 
          style={{backgroundImage: `url("${template.image}")`}}
        >
          <div className="w-full h-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-t-xl p-3">
            <p className="text-white text-center text-sm sm:text-base">{template.hoverDescription}</p>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-between p-3 sm:p-4 pt-0 gap-3 sm:gap-4">
          <div>
            <p className="text-white text-base sm:text-lg font-bold leading-normal">{template.name}</p>
            <p className="text-[#bd8ecc] text-xs sm:text-sm font-normal leading-normal mt-1">{template.description}</p>
          </div>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-10 px-3 sm:px-4 bg-primary/80 text-white text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary transition-colors">
            <span className="truncate">Use Template</span>
          </button>
        </div>
      </div>
    );
  };
  
  export default TemplateCard;