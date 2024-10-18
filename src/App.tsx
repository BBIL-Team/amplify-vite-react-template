import React from 'react';

interface AppProps {
    user: { username: string };
    signOut: () => void;
}

const App: React.FC<AppProps> = ({ user, signOut }) => {
    return (
        <div>
            <header>
                <img src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg" alt="Company Logo" className="logo" />
                <>
                    <h1>Hello {user.username}</h1>
                    <button onClick={signOut}>Sign out</button>
                </>
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
            </div>
        </div>
    );
};

export default App;
