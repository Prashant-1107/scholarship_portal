import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MapPin, Mail, Phone, Edit, Plus, Trash2, Upload, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Activity } from '../../types';

export default function Profile() {
  const { user } = useAuth();
  const { activities, addActivity, deleteActivity } = useData();
  const [showAddActivity, setShowAddActivity] = useState(false);
  
  // Activity Form State
  const [newAct, setNewAct] = useState<Partial<Activity>>({
    title: '', organization: '', startDate: '', endDate: '', description: '', type: 'Volunteer Work'
  });
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  if (!user) return null;

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAct.title && newAct.organization) {
      addActivity(newAct as Omit<Activity, 'id'>);
      setShowAddActivity(false);
      setNewAct({ title: '', organization: '', startDate: '', endDate: '', description: '', type: 'Volunteer Work' });
      setUploaded(false);
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-100 relative border-b border-gray-100">
          <button className="absolute top-4 right-4 bg-white/50 hover:bg-white text-gray-700 p-2 rounded-full transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-4">
            <div className="w-32 h-32 bg-[#0D9488] rounded-full border-4 border-white shadow-sm flex items-center justify-center text-4xl font-bold text-white">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600 font-medium text-lg mt-1">B.Tech {user.major} | Class of {user.expectedGraduationYear || 2027}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {user.state || 'India'}
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {user.email}
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> +91 98765 43210
            </div>
          </div>
        </div>
      </div>

      {/* Academic Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Academic & Demographic Details</h2>
          <button className="text-[#0D9488] hover:bg-blue-50 p-2 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Course/Major</p>
            <p className="font-medium text-gray-900">{user.major}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Academic Percentage/GPA</p>
            <p className="font-medium text-gray-900">{user.gpa} / 4.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <p className="font-medium text-gray-900">{user.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Family Income (Annual)</p>
            <p className="font-medium text-gray-900">₹{user.familyIncome?.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Domicile State</p>
            <p className="font-medium text-gray-900">{user.state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">CAPF Ward Status</p>
            <p className="font-medium text-gray-900">{user.isCAPFWard ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Extracurriculars */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Extracurricular Activities</h2>
          <button 
            onClick={() => setShowAddActivity(!showAddActivity)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#0D9488] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {showAddActivity && (
          <form onSubmit={handleAddActivity} className="mb-8 bg-[#FFF9F2] p-6 rounded-xl border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0D9488] focus:border-[#0D9488]" value={newAct.title} onChange={e => setNewAct({...newAct, title: e.target.value})} placeholder="e.g. Debate Champion" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0D9488] focus:border-[#0D9488]" value={newAct.organization} onChange={e => setNewAct({...newAct, organization: e.target.value})} placeholder="e.g. National Youth Festival" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0D9488] focus:border-[#0D9488]" value={newAct.startDate} onChange={e => setNewAct({...newAct, startDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0D9488] focus:border-[#0D9488]" value={newAct.type} onChange={e => setNewAct({...newAct, type: e.target.value})}>
                  <option>Volunteer Work</option>
                  <option>Competition</option>
                  <option>Certification</option>
                  <option>Sports</option>
                  <option>Leadership</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0D9488] focus:border-[#0D9488]" value={newAct.description} onChange={e => setNewAct({...newAct, description: e.target.value})}></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={simulateUpload}
                  disabled={uploading || uploaded}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FFF9F2] disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Select File'}
                </button>
                {uploaded && <span className="flex items-center gap-1.5 text-sm font-medium text-green-600"><CheckCircle2 className="w-4 h-4" /> certificate.pdf</span>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowAddActivity(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium bg-[#0D9488] text-white rounded-lg hover:bg-teal-700">Save Activity</button>
            </div>
          </form>
        )}

        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activities added yet. Add your extracurriculars to boost your profile!</p>
        ) : (
          <div className="space-y-6">
            {activities.map(act => (
              <div key={act.id} className="flex gap-4 group">
                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-[#B4FF00] shadow-[0_0_8px_rgba(180,255,0,0.8)]" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{act.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">{act.organization}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {act.startDate ? format(new Date(act.startDate), 'MMM yyyy') : 'Past'} • {act.type}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="text-gray-400 hover:text-[#0D9488] p-1"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteActivity(act.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {act.description && <p className="text-sm text-gray-600 mt-2">{act.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Skills Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Interests</h2>
        <div className="flex flex-wrap gap-2">
          {['Python', 'Public Speaking', 'Leadership', 'Data Analysis', 'Web Development'].map(skill => (
            <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {skill}
            </span>
          ))}
          <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 text-sm font-medium rounded-full hover:bg-[#FFF9F2] flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Skill
          </button>
        </div>
      </div>
    </div>
  );
}
