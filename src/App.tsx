import React, { useState } from 'react';

const EmployeeTaskFetcher: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [tasks, setTasks] = useState<string[][]>([]); // 2D array for table rows and columns
  const [error, setError] = useState<string | null>(null);

  // This function will handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Clear previous error
    setError(null);

    try {
      // Send employee ID to your Lambda API endpoint using fetch
      const response = await fetch(`https://aehcu90kr8.execute-api.ap-south-1.amazonaws.com/default/Test5?EmployeeID=${encodeURIComponent(employeeId)}`);

      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      // Get the HTML response as a string
      const data = await response.text();

      // Parse the HTML response and extract tasks
      const taskRows = parseTasksFromHTML(data);
      
      // Update the state with the parsed tasks
      setTasks(taskRows);
    } catch (error: any) {
      setError(error.message || 'Error fetching tasks');
    }
  };

  // Function to parse HTML response and extract tasks
  const parseTasksFromHTML = (html: string): string[][] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Assuming the tasks are in <table> rows, parse them into a 2D array
    const rows = Array.from(doc.querySelectorAll('tr')).map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      return cells.map(cell => cell.innerText); // Return each cell's inner text as an array
    });

    return rows.filter(row => row.length > 0); // Filter out empty rows
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
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Task Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Rate</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task: string[], index: number) => (
                <tr key={index}>
                  {task.map((cell: string, cellIndex: number) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        {tasks.length > 0 && (
        <button>Edit Tasks</button>
        )}
    </div>
  );
};

export default EmployeeTaskFetcher;
