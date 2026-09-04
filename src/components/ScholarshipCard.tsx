import React, { useState } from 'react';
import { Scholarship } from '../types';
import { Bookmark, FileText, ChevronDown, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import clsx from 'clsx';
import { useData } from '../context/DataContext';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  matchInsight?: { status: 'Eligible Now' | 'Potential Eligibility' | 'Not Eligible'; reasons: string[] };
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship, matchInsight }) => {
  const { savedScholarshipIds, toggleSaveScholarship, applyForScholarship, applications } = useData();
  const [expanded, setExpanded] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const isSaved = savedScholarshipIds.includes(scholarship.id);
  const hasApplied = applications.some(app => app.scholarshipId === scholarship.id);
  
  const daysLeft = differenceInDays(new Date(scholarship.deadline), new Date());
  
  const deadlineColor = daysLeft < 0 ? 'bg-gray-100 text-gray-700' 
    : daysLeft < 15 ? 'bg-red-100 text-red-700' 
    : daysLeft <= 30 ? 'bg-yellow-100 text-yellow-700' 
    : 'bg-green-100 text-green-700';

  const eligibilityBadgeColor = matchInsight?.status === 'Eligible Now' ? 'bg-[#B4FF00] text-gray-900' 
    : matchInsight?.status === 'Potential Eligibility' ? 'bg-yellow-200 text-yellow-900' 
    : 'bg-gray-200 text-gray-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{scholarship.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{scholarship.provider}</p>
          </div>
          <button 
            onClick={() => toggleSaveScholarship(scholarship.id)}
            className="p-2 -mr-2 text-gray-400 hover:text-[#0D9488] transition-colors focus:outline-none"
          >
            <Bookmark className={clsx("w-6 h-6 transition-transform active:scale-125", isSaved && "fill-[#0D9488] text-[#0D9488]")} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {scholarship.status !== 'Closed' && (
            <span className={clsx("px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1", deadlineColor)}>
              <Calendar className="w-3 h-3" />
              {daysLeft < 0 ? 'Expired' : `${daysLeft} Days Left`}
            </span>
          )}
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold">
            Deadline: {format(new Date(scholarship.deadline), 'MMM d, yyyy')}
          </span>
          {scholarship.status === 'Closed' && (
            <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold uppercase tracking-wider">
              Closed
            </span>
          )}
        </div>

        {matchInsight && (
          <div className="mt-5 bg-[#FFF9F2] rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className={clsx("px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider", eligibilityBadgeColor)}>
                {matchInsight.status}
              </span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              {matchInsight.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <div className="mt-0.5 min-w-1 min-h-1 rounded-full bg-gray-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          {scholarship.status === 'Ongoing' && matchInsight?.status === 'Eligible Now' && !hasApplied && (
            <button 
              onClick={() => applyForScholarship(scholarship.id)}
              className="flex-1 bg-[#0D9488] hover:bg-teal-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Apply Now
            </button>
          )}
          {hasApplied && (
            <button disabled className="flex-1 bg-green-50 text-green-700 text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Applied
            </button>
          )}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            Details <ChevronDown className={clsx("w-4 h-4 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Eligibility Highlights</h4>
              <p className="text-sm text-gray-600">
                Min GPA: {scholarship.eligibility.minGpa} | Max Income: ₹{scholarship.eligibility.maxIncome.toLocaleString('en-IN')} <br/>
                Applicable to: {scholarship.eligibility.majors.join(', ')} <br/>
                Region: {scholarship.eligibility.states.join(', ')}
              </p>
            </div>
            
            <div>
              <button 
                onClick={() => setShowDocs(!showDocs)}
                className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-900 mb-1"
              >
                Required Documents
                <ChevronDown className={clsx("w-4 h-4 text-gray-500 transition-transform", showDocs && "rotate-180")} />
              </button>
              {showDocs && (
                <ul className="text-sm text-gray-600 space-y-2 mt-2">
                  {scholarship.docsNeeded.map(doc => (
                    <li key={doc} className="flex items-center justify-between bg-[#FFF9F2] p-2 rounded border border-gray-100">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> {doc}</span>
                      {/* Document checklist interaction simulated here */}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <a 
              href={scholarship.link} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0D9488] hover:underline"
            >
              Official Provider Link <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScholarshipCard;
