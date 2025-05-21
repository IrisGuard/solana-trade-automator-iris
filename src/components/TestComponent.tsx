
import React from 'react';

export function TestComponent() {
  // Use useState to verify React hooks are working properly
  const [count, setCount] = React.useState(0);
  
  // Handle increment to test React event handling
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-semibold">React 18.3.1 Test Component</h2>
      <p className="mt-2">This component tests that React JSX rendering is working properly.</p>
      <div className="mt-4">
        <p>Count: {count}</p>
        <button 
          onClick={handleIncrement}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
