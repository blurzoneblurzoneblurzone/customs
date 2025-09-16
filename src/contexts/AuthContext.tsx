@@ .. @@
   const login = async (email: string, password: string): Promise<boolean> => {
     try {
       // Проверяем, настроен ли Supabase
-      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
-        // Supabase не настроен - не делаем запросы
+      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
         return false;
       }

@@ .. @@
     // Проверяем текущую сессию при загрузке
     const checkSession = async () => {
       try {
-        if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
+        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+        if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
           return;
         }

@@ .. @@
     try {
-      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
+      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
         return;
       }