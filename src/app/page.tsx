"use client";

import useSWR from 'swr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Home() {
  const { data, error } = useSWR('https://api.huangting.ai/v1/stats', fetcher, { refreshInterval: 5000 });

  const chartData = data ? Object.entries(data.tokens_saved_by_task).map(([name, value]) => ({ name, 'Tokens Saved': value })) : [];
  const pieData = data ? Object.entries(data.tokens_saved_by_task).map(([name, value]) => ({ name, value })) : [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-900 text-white">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400">Huangting-Flux Network</h1>
          <p className="text-xl mt-2 text-gray-300">Real-time Global Agent Performance</p>
        </header>

        {error && <div className="text-red-500">Failed to load data. Is the hub running?</div>}
        {!data && !error && <div>Loading...</div>}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-semibold text-gray-400">Total Tokens Saved</h3>
              <p className="text-4xl font-bold text-green-400 mt-2">{data.total_tokens_saved.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-semibold text-gray-400">Unique Agents</h3>
              <p className="text-4xl font-bold text-blue-400 mt-2">{data.unique_agents.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-semibold text-gray-400">Total Reports</h3>
              <p className="text-4xl font-bold text-purple-400 mt-2">{data.total_reports.toLocaleString()}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">Tokens Saved by Task Type</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="Tokens Saved" fill="#48BB78" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">Task Type Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
