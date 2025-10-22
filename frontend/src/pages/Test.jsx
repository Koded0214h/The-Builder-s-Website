const TestPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Tailwind CSS Test
          </h1>
          <p className="text-gray-600 text-center mb-6">
            If this looks styled, Tailwind is working!
          </p>
          
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex-1">
                Primary
              </button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex-1">
                Secondary
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-1 rounded-lg">
              <div className="bg-white rounded-md p-4">
                <p className="text-gray-700">Gradient border card</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Working ✅
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TestPage;