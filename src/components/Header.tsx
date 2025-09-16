import React from 'react';
import { GraduationCap, Settings, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentWeekType, getWeekNumber } from '../utils/dateUtils';

interface HeaderProps {
  onAdminClick?: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  const { isAdmin, logout } = useAuth();
  const currentWeekType = getCurrentWeekType();
  const weekNumber = getWeekNumber();

  return (
    <header className="bg-gradient-to-r from-slate-900 via-teal-800 to-slate-900 text-white shadow-lg" style={{background: 'linear-gradient(to right, #0f172a, #0e7a65, #0f172a)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-10 w-10 text-emerald-300" />
            <div>
              <h1 className="text-xl font-bold">Российская таможенная академия</h1>
              <p className="text-sm text-slate-300">Расписание занятий</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-emerald-300" />
                <span className="text-sm font-medium">
                  {weekNumber} неделя
                </span>
              </div>
              <div className="text-xs text-slate-300">
                {currentWeekType === 'even' ? 'Четная' : 'Нечетная'}
              </div>
            </div>

            <button
              onClick={onAdminClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-teal-700 transition-colors" style={{backgroundColor: '#0e7a65'}}
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Управление</span>
            </button>

            {isAdmin && (
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Выход</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}