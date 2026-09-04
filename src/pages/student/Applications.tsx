import React from 'react';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { Trash2, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

export default function Applications() {
  const { applications, scholarships, withdrawApplication } = useData();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Review': return 'bg-teal-100 text-blue-800 border-blue-200';
      case 'Approved': return 'bg-[#B4FF00]/30 text-green-900 border-[#B4FF00]';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Tracker</h1>
        <p className="text-gray-600 mt-1">Monitor the status of your submitted scholarship applications.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            You haven't applied to any scholarships yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9F2] text-gray-700 text-sm border-b border-gray-200">
                  <th className="p-4 font-semibold">Scholarship Name</th>
                  <th className="p-4 font-semibold">Provider</th>
                  <th className="p-4 font-semibold">Date Applied</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Admin Remarks</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map(app => {
                  const scholarship = scholarships.find(s => s.id === app.scholarshipId);
                  if (!scholarship) return null;

                  return (
                    <tr key={app.id} className="hover:bg-[#FFF9F2]/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{scholarship.title}</div>
                        <a href={scholarship.link} target="_blank" rel="noreferrer" className="text-xs text-[#0D9488] hover:underline flex items-center gap-1 mt-1">
                          View Details <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{scholarship.provider}</td>
                      <td className="p-4 text-sm text-gray-600">{format(new Date(app.dateApplied), 'MMM d, yyyy')}</td>
                      <td className="p-4">
                        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold border", getStatusColor(app.status))}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={app.adminRemarks}>
                        {app.adminRemarks}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to withdraw this application?')) {
                              withdrawApplication(app.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Withdraw Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
