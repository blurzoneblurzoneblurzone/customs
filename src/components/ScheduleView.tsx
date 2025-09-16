@@ .. @@
         {loading && (
           <div className="text-center py-8">
            <div className="max-w-2xl mx-auto">
              {(() => {
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
                  return (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <div className="text-lg font-semibold text-amber-800 mb-4">
                        🔧 Требуется настройка Supabase
                      </div>
                      <div className="text-left text-amber-700 space-y-2">
                        <p className="font-medium">Для работы приложения выполните следующие шаги:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                          <li>Нажмите кнопку <strong>"Connect to Supabase"</strong> в правом верхнем углу</li>
                          <li>Создайте новый проект Supabase или подключите существующий</li>
                          <li>Настройте переменные окружения в файле .env</li>
                          <li>Перезапустите сервер разработки</li>
                        </ol>
                        <p className="text-sm mt-4 p-3 bg-amber-100 rounded">
                          📖 Подробная инструкция находится в файле <code>SUPABASE_SETUP_GUIDE.md</code>
                        </p>
                      </div>
                    </div>
                  )
                }
                return <div className="text-lg text-gray-600">Загрузка данных...</div>
              })()}
            </div>
          </div>
        )}