import React, { useState } from 'react';

const App: React.FC<{ signOut: () => void; user: { username: string } }> = ({ user, signOut }) => {
    const [employeeID, setEmployeeID] = useState<string>('');
    const [tasks, setTasks] = useState<any[]>([]); // Update type as needed

    const handleFetchTasks = (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent form submission
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
            <header>
                <img src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg" alt="Company Logo" className="logo" />
                <h1>Hello {user.username}</h1>
                <button onClick={signOut}>Sign out</button>
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
                {/* You can add more UI elements to display tasks here */}
            </div>
        </div>
    );
};

export default App;
