const login = async (email: string, password: string): Promise<boolean> => {
  try {
    // Проверяем, настроен ли Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      return false;
    }

    // Проверяем текущую сессию при загрузке
    const checkSession = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
          return;
        }
      } catch {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
          return;
        }
      }
    }
  } catch {
    return false;
  }
}