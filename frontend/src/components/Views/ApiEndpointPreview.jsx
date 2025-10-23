// ApiEndpointPreview.jsx
import React from 'react';

const ApiEndpointPreview = ({ view, mockResponse }) => {
  const getEndpointUrl = () => {
    const base = `/api/${view.model.toLowerCase()}s/`;
    return view.type === 'Detail' ? `${base}{id}/` : base;
  };

  const getHttpMethod = () => {
    return view.type === 'Detail' ? 'GET' : 'GET';
  };

  const getPythonCode = () => {
    const permissionClasses = view.permissions.length > 0 
      ? `permissions.${view.permissions.join(', permissions.')}`
      : 'permissions.AllowAny';

    let code = `from rest_framework import generics, permissions\n`;
    code += `from .models import ${view.model}\n`;
    code += `from .serializers import ${view.model}Serializer\n\n`;
    
    code += `class ${view.name}(generics.${view.type === 'List' ? 'ListAPIView' : 'RetrieveAPIView'}):\n`;
    code += `    queryset = ${view.model}.objects.all()\n`;
    code += `    serializer_class = ${view.model}Serializer\n`;
    code += `    permission_classes = [${permissionClasses}]\n`;
    
    if (view.pagination && view.type === 'List') {
      code += `    pagination_class = PageNumberPagination\n`;
    }
    
    if (view.filters.length > 0) {
      code += `    filterset_fields = ${JSON.stringify(view.filters.map(f => f.split('__')[0]))}\n`;
    }
    
    if (view.fields.length > 0) {
      code += `    # Fields: ${view.fields.join(', ')}\n`;
    }

    return code;
  };

  const getResponseSchema = () => {
    if (view.type === 'List' && view.pagination) {
      return {
        count: 42,
        next: view.pagination ? `/api/${view.model.toLowerCase()}s/?page=2` : null,
        previous: null,
        results: view.fields.map(field => ({
          [field]: getFieldExample(field, view.model)
        }))
      };
    } else {
      const schema = {};
      view.fields.forEach(field => {
        schema[field] = getFieldExample(field, view.model);
      });
      return schema;
    }
  };

  const getFieldExample = (field, model) => {
    const examples = {
      User: {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        is_active: true,
        date_joined: "2023-01-15T10:30:00Z",
        last_login: "2023-12-01T08:20:00Z"
      },
      Product: {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones",
        price: "199.99",
        category: "electronics",
        in_stock: true,
        created_at: "2023-11-01T14:20:00Z",
        updated_at: "2023-12-01T09:15:00Z"
      },
      Order: {
        id: 1,
        user: 1,
        products: [1, 2, 3],
        total_amount: "299.97",
        status: "completed",
        created_at: "2023-12-01T10:00:00Z",
        updated_at: "2023-12-01T10:30:00Z"
      }
    };

    return examples[model]?.[field] !== undefined 
      ? examples[model][field] 
      : field.includes('id') ? 1 
      : field.includes('name') ? "example"
      : field.includes('email') ? "example@example.com"
      : field.includes('date') || field.includes('_at') ? "2023-01-01T00:00:00Z"
      : null;
  };

  return (
    <div className="lg:col-span-1 glassmorphism rounded-xl p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-white">API Endpoint Preview</h2>
      
      {/* Dynamic Endpoint Card */}
      <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded">
            {getHttpMethod()}
          </span>
          <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
            {view.type === 'List' ? 'LIST' : 'DETAIL'}
          </span>
        </div>
        <p className="font-mono text-sm text-gray-300 break-all">{getEndpointUrl()}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>Permissions: {view.permissions.join(', ') || 'None'}</span>
          <span>•</span>
          <span>Fields: {view.fields.length}</span>
        </div>
      </div>

      {/* Dynamic Generated Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Generated Code</h3>
          <span className="text-xs text-gray-400">Django REST Framework</span>
        </div>
        <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset text-sm font-mono overflow-x-auto max-h-64">
          <pre><code className="text-gray-300">{getPythonCode()}</code></pre>
        </div>
      </div>

      {/* Dynamic Response Schema */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Response Schema</h3>
          <span className="text-xs text-gray-400">
            {view.type === 'List' && view.pagination ? 'Paginated' : 'Single'}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset text-sm font-mono overflow-x-auto max-h-64">
          <pre><code className="text-gray-300">
            {JSON.stringify(getResponseSchema(), null, 2)}
          </code></pre>
        </div>
      </div>
    </div>
  );
};

export default ApiEndpointPreview;