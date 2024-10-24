import React, { useState } from 'react';

const EmployeeForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [tasks, setTasks] = useState<string[]>([]);

      const handleFetchTasks = (event) => {
        // Conditionally check for event before using preventDefault
        if (event) {
            event.preventDefault();
        }

        fetch(`https://imf44ag3d4.execute-api.ap-south-1.amazonaws.com/S1/Test5?EmployeeID=${encodeURIComponent(employeeID)}`)
            .then(response => response.text())
            .then(data => {
                const taskRows = parseTasksData(data);
                setTasks(taskRows);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setTasks([]);
                alert('Error fetching data. Please try again later.');
            });
    };

    const parseTasksData = (data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const rows = Array.from(doc.querySelectorAll('tr')).map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return cells.map(cell => cell.innerText);
        });
        return rows.filter(row => row.length > 0); // Filter out empty rows
    };

  return (
    <div>
      <h2>Enter Employee ID</h2>
      <form onSubmit={handleFetchTasks}>
        <label htmlFor="employeeId">Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter Employee ID"
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmployeeForm;
