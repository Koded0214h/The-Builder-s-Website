import { useState } from 'react';
import Header from "../components/Dashboard/Header";
import ProjectCard from "../components/Dashboard/ProjectCard";
import TemplateCard from "../components/Dashboard/TemplateCard";
import CreateProjectModal from "../components/Dashboard/CreateProjectModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = [
    {
      id: 1,
      name: "Project Alpha",
      description: "Django | 12 Models | Last modified: 2 days ago",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXkiw3PbkZ5YcuPABk8ZO-7RSTRrjrJX_1gKZZe1GmvQrH_qCT1a_PIzUVvukcJCyhZcj1FDyd50nJdqyL04eo3_lrDYMoJdTmoogAUwrF9rXMg7s1fyToGKumdvH8mcy-Si3DV9D_ivNSOZTSxv_pzRWFN2KMBrJp9ZkuIWafIKdNc91TcVv9nKKMrXV7aO6p19kRo2p49gWpMwZIFmBDYXWSIn9scLnYpNJFcWV07uAiDQU0QNsQcNi84ayp_yIeSrRUqbrAnJUI"
    },
    {
      id: 2,
      name: "Project Beta",
      description: "Express.js | 8 Models | Last modified: 5 days ago",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1AlHup2JpZFzHXVUILld__V30bqVfr3b2YJdLS7aL1C2X4ofMF9ZEooHWVjibW0WvNQPetu0dSczNnGbVk9yaxGyuYY_B8esHgmRwGEM-_rioRFicTTmR5MYeahctRtiXNMRph2DMrSw60jbvGqSKgPWVydxP-act2epL9HGHrlQ55A9oEwq17to5cRCeBnXe-zV91VH0xDHTIrINwqula_eJeyovPqBXTxH_NgYDVsPzr5abWHyLkFp6HfIZGufV4x190sX-GqR6"
    },
    {
      id: 3,
      name: "Project Gamma",
      description: "Django | 15 Models | Last modified: 1 week ago",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCowDShaMKAHjRuFRViMrvWPlBZnOKlQt02icJXRMnZmajS0D22PJgiXp7Zo5Vcu0Wt7zlaAcmyHWP2NPBHPOjYdWYPnOXp_nj7-H_awqbKdRIS47VTDrO7VK2D4b37NoaLDyEUFJSLd042kiKpxo2ZZdnMZId5zgXfXbHliQMCP5rPWGi5TAGQLZfu9oZuA4nhPuKFHBjaDlVze_ICsOHEZ6VYCCWntGMVHphJfmOste3mOUO9WM8fgLS0LfC-TfNDVVbQw5iiqpO_"
    },
    {
      id: 4,
      name: "Project Delta",
      description: "Express.js | 5 Models | Last modified: 2 weeks ago",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFpRZm8rkBLsH3SFVWxnxDJ-qR5VcLhTltokTCBbePHRklYF4EzsvJaQdseRTulpkcPdAYcA-UbBxADtKY7q_8E98qBCH1g37HjDXGR-8Xu-YYFU472B9OUTAjnD1wePkC1ZtRPnddx5mSJrPojC6PuJZK0NWdxq1CIgCAXH-PYQqsq58zK5l31QP0SiKbcx_6l18-1sqNVasrjcCB3_9hUFkO_ncbn_iayDmKGkAZRyyRfUdHV9E-50TEFx58GctFcxDd4-qyOZPG"
    }
  ];

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
              
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-2 md:p-4">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
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
      />
    </div>
  );
};

export default Dashboard;