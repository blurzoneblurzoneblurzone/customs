const loadSchedules = async () => {
    try {
      // Проверяем, настроен ли Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return;
      }

      const { data, error } = await supabase
        .from('schedules')
        .select('*');

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const loadReplacements = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return;
      }

      const { data, error } = await supabase
        .from('replacements')
        .select('*');

      if (error) throw error;
      setReplacements(data || []);
    } catch (error) {
      console.error('Error loading replacements:', error);
    }
  };

  const loadFacultyPlanDays = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return;
      }

      const { data, error } = await supabase
        .from('faculty_plan_days')
        .select('*');

      if (error) throw error;
      setFacultyPlanDays(data || []);
    } catch (error) {
      console.error('Error loading faculty plan days:', error);
    }
  };

  const loadSubjects = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return;
      }

      const { data, error } = await supabase
        .from('subjects')
        .select('*');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadTeachers = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return;
      }

      const { data, error } = await supabase
        .from('teachers')
        .select('*');

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  };