import React, { useState } from 'react';

const EmployeeForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      setMessage(`Employee ID submitted: ${employeeId}`);
      // Here you can handle further actions, like sending the ID to a backend or API
    } else {
      setMessage('Please enter a valid Employee ID.');
    }
  };

  return (
    <div>
      <h2>Enter Employee ID</h2>
      <form onSubmit={handleSubmit}>
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
