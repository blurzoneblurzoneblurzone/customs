@@ .. @@
   const loadSchedules = async () => {
     try {
       // Проверяем, настроен ли Supabase
-      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
-        // Supabase не настроен - не делаем запросы
+      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
         return;
       }

@@ .. @@
   const loadReplacements = async () => {
     try {
-      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
-        // Supabase не настроен - не делаем запросы
+      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
         return;
       }

@@ .. @@
   const loadFacultyPlanDays = async () => {
     try {
-      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
-        // Supabase не настроен - не делаем запросы
+      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
         return;
       }

@@ .. @@
   const loadSubjects = async () => {
     try {
-      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
-        // Supabase не настроен - не делаем запросы
+      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
         return;
       }

@@ .. @@
   const loadTeachers = async () => {
     try {
-      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
-        // Supabase не настроен - не делаем запросы
+      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
         return;
       }