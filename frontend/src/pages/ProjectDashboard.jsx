import Sidebar from '../components/ProjectDashboard/Sidebar';
import Breadcrumbs from '../components/ProjectDashboard/Breadcrumbs';
import PageHeader from '../components/ProjectDashboard/PageHeader';
import StatsGrid from '../components/ProjectDashboard/StatsGrid';
import ModelsGrid from '../components/ProjectDashboard/ModelsGrid';
import ActionButton from '../components/ProjectDashboard/ActionButton';

const ProjectDashboard = () => {
  const recentModels = [
    {
      id: 1,
      name: "User Model",
      description: "Represents the application's users.",
      fields: 8,
      lastUpdated: "2h ago"
    },
    {
      id: 2,
      name: "Product Model",
      description: "Contains all product information.",
      fields: 15,
      lastUpdated: "1d ago"
    },
    {
      id: 3,
      name: "Order Model",
      description: "Tracks customer orders and details.",
      fields: 11,
      lastUpdated: "3d ago"
    }
  ];

  const stats = [
    { label: "Models", value: "12" },
    { label: "Endpoints", value: "24" },
    { label: "Active Users", value: "3" },
    { label: "Project Health", value: "99%" }
  ];

  const handleNewModel = () => {
    console.log("Create new model clicked");
    // Add your new model logic here
  };

  const handlePublish = () => {
    console.log("Publish project clicked");
    // Add your publish logic here
    // This could open a modal, make an API call, etc.
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-dark font-body text-primary-text">
      <Sidebar onPublish={handlePublish} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs projectName="E-commerce API" currentPage="Dashboard" />
          
          <PageHeader 
            title="Dashboard" 
            actionButton={
              <ActionButton icon="add" onClick={handleNewModel}>
                New Model
              </ActionButton>
            } 
          />
          
          <StatsGrid stats={stats} />
          
          <ModelsGrid models={recentModels} />
        </div>
      </main>
    </div>
  );
};

export default ProjectDashboard;