import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ScholarshipCard from '../../components/ScholarshipCard';
import { Sparkles, Info } from 'lucide-react';
import clsx from 'clsx';
import { Scholarship } from '../../types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { scholarships } = useData();
  const [activeTab, setActiveTab] = useState<'Ongoing' | 'Upcoming' | 'Closed'>('Ongoing');

  // AI Counselor Matching Algorithm
  const matchScholarship = (sch: Scholarship) => {
    if (!user) return { status: 'Not Eligible', reasons: ['Log in to see eligibility'] };
    
    const reasons: string[] = [];
    let isEligible = true;
    let isPotential = false;

    // Check GPA
    if (user.gpa !== undefined) {
      if (user.gpa >= sch.eligibility.minGpa) {
        reasons.push(`GPA (${user.gpa}) meets requirement (${sch.eligibility.minGpa})`);
      } else if (sch.eligibility.minGpa - user.gpa <= 0.3) {
        reasons.push(`GPA is slightly below requirement (Improve by ${(sch.eligibility.minGpa - user.gpa).toFixed(1)} to qualify)`);
        isEligible = false;
        isPotential = true;
      } else {
        reasons.push(`GPA (${user.gpa}) is below requirement (${sch.eligibility.minGpa})`);
        isEligible = false;
      }
    }

    // Check Income
    if (user.familyIncome !== undefined) {
      if (user.familyIncome <= sch.eligibility.maxIncome) {
        reasons.push('Income is within limits');
      } else if (user.familyIncome - sch.eligibility.maxIncome <= 50000) {
        reasons.push('Income is marginally above the cap');
        isEligible = false;
        isPotential = true;
      } else {
        reasons.push('Income exceeds the maximum limit');
        isEligible = false;
      }
    }

    // Check State
    if (!sch.eligibility.states.includes('All') && user.state) {
      if (sch.eligibility.states.includes(user.state)) {
        reasons.push(`Domicile state (${user.state}) matches`);
      } else {
        reasons.push(`Not applicable for your state (${user.state})`);
        isEligible = false;
      }
    }

    // Check Major
    if (!sch.eligibility.majors.includes('All') && user.major) {
      // Simple string matching for demo
      const majorMatch = sch.eligibility.majors.some(m => user.major?.includes(m) || m.includes(user.major || ''));
      if (majorMatch) {
        reasons.push('Course/Major is eligible');
      } else {
        reasons.push('Course/Major does not match requirements');
        isEligible = false;
      }
    }

    // Check Category
    if (sch.eligibility.categories && user.category) {
      if (sch.eligibility.categories.includes(user.category)) {
        reasons.push(`Category (${user.category}) matches`);
      } else {
        reasons.push(`Category requirement not met`);
        isEligible = false;
      }
    }

    // CAPF
    if (sch.eligibility.requiresCAPF && !user.isCAPFWard) {
       reasons.push('Requires CAPF/Assam Rifles ward status');
       isEligible = false;
    }

    let status: 'Eligible Now' | 'Potential Eligibility' | 'Not Eligible' = 'Not Eligible';
    if (isEligible) status = 'Eligible Now';
    else if (isPotential) status = 'Potential Eligibility';

    return { status, reasons };
  };

  const processedScholarships = useMemo(() => {
    return scholarships.map(sch => ({
      ...sch,
      match: matchScholarship(sch)
    }));
  }, [scholarships, user]);

  const counts = {
    'Ongoing': processedScholarships.filter(s => s.status === 'Ongoing').length,
    'Upcoming': processedScholarships.filter(s => s.status === 'Upcoming').length,
    'Closed': processedScholarships.filter(s => s.status === 'Closed').length,
  };

  const eligibleCount = processedScholarships.filter(s => s.status === 'Ongoing' && s.match.status === 'Eligible Now').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarship Discovery</h1>
          <p className="text-gray-600">Find and apply for opportunities tailored to your profile.</p>
        </div>
      </div>

      {/* AI Counselor Summary */}
      <div className="bg-[#0D9488] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24" />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="bg-[#B4FF00] p-3 rounded-xl text-gray-900">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">AI Counselor Insights</h2>
            <p className="text-teal-100 leading-relaxed max-w-3xl">
              Based on your profile from <strong className="text-white">{user?.state || 'Unknown'}</strong> with a GPA of <strong className="text-white">{user?.gpa || 0}</strong> and family income of <strong className="text-white">₹{user?.familyIncome?.toLocaleString('en-IN') || 0}</strong>, you are currently eligible for <strong className="text-[#B4FF00] text-lg">{eligibleCount} ongoing scholarships</strong>.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg text-sm">
                <Info className="w-4 h-4" /> Focus on completing document checklists for your eligible matches first.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {(['Ongoing', 'Upcoming', 'Closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "flex-1 py-4 text-sm font-semibold transition-colors relative",
                activeTab === tab ? "text-[#0D9488]" : "text-gray-500 hover:text-gray-700 hover:bg-[#FFF9F2]"
              )}
            >
              {tab} ({counts[tab]})
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D9488]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 bg-[#FFF9F2]/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processedScholarships
              .filter(s => s.status === activeTab)
              .sort((a, b) => {
                // Sort by eligibility first, then deadline
                const rank = { 'Eligible Now': 0, 'Potential Eligibility': 1, 'Not Eligible': 2 };
                if (rank[a.match.status] !== rank[b.match.status]) return rank[a.match.status] - rank[b.match.status];
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
              })
              .map(scholarship => (
                <ScholarshipCard 
                  key={scholarship.id} 
                  scholarship={scholarship} 
                  matchInsight={scholarship.match} 
                />
              ))}
            {counts[activeTab] === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No {activeTab.toLowerCase()} scholarships found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
