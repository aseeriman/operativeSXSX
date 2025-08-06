'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ClientForm() {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [message, setMessage] = useState('');
  const [clients, setClients] = useState([]); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientId || !clientName) {
      setMessage('Please fill in both fields.');
      return;
    }

    const { error } = await supabase.from('clients').insert([
      {
        'client_id': clientId,
        name: clientName,
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Client added successfully!');
      setClientId('');
      setClientName('');
      await fetchClients(); 
    }
  };

  const fetchClients = async () => {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (!error) setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-blue-50 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Client Form
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="clientId" className="block text-blue-700 font-medium mb-1">
              Client ID
            </label>
            <input
              id="clientId"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter Client ID"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label htmlFor="clientName" className="block text-blue-700 font-medium mb-1">
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter Client Name"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Submit
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-blue-800 font-medium">{message}</p>
        )}

        {/* Optional: Live list of clients below form for debug/testing */}
        {/* <ul className="mt-6 text-sm text-gray-600">
          {clients.map((client) => (
            <li key={client.id}>
              {client['client_id']} - {client.name}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}
