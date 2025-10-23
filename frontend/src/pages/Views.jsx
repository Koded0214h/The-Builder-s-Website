import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Projects/Sidebar';
import Breadcrumbs from '../components/Projects/Breadcrumbs';
import ViewConfiguration from '../components/Views/ViewConfiguration';
import ApiEndpointPreview from '../components/Views/ApiEndpointPreview';
import ApiTestConsole from '../components/Views/ApiTestConsole';
import ViewsList from '../components/Views/ViewsList';

const Views = () => {
  const { projectId } = useParams();
  
  // Mock data for models and their fields
  const availableModels = [
    {
      name: "User",
      fields: ["id", "username", "email", "first_name", "last_name", "is_active", "date_joined", "last_login"]
    },
    {
      name: "Product", 
      fields: ["id", "name", "description", "price", "category", "in_stock", "created_at", "updated_at"]
    },
    {
      name: "Order",
      fields: ["id", "user", "products", "total_amount", "status", "created_at", "updated_at"]
    }
  ];

  const [views, setViews] = useState([
    {
      id: 1,
      name: "UserListView",
      model: "User",
      type: "List",
      permissions: ["IsAuthenticated"],
      pagination: true,
      pageSize: 20,
      fields: ["id", "username", "email", "date_joined"],
      filters: ["username__icontains"],
      searchFields: ["username", "email"],
      ordering: ["-date_joined"]
    },
    {
      id: 2,
      name: "UserDetailView",
      model: "User",
      type: "Detail",
      permissions: ["IsAuthenticated"],
      pagination: false,
      fields: ["id", "username", "email", "first_name", "last_name", "date_joined", "last_login"],
      filters: [],
      searchFields: [],
      ordering: []
    }
  ]);

  const [selectedView, setSelectedView] = useState(views[0]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Mock API responses
  const mockApiResponses = {
    UserListView: {
      count: 42,
      next: "/api/users/?page=2",
      previous: null,
      results: [
        { id: 1, username: "john_doe", email: "john@example.com", date_joined: "2023-01-15T10:30:00Z" },
        { id: 2, username: "jane_smith", email: "jane@example.com", date_joined: "2023-02-20T14:45:00Z" },
        { id: 3, username: "bob_wilson", email: "bob@example.com", date_joined: "2023-03-10T09:15:00Z" }
      ]
    },
    UserDetailView: {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      first_name: "John",
      last_name: "Doe",
      date_joined: "2023-01-15T10:30:00Z",
      last_login: "2023-12-01T08:20:00Z"
    }
  };

  const handleAddView = () => {
    const newView = {
      id: Date.now(),
      name: `NewView${views.length + 1}`,
      model: "User",
      type: "List",
      permissions: [],
      pagination: true,
      pageSize: 20,
      fields: [],
      filters: [],
      searchFields: [],
      ordering: []
    };
    setViews([...views, newView]);
    setSelectedView(newView);
    setIsCreatingNew(true);
  };

  const handleDeleteView = (viewId) => {
    if (views.length <= 1) {
      alert("You must have at least one view");
      return;
    }
    
    const updatedViews = views.filter(view => view.id !== viewId);
    setViews(updatedViews);
    
    if (selectedView.id === viewId) {
      setSelectedView(updatedViews[0]);
    }
  };

  const handleUpdateView = (updatedView) => {
    const updatedViews = views.map(view => 
      view.id === selectedView.id ? { ...view, ...updatedView } : view
    );
    setViews(updatedViews);
    setSelectedView(prev => ({ ...prev, ...updatedView }));
    setIsCreatingNew(false);
  };

  const handleDuplicateView = (viewId) => {
    const viewToDuplicate = views.find(view => view.id === viewId);
    if (viewToDuplicate) {
      const duplicatedView = {
        ...viewToDuplicate,
        id: Date.now(),
        name: `${viewToDuplicate.name}_Copy`
      };
      setViews([...views, duplicatedView]);
      setSelectedView(duplicatedView);
    }
  };

  const handlePublish = () => {
    // Simulate publishing
    console.log("Publishing views configuration...", views);
    alert(`Successfully published ${views.length} views!`);
  };

  const handleGenerateCode = () => {
    // Generate downloadable code
    const code = generateDjangoCode(views);
    downloadCode(code, 'views.py');
  };

  const generateDjangoCode = (views) => {
    let code = `from rest_framework import generics, permissions\nfrom .models import ${[...new Set(views.map(v => v.model))].join(', ')}\nfrom .serializers import ${[...new Set(views.map(v => `${v.model}Serializer`))].join(', ')}\n\n`;
    
    views.forEach(view => {
      code += `class ${view.name}(generics.${view.type === 'List' ? 'ListAPIView' : 'RetrieveAPIView'}):\n`;
      code += `    queryset = ${view.model}.objects.all()\n`;
      code += `    serializer_class = ${view.model}Serializer\n`;
      
      if (view.permissions.length > 0) {
        code += `    permission_classes = [permissions.${view.permissions.join(', permissions.')}]\n`;
      }
      
      if (view.pagination && view.type === 'List') {
        code += `    pagination_class = PageNumberPagination\n`;
      }
      
      if (view.searchFields.length > 0) {
        code += `    search_fields = ${JSON.stringify(view.searchFields)}\n`;
      }
      
      if (view.ordering.length > 0) {
        code += `    ordering_fields = ${JSON.stringify(view.ordering.map(f => f.replace('-', '')))}\n`;
        code += `    ordering = ${JSON.stringify(view.ordering)}\n`;
      }
      
      code += `\n`;
    });
    
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
        activeTab="views" 
      />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 p-8">
          <Breadcrumbs projectName="E-commerce API" currentPage="Views" projectId={projectId} />
        </div>
        
        <div className="flex-1 flex min-h-0">
          {/* Views List Sidebar - Fixed height, no scroll */}
          <div className="w-80 border-r border-gray-700 bg-[#1A1A1A] flex flex-col">
            <ViewsList
              views={views}
              selectedView={selectedView}
              onSelectView={setSelectedView}
              onAddView={handleAddView}
              onDeleteView={handleDeleteView}
              onDuplicateView={handleDuplicateView}
            />
          </div>
          
          {/* Main Content - Scrollable area */}
          <div className="flex-1 overflow-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
              <ViewConfiguration 
                view={selectedView}
                onUpdateView={handleUpdateView}
                availableModels={availableModels}
                isCreatingNew={isCreatingNew}
              />
              <ApiEndpointPreview 
                view={selectedView}
                mockResponse={mockApiResponses[selectedView.name]}
              />
              <ApiTestConsole 
                view={selectedView}
                mockResponse={mockApiResponses[selectedView.name]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Views;