const Breadcrumbs = ({ projectName = "Project Name", currentPage = "Dashboard" }) => {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-gray-400 text-sm font-medium">{projectName}</span>
        <span className="text-gray-500 text-sm font-medium">/</span>
        <span className="text-white text-sm font-medium">{currentPage}</span>
      </div>
    );
  };
  
  export default Breadcrumbs;