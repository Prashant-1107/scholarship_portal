import React from 'react';
import { useData } from '../../context/DataContext';
import ScholarshipCard from '../../components/ScholarshipCard';
import { BookmarkMinus } from 'lucide-react';

export default function MyScholarships() {
  const { scholarships, savedScholarshipIds } = useData();

  const savedScholarships = scholarships.filter(s => savedScholarshipIds.includes(s.id));
  const closingSoonCount = savedScholarships.filter(s => {
    const daysLeft = (new Date(s.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return daysLeft > 0 && daysLeft <= 15;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Scholarships</h1>
          <p className="text-gray-600 mt-1">
            You have saved <strong className="text-gray-900">{savedScholarships.length}</strong> scholarships. 
            {closingSoonCount > 0 && (
              <span className="text-red-600 font-medium ml-1">
                {closingSoonCount} {closingSoonCount === 1 ? 'is' : 'are'} closing soon.
              </span>
            )}
          </p>
        </div>
      </div>

      {savedScholarships.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex flex-col items-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
            <BookmarkMinus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No saved scholarships yet</h3>
          <p className="text-gray-500 max-w-sm">
            Browse the discovery page and click the bookmark icon to save scholarships you're interested in applying for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedScholarships.map(scholarship => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      )}
    </div>
  );
}
