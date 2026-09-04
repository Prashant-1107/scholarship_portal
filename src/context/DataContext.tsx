import React, { createContext, useContext, useState, useEffect } from 'react';
import { Scholarship, Application, Activity } from '../types';
import { mockScholarships } from '../data/mockData';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface DataContextType {
  scholarships: Scholarship[];
  savedScholarshipIds: string[];
  applications: Application[];
  activities: Activity[];
  toggleSaveScholarship: (id: string) => void;
  applyForScholarship: (id: string) => void;
  withdrawApplication: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  deleteActivity: (id: string) => void;
  addScholarship: (scholarship: Omit<Scholarship, 'id'>) => void;
  deleteScholarship: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Attempt to load from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch Scholarships
        const { data: schData, error: schError } = await supabase.from('scholarships').select('*');
        if (!schError && schData && schData.length > 0) {
          // Assuming schema matches our types exactly, otherwise we map it.
          // For now, if no error and has data, use it. Otherwise fallback to mock.
          setScholarships(schData);
        }

        // Fetch user specific data
        const { data: savedData } = await supabase.from('saved_scholarships').select('scholarship_id').eq('user_id', user.id);
        if (savedData) setSavedScholarshipIds(savedData.map(d => d.scholarship_id));

        let appQuery = supabase.from('applications').select('*');
        if (user.role !== 'admin') {
          appQuery = appQuery.eq('studentId', user.id);
        }
        const { data: appData } = await appQuery;
        if (appData) setApplications(appData);

        let actQuery = supabase.from('activities').select('*');
        if (user.role !== 'admin') {
          actQuery = actQuery.eq('studentId', user.id);
        }
        const { data: actData } = await actQuery;
        if (actData) setActivities(actData);
      } catch (err) {
        console.warn('Supabase tables might not exist yet, falling back to local storage.', err);
      }
    };
    
    fetchData();

    // Fallback Local Storage Loading
    if (user) {
      const saved = localStorage.getItem(`virtus_saved_${user.id}`);
      if (saved && savedScholarshipIds.length === 0) setSavedScholarshipIds(JSON.parse(saved));
      
      const apps = localStorage.getItem(`virtus_apps_${user.id}`);
      if (apps && applications.length === 0) setApplications(JSON.parse(apps));
      
      const acts = localStorage.getItem(`virtus_acts_${user.id}`);
      if (acts && activities.length === 0) setActivities(JSON.parse(acts));
    }
  }, [user]);

  // Save to local storage as fallback when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`virtus_saved_${user.id}`, JSON.stringify(savedScholarshipIds));
      localStorage.setItem(`virtus_apps_${user.id}`, JSON.stringify(applications));
      localStorage.setItem(`virtus_acts_${user.id}`, JSON.stringify(activities));
    }
  }, [savedScholarshipIds, applications, activities, user]);

  const toggleSaveScholarship = async (id: string) => {
    setSavedScholarshipIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
    if (user) {
      try {
        if (savedScholarshipIds.includes(id)) {
          await supabase.from('saved_scholarships').delete().match({ user_id: user.id, scholarship_id: id });
        } else {
          await supabase.from('saved_scholarships').insert({ user_id: user.id, scholarship_id: id });
        }
      } catch (e) {
        // ignore errors if tables don't exist
      }
    }
  };

  const applyForScholarship = async (id: string) => {
    if (!user) return;
    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      scholarshipId: id,
      studentId: user.id,
      dateApplied: new Date().toISOString(),
      status: 'Pending',
      adminRemarks: 'Awaiting initial review',
    };
    setApplications(prev => [...prev, newApp]);
    try {
      await supabase.from('applications').insert(newApp);
    } catch (e) {}
  };

  const withdrawApplication = async (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    try {
      await supabase.from('applications').delete().eq('id', id);
    } catch (e) {}
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    const newAct = { ...activity, id: Math.random().toString(36).substr(2, 9) };
    setActivities(prev => [...prev, newAct]);
    try {
      await supabase.from('activities').insert(newAct);
    } catch (e) {}
  };

  const deleteActivity = async (id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
    try {
      await supabase.from('activities').delete().eq('id', id);
    } catch (e) {}
  };

  const addScholarship = async (scholarship: Omit<Scholarship, 'id'>) => {
    const newSch = { ...scholarship, id: Math.random().toString(36).substr(2, 9) };
    setScholarships(prev => [...prev, newSch]);
    try {
      await supabase.from('scholarships').insert(newSch);
    } catch (e) {}
  };

  const deleteScholarship = async (id: string) => {
    setScholarships(prev => prev.filter(sch => sch.id !== id));
    try {
      await supabase.from('scholarships').delete().eq('id', id);
    } catch (e) {}
  };

  return (
    <DataContext.Provider value={{
      scholarships, savedScholarshipIds, applications, activities,
      toggleSaveScholarship, applyForScholarship, withdrawApplication,
      addActivity, deleteActivity, addScholarship, deleteScholarship
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
