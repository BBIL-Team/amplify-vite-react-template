import React, { useState, FormEvent } from 'react';
import './App.css'; // Import the CSS file

interface Task {
    employeeID: string;
    employeeName: string;
    taskDescription: string;
    startDate: string;
    endDate: string;
    rate: number;
    remarks: string;
}

const EmployeeTaskList: React.FC = () => {
    const [employeeID, setEmployeeID] = useState<string>('');
    const [tasks, setTasks] = useState<string[][]>([]);
    const [editPopupVisible, setEditPopupVisible] = useState<boolean>(false);
    const [popupContent, setPopupContent] = useState<Task[]>([]);

    const handleFetchTasks = (event: FormEvent) => {
        event.preventDefault();

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

    const parseTasksData = (data: string): string[][] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const rows = Array.from(doc.querySelectorAll('tr')).map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return cells.map(cell => cell.innerText);
        });
        return rows.filter(row => row.length > 0); // Filter out empty rows
    };

    const showEditPopup = () => {
        const content: Task[] = tasks.map(task => ({
            employeeID: task[0],
            employeeName: task[1],
            taskDescription: task[2],
            startDate: task[3],
            endDate: task[4],
           rate: task[5] ? parseFloat(task[5]) : 0, // Convert the rate to a number
            remarks: task[6] || ''
        }));
        setPopupContent(content);
        setEditPopupVisible(true);
    };

    const handleChange = (index: number, field: keyof Task, value: string) => {
    const updatedTasks = [...popupContent];

    // Check if the field being updated is 'rate', convert it to a number
    updatedTasks[index][field] = field === 'rate' ? Number(value) : value;

    setPopupContent(updatedTasks);
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
            handleFetchTasks(); // Refresh tasks
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to update tasks: ' + error.message);
        });
    };

    const closePopup = () => {
        setEditPopupVisible(false);
    };

    return (
        <div>
            <header>
                <img src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg" alt="Company Logo" className="logo" />
            </header>
            <h1 style={{ textAlign: 'center' }}>Corporate Communications - Employee Task List</h1>
            <div className="container">
                <form onSubmit={handleFetchTasks}>
                    <label htmlFor="employeeID">Enter Employee ID:</label>
                    <input 
                        type="text" 
                        id="employeeID" 
                        value={employeeID} 
                        onChange={e => setEmployeeID(e.target.value)} 
                        required 
                    />
                    <button type="submit">Fetch Tasks</button>
                </form>
                <div id="cardContainer">
                    {tasks.length > 0 && (
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
                                {tasks.map((task, index) => (
                                    <tr key={index}>
                                        {task.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {tasks.length > 0 && (
                    <button onClick={showEditPopup}>Edit Tasks</button>
                )}
            </div>

            {/* Popup for editing tasks */}
            {editPopupVisible && (
                <div className="popup">
                    <h3>Edit Tasks</h3>
                    <div id="popupContent">
                        <table border="1" style={{ width: '100%' }}>
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
                                        <td>
                                            <input 
                                                type="number" 
                                                value={task.rate} 
                                                min="1" 
                                                max="5" 
                                                onChange={e => handleChange(index, 'rate', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input 
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
                    <button onClick={saveChanges}>Save</button>
                    <button onClick={closePopup}>Close</button>
                </div>
            )}
            {editPopupVisible && <div className="overlay" onClick={closePopup}></div>}
        </div>
    );
};

export default EmployeeTaskList;
