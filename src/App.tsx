import React, { useState } from 'react';

const EmployeeForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [tasks, setTasks] = useState<string[][]>([]);

  const handleFetchTasks = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch(`https://imf44ag3d4.execute-api.ap-south-1.amazonaws.com/S1/Test5?EmployeeID=${encodeURIComponent(employeeId)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        const taskRows = parseTasksData(data);
        setTasks(taskRows);
        setMessage('Tasks fetched successfully!'); // Set success message
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setTasks([]);
        setMessage('Error fetching data. Please try again later.'); // Set error message
      });
  };

  const parseTasksData = (data: string) => {
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
      {tasks.length > 0 && (
        <div>
          <h3>Tasks:</h3>
          <table>
            <tbody>
              {tasks.map((taskRow, index) => (
                <tr key={index}>
                  {taskRow.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeForm;
