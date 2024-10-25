import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {
    const { signOut } = useAuthenticator();
  const [employeeId, setEmployeeId] = useState('');
  const [tasks, setTasks] = useState<string[][]>([]); // 2D array for table rows and columns
  const [error, setError] = useState<string | null>(null);
  const [popupContent, setPopupContent] = useState<
    { employeeID: string; employeeName: string; taskDescription: string; startDate: string; endDate: string; rate: string; remarks: string }[]
  >([]);
  const [editPopupVisible, setEditPopupVisible] = useState(false);

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

  // Function to handle the change in the popup inputs
  const handleChange = (index: number, field: string, value: string) => {
    const updatedContent = [...popupContent];
    updatedContent[index] = { ...updatedContent[index], [field]: value };
    setPopupContent(updatedContent);
  };


  // Function to show the edit popup
  const showEditPopup = () => {
    const content = tasks.map(task => ({
      employeeID: task[0],
      employeeName: task[1],
      taskDescription: task[2],
      startDate: task[3],
      endDate: task[4],
      rate: task[5] || '',
      remarks: task[6] || ''
    }));
    setPopupContent(content);
    setEditPopupVisible(true);
  };

 const saveChanges = () => {
  const tasksData = popupContent.map(task => (
    `${task.employeeID},${task.taskDescription},${task.rate || ''},${task.remarks || ''}`
  ));

  if (tasksData.length === 0) {
    alert("No tasks to save.");
    return;
  }

  // Send data to the Lambda function as plain text
  fetch('https://tfyct2zj8k.execute-api.ap-south-1.amazonaws.com/A1/test3', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: tasksData.join('\n') // Join tasks data with new lines
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Tasks updated successfully!');
      setEditPopupVisible(false); // Close the popup on success

      // Instead of triggering a synthetic event, directly call handleSubmit logic
      handleSubmit({
        preventDefault: () => {}, // Mocking the preventDefault function since it's a form event
      } as React.FormEvent);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Failed to update tasks: ' + error.message);
    });
};


  return (
    <div style={{ height: '820px', display: 'flex', flexDirection: 'column', padding: '10', width: '90vw', margin: '0 auto', boxSizing: 'border-box', backgroundColor: '#E2E2E2' }}>
      <header>
        <img src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg" alt="Company Logo" className="logo" />
      </header>

      <h1 style={{ textAlign: 'center' }}>Corporate Communications - Employee Task List</h1>
      <div className="container">
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
          <div id="cardContainer">
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

        {/* Edit Button */}
        {tasks.length > 0 && <button onClick={showEditPopup}>Edit Tasks</button>}

        {/* Display popup content */}
        {editPopupVisible && (
          <div className="popup">
            <h2>Edit Tasks</h2>
            <div id="popupContent">
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
                  {popupContent.map((task, index) => (
                    <tr key={index}>
                      <td>{task.employeeID}</td>
                      <td>{task.employeeName}</td>
                      <td>{task.taskDescription}</td>
                      <td>{task.startDate}</td>
                      <td>{task.endDate}</td>
                      <td><input
                          type="number" 
                          value={task.rate} 
                          min="1" 
                          max="5" 
                      onChange={e => handleChange(index, 'rate', e.target.value)} 
                      />
                      </td>
                      <td><input 
                          type="text" 
                          value={task.remarks} 
                          onChange={e => handleChange(index, 'remarks', e.target.value)} 
                      />
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Save button */}
            <button onClick={saveChanges}>Save</button>
            <button onClick={() => setEditPopupVisible(false)}>Close</button>
          </div>
        )}
      </div>
       <button style={{ marginLeft: 'auto' }} onClick={signOut}>Sign out</button>
    </div>
  );
};
export default App;
