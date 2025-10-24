// ApiTestConsole.jsx
import React, { useState, useEffect } from 'react';

const ApiTestConsole = ({ view, mockResponse }) => {
  const [requestMethod, setRequestMethod] = useState('GET');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [requestBody, setRequestBody] = useState('');
  const [requestParams, setRequestParams] = useState('');

  useEffect(() => {
    // Reset when view changes
    setRequestMethod('GET');
    setResponse(null);
    setRequestBody('');
    setRequestParams('');
  }, [view]);

  const getEndpointUrl = () => {
    const base = `/api/${view.model.toLowerCase()}/`;
    let url = base;
    
    if (view.type === 'Detail') {
      url += '1/'; // Example ID
    }
    
    // Add query params for list views
    if (view.type === 'List' && requestParams) {
      url += `?${requestParams}`;
    }
    
    return url;
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate dynamic mock response based on view configuration
    const dynamicResponse = generateMockResponse();
    setResponse({
      status: 200,
      statusText: 'OK',
      data: dynamicResponse,
      time: Math.floor(Math.random() * 200) + 50 // Random response time 50-250ms
    });
    
    setIsLoading(false);
  };

  const generateMockResponse = () => {
    if (view.type === 'List') {
      // Generate multiple items for list view
      const results = Array.from({ length: Math.min(view.pageSize || 3, 5) }, (_, index) => {
        const item = {};
        view.fields.forEach(field => {
          item[field] = generateMockFieldValue(field, index + 1);
        });
        return item;
      });

      if (view.pagination) {
        return {
          count: 42,
          next: results.length < 42 ? `/api/${view.model.toLowerCase()}s/?page=2` : null,
          previous: null,
          results
        };
      }
      return results;
    } else {
      // Single item for detail view
      const item = {};
      view.fields.forEach(field => {
        item[field] = generateMockFieldValue(field, 1);
      });
      return item;
    }
  };

  const generateMockFieldValue = (field, id) => {
    const fieldExamples = {
      id: id,
      username: `user${id}`,
      email: `user${id}@example.com`,
      first_name: ['John', 'Jane', 'Bob', 'Alice'][id % 4],
      last_name: ['Doe', 'Smith', 'Wilson', 'Johnson'][id % 4],
      is_active: true,
      date_joined: `2023-${String((id % 12) + 1).padStart(2, '0')}-15T10:30:00Z`,
      last_login: `2023-12-${String(id).padStart(2, '0')}T08:20:00Z`,
      name: `Product ${id}`,
      description: `Description for product ${id}`,
      price: (id * 25.99).toFixed(2),
      category: ['electronics', 'clothing', 'books', 'home'][id % 4],
      in_stock: id % 3 !== 0,
      created_at: `2023-11-${String(id).padStart(2, '0')}T14:20:00Z`,
      updated_at: `2023-12-${String(id).padStart(2, '0')}T09:15:00Z`,
      user: id,
      products: [1, 2, 3],
      total_amount: (id * 99.99).toFixed(2),
      status: ['pending', 'completed', 'cancelled'][id % 3]
    };

    return fieldExamples[field] !== undefined 
      ? fieldExamples[field] 
      : `mock_${field}`;
  };

  const getCurlCommand = () => {
    let curl = `curl -X ${requestMethod} \\\n`;
    curl += `  "http://localhost:8000${getEndpointUrl()}" \\\n`;
    
    if (view.permissions.includes('IsAuthenticated')) {
      curl += `  -H "Authorization: Bearer <your_token>" \\\n`;
    }
    
    curl += `  -H "Content-Type: application/json"`;
    
    if (requestBody && requestMethod !== 'GET') {
      curl += ` \\\n  -d '${requestBody}'`;
    }
    
    return curl;
  };

  return (
    <div className="lg:col-span-1 glassmorphism rounded-xl p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-white">API Test Console</h2>
      
      {/* Method and URL */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <select 
            value={requestMethod}
            onChange={(e) => setRequestMethod(e.target.value)}
            className="flex-none w-24 rounded-lg h-10 px-3 text-sm focus:outline-none bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
          >
            <option value="GET" className="text-black">GET</option>
            <option value="POST" className="text-black">POST</option>
            <option value="PUT" className="text-black">PUT</option>
            <option value="PATCH" className="text-black">PATCH</option>
            <option value="DELETE" className="text-black">DELETE</option>
          </select>
          <div className="flex-1 font-mono text-sm text-gray-300 bg-[#121212] p-2 rounded border border-gray-600 truncate">
            {getEndpointUrl()}
          </div>
        </div>

        <button 
          onClick={handleSendRequest}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-black font-bold neumorphic-outset hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
              Testing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              Test Endpoint
            </>
          )}
        </button>
      </div>

      {/* Request Parameters */}
      {view.type === 'List' && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Query Parameters</h3>
          <input
            type="text"
            placeholder="page=1&amp;search=john"
            value={requestParams}
            onChange={(e) => setRequestParams(e.target.value)}
            className="w-full rounded-lg h-10 p-2 text-sm focus:outline-none font-mono bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      {/* Request Body */}
      {requestMethod !== 'GET' && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Request Body</h3>
          <textarea
            placeholder="Enter JSON request body..."
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full rounded-lg h-24 p-3 text-sm focus:outline-none font-mono resize-none bg-[#2C2C2C] border border-[#4A4A4A] text-white focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      {/* cURL Command */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">cURL Command</h3>
        <div className="p-3 rounded-lg bg-[#121212] neumorphic-inset">
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
            {getCurlCommand()}
          </pre>
        </div>
      </div>

      {/* Response Viewer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Response</h3>
          {response && (
            <span className="text-xs font-semibold text-green-400">
              Status: {response.status} {response.statusText}
            </span>
          )}
        </div>
        
        <div className="p-4 rounded-lg bg-[#121212] neumorphic-inset">
          {response ? (
            <>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-green-400">✓ Success</span>
                <span className="text-gray-400">Time: {response.time}ms</span>
              </div>
              <div className="text-sm font-mono overflow-auto max-h-64">
                <pre className="text-gray-300">{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2">api</span>
              <p className="text-sm">Click "Test Endpoint" to see the response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTestConsole;