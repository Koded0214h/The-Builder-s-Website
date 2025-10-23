// src/components/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI } from '../services/api';
import CreateProjectModal from '../components/Dashboard/CreateProjectModal';
import Header from '../components/Dashboard/Header';
import ProjectCard from '../components/Dashboard/ProjectCard';
import TemplateCard from '../components/Dashboard/TemplateCard';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects();
      setProjects(response.results || response); // Handle both list and paginated responses
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const templates = [
    {
      id: 1,
      name: "E-commerce Backend",
      description: "A robust backend for your online store.",
      hoverDescription: "A complete backend solution with users, products, orders, and payment integration.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCVGCkcA6UinYI3eRgEmv9r6MUrwuAqQgqJpp86zoQYPhle0nr49IheM1sL5xXE4PMG60Z8noWdPJvGkLDjpQ6w9XgdhWqMR9d7foiPU-svjCdxuPNaiPCkItYf6Uinj0hQw57x6Y2qwldarBDV_gmH1wYCTaz9Hm5KNMsCuEr57RdnOBfYLuGGueCBlTWKKCm_y3i3bEO26ubo2xb-BsBItyEz_nxIXMdfRF-oagmoKaGcHuPUI17BdtUW51IqP4j4lC0Nh81mUYn"
    },
    {
      id: 2,
      name: "Social Media API",
      description: "Kickstart your social network with this template.",
      hoverDescription: "Features user profiles, posts, comments, likes, and a follower system.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6LKebwsqs-Wq-qaNFoqpByjnCxDf-HKscHetDN7Lw8FrczeQq-fgqikhdZh7OZ0PSqvDhT1dopTId5Jc8oGe6FFiGAlwvr5Wvq85dLB7v8UdBtw2BxY7edRGkD2zemGGYKqlDWw2ScxmDYVpzXn-YGGV8sXj3A8FPu0rTsPWiIIGXgNC7Yf0yE6NfXsz71Z_BnkzGPIhe2Lvxs27ixYVeKQ7fcPTIkj3J3HBxLgwjCggKatb2THe5-Gr8Mr0UleIl8kUXrisvjOHF"
    },
    {
      id: 3,
      name: "Blog Platform",
      description: "A simple yet powerful blog engine.",
      hoverDescription: "Includes models for posts, categories, tags, and user comments.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTB3B_NS_1wVs3a7xPHP0-6jY392jrlAaw8gqoTRRL3OoESzW4z8wC3t-vK4n8_DWAM4MlFyturJvQMiUXC07SPcs-FYxdX20lm_pW1KpRvKuie_YOXCgO1S2CUq0VWGPvqk4uFHv-uG4_K_5wocfmP_-KS3OHH2nkFZ9nBtjIf5qikKTB9rBxZJYLZPN2ct2PZOGY3MLG7gLxV9EnIeqJybJfIWSsUJ6E69VkG7u3y6PWjuDdi5hwye6UbjH3CklSIu6NwWbcLr9x"
    }
  ];

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#1e1023] overflow-x-hidden pb-20 md:pb-0">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-6 lg:px-8 xl:px-40 flex flex-1 justify-center py-4 md:py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
              <Header />
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#1e1023] dark group/design-root overflow-x-hidden pb-20 md:pb-0">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-6 lg:px-8 xl:px-40 flex flex-1 justify-center py-4 md:py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            <Header />
            
            <main className="flex flex-col gap-6 md:gap-8 mt-6 md:mt-8">
              {/* Projects Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-2 md:px-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  My Projects
                </h1>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 sm:h-12 px-4 sm:px-6 bg-primary text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Create Project</span>
                </button>
              </div>

              {error && (
                <div className="px-4">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-2 md:p-4">
                {projects.length > 0 ? (
                  projects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onDelete={handleProjectDeleted}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">No projects yet</p>
                    <p className="text-gray-500 mt-2">Create your first project to get started</p>
                  </div>
                )}
              </div>
              
              {/* Templates Section */}
              <div className="px-2 md:px-4">
                <h2 className="text-white text-xl sm:text-2xl md:text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-4 md:pt-5">
                  Explore Templates
                </h2>
                <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4">
                  <div className="flex items-stretch gap-4 md:gap-6 min-w-min">
                    {templates.map(template => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Dashboard;