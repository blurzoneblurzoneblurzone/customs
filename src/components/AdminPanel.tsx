import React, { useState } from 'react';
import { X, Calendar, Users, BookOpen, Settings, Edit2, Plus, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { supabase } from '../lib/supabase';
import { FACULTIES, COURSES, DEFAULT_TIME_SLOTS, DAYS_OF_WEEK } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Система управления расписанием</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'border-b-2' 
                : 'text-gray-500 hover:text-gray-700'
            }`} style={activeTab === 'schedule' ? {color: '#0e7a65', borderBottomColor: '#0e7a65'} : {}}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Расписание
          </button>
          <button
            onClick={() => setActiveTab('replacements')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'replacements'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`} style={activeTab === 'replacements' ? {color: '#0e7a65', borderBottomColor: '#0e7a65'} : {}}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Замены занятий
          </button>
          <button
            onClick={() => setActiveTab('faculty-plan')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'faculty-plan'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`} style={activeTab === 'faculty-plan' ? {color: '#0e7a65', borderBottomColor: '#0e7a65'} : {}}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Учебный план
          </button>
          <button
            onClick={() => setActiveTab('course-settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'course-settings'
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`} style={activeTab === 'course-settings' ? {color: '#0e7a65', borderBottomColor: '#0e7a65'} : {}}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Конфигурация
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'schedule' && <ScheduleManagement />}
          {activeTab === 'replacements' && <ReplacementManagement />}
          {activeTab === 'faculty-plan' && <FacultyPlanManagement />}
          {activeTab === 'course-settings' && <CourseManagement />}
        </div>
      </div>
    </div>
  );
}

// Управление расписанием
function ScheduleManagement() {
  const { schedules, refreshData } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: '1',
    course: 1,
    stream: 1,
    group: 1,
    dayOfWeek: 0,
    weekType: 'odd' as 'odd' | 'even',
    timeSlot: 1,
    subjectName: '',
    subjectType: 'lecture' as 'lecture' | 'practical',
    teacherName: '',
    classroom: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Создаем или находим предмет
      let subjectId = '';
      const { data: existingSubject } = await supabase
        .from('subjects')
        .select('id')
        .eq('name', formData.subjectName)
        .maybeSingle();

      if (existingSubject) {
        subjectId = existingSubject.id;
      } else {
        const { data: newSubject } = await supabase
          .from('subjects')
          .insert({
            id: `subject-${Date.now()}`,
            name: formData.subjectName,
            type: formData.subjectType
          })
          .select('id')
          .single();
        
        if (newSubject) {
          subjectId = newSubject.id;
        }
      }

      // Создаем или находим преподавателя
      let teacherId = '';
      const { data: existingTeacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('name', formData.teacherName)
        .maybeSingle();

      if (existingTeacher) {
        teacherId = existingTeacher.id;
      } else {
        const { data: newTeacher } = await supabase
          .from('teachers')
          .insert({
            id: `teacher-${Date.now()}`,
            name: formData.teacherName
          })
          .select('id')
          .single();
        
        if (newTeacher) {
          teacherId = newTeacher.id;
        }
      }

      // Создаем расписание
      const groupId = `${formData.facultyId}-${formData.course}-${formData.stream}-${formData.group}`;
      
      await supabase
        .from('schedules')
        .insert({
          id: `schedule-${Date.now()}`,
          group_id: groupId,
          day_of_week: formData.dayOfWeek,
          week_type: formData.weekType,
          time_slot_id: `slot-${formData.timeSlot}`,
          subject_id: subjectId,
          teacher_id: teacherId,
          classroom: formData.classroom
        });

      await refreshData();
      setShowAddForm(false);
      setFormData({
        facultyId: '1',
        course: 1,
        stream: 1,
        group: 1,
        dayOfWeek: 0,
        weekType: 'odd',
        timeSlot: 1,
        subjectName: '',
        subjectType: 'lecture',
        teacherName: '',
        classroom: ''
      });
    } catch (error) {
      console.error('Ошибка при добавлении расписания:', error);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    try {
      await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId);
      
      await refreshData();
    } catch (error) {
      console.error('Ошибка при удалении расписания:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Редактирование расписания занятий</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors" style={{backgroundColor: '#0e7a65'}}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить занятие
        </button>
      </div>

      {/* Список расписания */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Группа</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">День</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Время</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дисциплина</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Преподаватель</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Аудитория</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип недели</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.groupid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{DAYS_OF_WEEK[schedule.dayofweek] || schedule.dayofweek}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.timeslotid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.subjectid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.teacherid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.classroom}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {schedule.weektype === 'even' ? 'Четная' : 'Нечетная'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Форма добавления */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Добавление учебного занятия</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Факультет</label>
                  <select
                    value={formData.facultyId}
                    onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{'--tw-ring-color': '#0e7a65'} as any}
                  >
                    {FACULTIES.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>{faculty.shortName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Курс</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5].map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Поток</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({...formData, stream: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3].map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Группа</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({...formData, group: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">День недели</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({...formData, dayOfWeek: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DAYS_OF_WEEK.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип недели</label>
                  <select
                    value={formData.weekType}
                    onChange={(e) => setFormData({...formData, weekType: e.target.value as 'odd' | 'even'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="odd">Нечетная</option>
                    <option value="even">Четная</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пара</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({...formData, timeSlot: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DEFAULT_TIME_SLOTS.map(slot => (
                      <option key={slot.number} value={slot.number}>
                        {slot.number} пара ({slot.startTime}-{slot.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип занятия</label>
                  <select
                    value={formData.subjectType}
                    onChange={(e) => setFormData({...formData, subjectType: e.target.value as 'lecture' | 'practical'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lecture">Лекция</option>
                    <option value="practical">Практическое</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование дисциплины</label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите наименование дисциплины"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Преподаватель</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите ФИО преподавателя"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Аудитория</label>
                <input
                  type="text"
                  value={formData.classroom}
                  onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите номер аудитории"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors" style={{backgroundColor: '#0e7a65'}}
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Управление заменами
function ReplacementManagement() {
  const { replacements, refreshData } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: '1',
    course: 1,
    stream: 1,
    group: 1,
    date: '',
    timeSlot: 1,
    subjectName: '',
    subjectType: 'lecture' as 'lecture' | 'practical',
    teacherName: '',
    classroom: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Создаем или находим предмет
      let subjectId = '';
      const { data: existingSubject } = await supabase
        .from('subjects')
        .select('id')
        .eq('name', formData.subjectName)
        .maybeSingle();

      if (existingSubject) {
        subjectId = existingSubject.id;
      } else {
        const { data: newSubject } = await supabase
          .from('subjects')
          .insert({
            id: `subject-${Date.now()}`,
            name: formData.subjectName,
            type: formData.subjectType
          })
          .select('id')
          .single();
        
        if (newSubject) {
          subjectId = newSubject.id;
        }
      }

      // Создаем или находим преподавателя
      let teacherId = '';
      const { data: existingTeacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('name', formData.teacherName)
        .maybeSingle();

      if (existingTeacher) {
        teacherId = existingTeacher.id;
      } else {
        const { data: newTeacher } = await supabase
          .from('teachers')
          .insert({
            id: `teacher-${Date.now()}`,
            name: formData.teacherName
          })
          .select('id')
          .single();
        
        if (newTeacher) {
          teacherId = newTeacher.id;
        }
      }

      // Создаем замену
      const groupId = `${formData.facultyId}-${formData.course}-${formData.stream}-${formData.group}`;
      
      await supabase
        .from('replacements')
        .insert({
          id: `replacement-${Date.now()}`,
          group_id: groupId,
          date: formData.date,
          time_slot_id: `slot-${formData.timeSlot}`,
          subject_id: subjectId,
          teacher_id: teacherId,
          classroom: formData.classroom,
          reason: formData.reason
        });

      await refreshData();
      setShowAddForm(false);
      setFormData({
        facultyId: '1',
        course: 1,
        stream: 1,
        group: 1,
        date: '',
        timeSlot: 1,
        subjectName: '',
        subjectType: 'lecture',
        teacherName: '',
        classroom: '',
        reason: ''
      });
    } catch (error) {
      console.error('Ошибка при добавлении замены:', error);
    }
  };

  const handleDelete = async (replacementId: string) => {
    try {
      await supabase
        .from('replacements')
        .delete()
        .eq('id', replacementId);
      
      await refreshData();
    } catch (error) {
      console.error('Ошибка при удалении замены:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Управление заменами занятий</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить замену
        </button>
      </div>

      {/* Список замен */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Группа</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Время</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дисциплина</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Преподаватель</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Аудитория</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Основание</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {replacements.map((replacement) => (
                <tr key={replacement.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.groupid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.timeslotid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.subjectid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.teacherid}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.classroom}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{replacement.reason}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(replacement.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Форма добавления замены */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Регистрация замены занятия</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Факультет</label>
                  <select
                    value={formData.facultyId}
                    onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FACULTIES.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>{faculty.shortName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Курс</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5].map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Поток</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({...formData, stream: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3].map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Группа</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({...formData, group: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пара</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({...formData, timeSlot: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DEFAULT_TIME_SLOTS.map(slot => (
                      <option key={slot.number} value={slot.number}>
                        {slot.number} пара ({slot.startTime}-{slot.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип занятия</label>
                  <select
                    value={formData.subjectType}
                    onChange={(e) => setFormData({...formData, subjectType: e.target.value as 'lecture' | 'practical'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lecture">Лекция</option>
                    <option value="practical">Практическое</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование дисциплины</label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите наименование дисциплины"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Преподаватель</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите ФИО преподавателя"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Аудитория</label>
                <input
                  type="text"
                  value={formData.classroom}
                  onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите номер аудитории"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Основание для замены</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Укажите основание для замены"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Управление планом факультета
function FacultyPlanManagement() {
  const { facultyPlanDays, refreshData } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: '1',
    date: '',
    description: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await supabase
        .from('faculty_plan_days')
        .insert({
          id: `plan-${Date.now()}`,
          faculty_id: formData.facultyId,
          date: formData.date,
          description: formData.description,
          details: formData.details
        });

      await refreshData();
      setShowAddForm(false);
      setFormData({
        facultyId: '1',
        date: '',
        description: '',
        details: ''
      });
    } catch (error) {
      console.error('Ошибка при добавлении дня по плану:', error);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      await supabase
        .from('faculty_plan_days')
        .delete()
        .eq('id', planId);
      
      await refreshData();
    } catch (error) {
      console.error('Ошибка при удалении дня по плану:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Календарный учебный план</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить день
        </button>
      </div>

      {/* Список дней по плану */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Факультет</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Мероприятие</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Примечание</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {facultyPlanDays.map((plan) => {
                const faculty = FACULTIES.find(f => f.id === plan.faculty_id);
                return (
                  <tr key={plan.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{faculty?.shortName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{plan.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{plan.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{plan.details}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Форма добавления дня по плану */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Добавление планового мероприятия</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Факультет</label>
                <select
                  value={formData.facultyId}
                  onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {FACULTIES.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Наименование мероприятия</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: Учебные сборы, День открытых дверей"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дополнительная информация</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Место проведения, время, особые указания"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Управление настройками курсов
function CourseManagement() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('courseSettings');
    return saved ? JSON.parse(saved) : COURSES;
  });
  
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const saveCourses = (newCourses: any[]) => {
    setCourses(newCourses);
    localStorage.setItem('courseSettings', JSON.stringify(newCourses));
  };

  const handleEdit = (course: any) => {
    setEditingCourse({...course});
    setShowEditForm(true);
  };

  const handleSave = () => {
    const updatedCourses = courses.map((c: any) => 
      c.id === editingCourse.id ? editingCourse : c
    );
    saveCourses(updatedCourses);
    setShowEditForm(false);
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Конфигурация учебных курсов
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left">Факультет</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Курс</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Потоков</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Групп в потоке</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course: any) => {
                const faculty = FACULTIES.find(f => f.id === course.facultyId);
                return (
                  <tr key={course.id}>
                    <td className="border border-gray-200 px-4 py-2">{faculty?.shortName}</td>
                    <td className="border border-gray-200 px-4 py-2">{course.number}</td>
                    <td className="border border-gray-200 px-4 py-2">{course.streamsCount}</td>
                    <td className="border border-gray-200 px-4 py-2">{course.groupsPerStream}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Редактирование параметров курса
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Факультет: {FACULTIES.find(f => f.id === editingCourse.facultyId)?.name}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Курс: {editingCourse.number}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество потоков
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editingCourse.streamsCount}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse, 
                    streamsCount: Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество групп в потоке
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editingCourse.groupsPerStream}
                  onChange={(e) => setEditingCourse({
                    ...editingCourse, 
                    groupsPerStream: Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingCourse(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}