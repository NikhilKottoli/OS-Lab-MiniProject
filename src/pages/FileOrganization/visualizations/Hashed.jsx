import React, { useState } from 'react';

export const Hashed = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');

  const hashFunc = (value) => value.charCodeAt(0) % 10;

  const addRecord = () => {
    if (input) {
      const hash = hashFunc(input);
      setRecords([...records, { hash, value: input }]);
      setInput('');
    }
  };

  return (
    <div>
      <p className="mb-2">Hashed File Organization (Hash = first letter charCode % 10):</p>
      <input
        type="text"
        className="p-2 border rounded mr-2"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={addRecord} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      <div className="mt-4 grid grid-cols-5 gap-4">
        {records.map((record, i) => (
          <div key={i} className="p-3 bg-green-300 rounded shadow">
            <strong>Hash {record.hash}:</strong>
            <p>{record.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
