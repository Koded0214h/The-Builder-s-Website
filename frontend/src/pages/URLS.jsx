import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import RouteCanvas from '../components/URLS/RouteCanvas';
import LiveUrlPreview from '../components/URLS/LiveUrlPreview';
import RouteConfiguration from '../components/URLS/RouteConfiguration';

const URLs = () => {
  const { projectId } = useParams();
  
  const [routes, setRoutes] = useState([
    {
      id: 1,
      path: '/api/users/',
      name: 'GetAllUsers',
      description: 'Retrieves a list of all users. Requires admin privileges.',
      permission: 'Admin Only',
      view: 'UserListView',
      namespace: '',
      regex: '',
      isSelected: false
    },
    {
      id: 2,
      path: '/api/users/{id}/',
      name: 'GetUserDetail',
      description: 'Fetches details for a specific user by their ID.',
      permission: 'Authenticated',
      view: 'UserDetailView',
      namespace: '',
      regex: '',
      isSelected: true
    },
    {
      id: 3,
      path: '/api/posts/',
      name: 'ListPosts',
      description: 'Returns a paginated list of public blog posts.',
      permission: 'Public',
      view: 'PostListView',
      namespace: '',
      regex: '',
      isSelected: false
    }
  ]);

  const [selectedRoute, setSelectedRoute] = useState(routes[1]);
  const [isAddingRoute, setIsAddingRoute] = useState(false);

  const handleAddRoute = () => {
    const newRoute = {
      id: Date.now(),
      path: '/api/new/',
      name: 'NewRoute',
      description: 'New route description',
      permission: 'Public',
      view: '',
      namespace: '',
      regex: '',
      isSelected: true
    };
    
    const updatedRoutes = routes.map(route => ({ ...route, isSelected: false }));
    setRoutes([...updatedRoutes, newRoute]);
    setSelectedRoute(newRoute);
    setIsAddingRoute(true);
  };

  const handleSelectRoute = (route) => {
    const updatedRoutes = routes.map(r => ({
      ...r,
      isSelected: r.id === route.id
    }));
    setRoutes(updatedRoutes);
    setSelectedRoute(route);
    setIsAddingRoute(false);
  };

  const handleUpdateRoute = (updatedRoute) => {
    const updatedRoutes = routes.map(route =>
      route.id === selectedRoute.id ? { ...route, ...updatedRoute } : route
    );
    setRoutes(updatedRoutes);
    setSelectedRoute(prev => ({ ...prev, ...updatedRoute }));
    setIsAddingRoute(false);
  };

  const handleDeleteRoute = (routeId) => {
    if (routes.length <= 1) {
      alert("You must have at least one route");
      return;
    }
    
    const updatedRoutes = routes.filter(route => route.id !== routeId);
    setRoutes(updatedRoutes);
    
    if (selectedRoute.id === routeId) {
      setSelectedRoute(updatedRoutes[0]);
    }
  };

  const handleSaveChanges = () => {
    // Simulate saving changes
    console.log("Saving route configuration...", selectedRoute);
    alert('Route configuration saved successfully!');
    setIsAddingRoute(false);
  };

  const handlePublish = () => {
    console.log("Publishing URL configuration...", routes);
    alert(`Successfully published ${routes.length} routes!`);
  };

  const handleGenerateCode = () => {
    const code = generateDjangoUrlsCode(routes);
    downloadCode(code, 'urls.py');
  };

  const generateDjangoUrlsCode = (routes) => {
    let code = `from django.urls import path\nfrom . import views\n\nurlpatterns = [\n`;
    
    routes.forEach(route => {
      const djangoPath = route.path
        .replace(/{(\w+)}/g, '<$1>')
        .replace(/\/$/, '');
      
      code += `    path('${djangoPath}', views.${route.view || route.name}, name='${route.name.toLowerCase()}'),\n`;
    });
    
    code += `]\n`;
    return code;
  };

  const downloadCode = (content, filename) => {
    const blob = new Blob([content], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-background-dark font-body text-primary-text overflow-hidden">
      <Sidebar 
        onPublish={handlePublish} 
        onGenerateCode={handleGenerateCode}
        activeTab="urls" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs projectName="E-commerce API" currentPage="URLs" projectId={projectId} />
        </div>
        
        <div className="flex-1 flex min-h-0">
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <RouteCanvas
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleSelectRoute}
              onAddRoute={handleAddRoute}
              onDeleteRoute={handleDeleteRoute}
            />
          </div>
          
          {/* Side Panel with Rounded Edges */}
          <div className="w-[380px] shrink-0 h-full flex flex-col glassmorphism border-l border-gray-700 rounded-l-2xl overflow-hidden">
            <RouteConfiguration
              route={selectedRoute}
              onUpdateRoute={handleUpdateRoute}
              onSaveChanges={handleSaveChanges}
              isNew={isAddingRoute}
            />
            <LiveUrlPreview route={selectedRoute} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLs;
