import { Link } from 'react-router-dom';

const Breadcrumbs = ({ projectName = "Project Name", currentPage = "Dashboard", projectId = "1" }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Link 
        to={`/project/${projectId}`}
        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
      >
        {projectName}
      </Link>
      <span className="text-gray-500 text-sm font-medium">/</span>
      <span className="text-white text-sm font-medium">{currentPage}</span>
    </div>
  );
};

export default Breadcrumbs;