import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Schedule, 
  Replacement, 
  FacultyPlanDay, 
  Subject, 
  Teacher
} from '../types';

interface DataContextType {
  schedules: Schedule[];
  replacements: Replacement[];
  facultyPlanDays: FacultyPlanDay[];
  subjects: Subject[];
  teachers: Teacher[];
  loading: boolean;
  
  // Methods for managing data
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [replacements, setReplacements] = useState<Replacement[]>([]);
  const [facultyPlanDays, setFacultyPlanDays] = useState<FacultyPlanDay[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*');
      
      if (error) {
        console.error('Error loading schedules:', error);
        return;
      }
      
      setSchedules(data || []);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setSchedules([]);
    }
  };

  const loadReplacements = async () => {
    try {
      const { data, error } = await supabase
        .from('replacements')
        .select('*');
      
      if (error) {
        console.error('Error loading replacements:', error);
        return;
      }
      
      setReplacements(data || []);
    } catch (error) {
      console.error('Failed to fetch replacements:', error);
      setReplacements([]);
    }
  };

  const loadFacultyPlanDays = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty_plan_days')
        .select('*');
      
      if (error) {
        console.error('Error loading faculty plan days:', error);
        return;
      }
      
      setFacultyPlanDays(data || []);
    } catch (error) {
      console.error('Failed to fetch faculty plan days:', error);
      setFacultyPlanDays([]);
    }
  };

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*');
      
      if (error) {
        console.error('Error loading subjects:', error);
        return;
      }
      
      setSubjects(data || []);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setSubjects([]);
    }
  };

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*');
      
      if (error) {
        console.error('Error loading teachers:', error);
        return;
      }
      
      setTeachers(data || []);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      setTeachers([]);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSchedules(),
        loadReplacements(),
        loadFacultyPlanDays(),
        loadSubjects(),
        loadTeachers()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{
      schedules,
      replacements,
      facultyPlanDays,
      subjects,
      teachers,
      loading,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}