const ProjectCard = ({ project }) => {
    return (
      <div className="flex flex-col gap-3 pb-3 bg-[#2e1835]/50 rounded-xl p-3 sm:p-4 border border-transparent hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
        <div 
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" 
          style={{backgroundImage: `url("${project.image}")`}}
        ></div>
        <div>
          <p className="text-white text-base sm:text-lg font-bold leading-normal truncate">{project.name}</p>
          <p className="text-[#bd8ecc] text-xs sm:text-sm font-normal leading-normal mt-1">{project.description}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <a className="text-primary text-xs sm:text-sm font-medium leading-normal hover:underline" href="#">
              Edit
            </a>
            <a className="text-primary text-xs sm:text-sm font-medium leading-normal hover:underline" href="#">
              Generate
            </a>
            <a className="text-primary text-xs sm:text-sm font-medium leading-normal hover:underline" href="#">
              Share
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectCard;