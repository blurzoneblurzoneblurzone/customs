# Система расписания РТА

## Конфигурация текущей недели

Для настройки текущей недели отредактируйте файл `src/config/weekConfig.ts`:

```typescript
export const WEEK_CONFIG = {
  // Номер текущей недели (1-17)
  currentWeekNumber: 1,
  
  // Автоматическое определение недели (true) или использование фиксированного номера (false)
  useAutoDetection: false
};
```

### Параметры:

- **currentWeekNumber** - номер текущей недели (от 1 до 17)
- **useAutoDetection** - режим определения недели:
  - `false` - использовать фиксированный номер из `currentWeekNumber`
  - `true` - автоматически определять неделю по текущей дате

### Примеры использования:

**Установить 5-ю неделю:**
```typescript
currentWeekNumber: 5,
useAutoDetection: false
```

**Включить автоматическое определение:**
```typescript
useAutoDetection: true
```

## Вход в систему управления

Для доступа к системе управления расписанием используйте:
- **Email:** admin@goth.su
- **Пароль:** admin123
