import React, { useState } from 'react';

export const Sequential = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');

  const addRecord = () => {
    if (input) {
      const newRecords = [...records, input].sort();
      setRecords(newRecords);
      setInput('');
    }
  };

  return (
    <div>
      <p className="mb-2">Add records (stored in sorted order):</p>
      <input
        type="text"
        className="p-2 border rounded mr-2"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={addRecord} className="bg-purple-500 text-white px-4 py-2 rounded">Add</button>
      <div className="mt-4 flex flex-wrap gap-2">
        {records.map((record, index) => (
          <div key={index} className="bg-indigo-300 text-white px-3 py-1 rounded-full">
            {record}
          </div>
        ))}
      </div>
    </div>
  );
};