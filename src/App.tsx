import React, { useState } from 'react';

const EmployeeTaskFetcher: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // This function will handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Clear previous error
    setError(null);

    try {
      // Send employee ID to your Lambda API endpoint using fetch
      const response = await fetch('YOUR_LAMBDA_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeID: employeeId }),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();

      // Assuming your Lambda returns the tasks in data.tasks
      setTasks(data.tasks || []);
    } catch (error: any) {
      setError(error.message || 'Error fetching tasks');
    }
  };

  return (
    <div>
      <h1>Fetch Employee Tasks</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Employee ID:
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {/* Display error if there's one */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the fetched tasks */}
      {tasks.length > 0 && (
        <div>
          <h2>Tasks for Employee {employeeId}</h2>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeeTaskFetcher;
