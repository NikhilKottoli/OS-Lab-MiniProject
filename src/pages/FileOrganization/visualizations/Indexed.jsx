import React, { useState } from 'react';

export const Indexed = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');

  const addRecord = () => {
    if (input) {
      const newRecord = { index: records.length * 10, value: input };
      setRecords([...records, newRecord]);
      setInput('');
    }
  };

  return (
    <div>
      <p className="mb-2">Indexed File Organization:</p>
      <input
        type="text"
        className="p-2 border rounded mr-2"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={addRecord} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      <div className="mt-4">
        {records.map((record, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold">Index {record.index}:</span> {record.value}
          </div>
        ))}
      </div>
    </div>
  );
};