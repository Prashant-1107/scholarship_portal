import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Users, FileText, CheckCircle, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { Scholarship } from '../../types';

export default function AdminDashboard() {
  const { scholarships, applications, addScholarship, deleteScholarship } = useData();
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = [
    { label: 'Total Scholarships', value: scholarships.length, icon: FileText, color: 'bg-teal-100 text-teal-600' },
    { label: 'Active Applications', value: applications.length, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Pending Verifications', value: applications.filter(a => a.status === 'Pending').length, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Students', value: mockUsers.filter(u => u.role === 'student').length, icon: Users, color: 'bg-purple-100 text-purple-600' },
  ];

  // Simplified form state for demo
  const [newSch, setNewSch] = useState<Partial<Scholarship>>({
    title: '', provider: '', deadline: '', status: 'Upcoming', link: '',
    eligibility: { minGpa: 0, maxIncome: 0, states: ['All'], majors: ['All'] },
    docsNeeded: []
  });

  const availableDocs = [
    'Caste Certificate', 'Income Certificate', 'Fee Receipt', 'Previous Marksheet', 
    'Domicile Certificate', 'PRC', 'Bonafide Certificate', 'PPO/Service Certificate', 
    'Bank Passbook', 'Death Certificate', 'Orphan Certificate', 'Aptitude Test Scorecard'
  ];

  const handleDocToggle = (doc: string) => {
    const current = newSch.docsNeeded || [];
    if (current.includes(doc)) {
      setNewSch({ ...newSch, docsNeeded: current.filter(d => d !== doc) });
    } else {
      setNewSch({ ...newSch, docsNeeded: [...current, doc] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSch.title && newSch.provider && newSch.deadline) {
      addScholarship(newSch as Omit<Scholarship, 'id'>);
      setShowAddForm(false);
      // Reset form
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and scholarship management.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Scholarship Management</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-[#0D9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Scholarship
          </button>
        </div>

        {showAddForm && (
          <div className="p-6 bg-[#FFF9F2] border-b border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
              <h3 className="font-bold text-lg text-gray-900">New Scholarship Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newSch.title} onChange={e => setNewSch({...newSch, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newSch.provider} onChange={e => setNewSch({...newSch, provider: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input required type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newSch.deadline} onChange={e => setNewSch({...newSch, deadline: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newSch.status} onChange={e => setNewSch({...newSch, status: e.target.value as any})}>
                    <option>Ongoing</option>
                    <option>Upcoming</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 pt-4 border-t border-gray-200">Eligibility Rules</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min GPA</label>
                  <input type="number" step="0.1" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newSch.eligibility?.minGpa} onChange={e => setNewSch({...newSch, eligibility: {...newSch.eligibility!, minGpa: parseFloat(e.target.value)}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Income (₹)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newSch.eligibility?.maxIncome} onChange={e => setNewSch({...newSch, eligibility: {...newSch.eligibility!, maxIncome: parseInt(e.target.value)}})} />
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 pt-4 border-t border-gray-200">Document Configuration</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableDocs.map(doc => (
                  <label key={doc} className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 text-[#0D9488] focus:ring-[#0D9488] rounded"
                      checked={newSch.docsNeeded?.includes(doc)}
                      onChange={() => handleDocToggle(doc)}
                    />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-[#0D9488] text-white rounded-lg hover:bg-teal-700">Save Scholarship</button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9F2] text-gray-700 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Provider</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Deadline</th>
                <th className="p-4 font-semibold">Applications</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scholarships.map(sch => {
                const appCount = applications.filter(a => a.scholarshipId === sch.id).length;
                return (
                  <tr key={sch.id} className="hover:bg-[#FFF9F2]/50">
                    <td className="p-4 font-medium text-gray-900">{sch.title}</td>
                    <td className="p-4 text-sm text-gray-600">{sch.provider}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        sch.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                        sch.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {sch.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{sch.deadline}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{appCount}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#0D9488] transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => {
                        if(window.confirm('Delete this scholarship?')) deleteScholarship(sch.id);
                      }} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
