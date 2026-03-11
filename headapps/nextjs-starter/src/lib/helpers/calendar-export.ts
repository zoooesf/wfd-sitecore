export type CalendarEventData = {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  eventTime?: string;
};

const DEFAULT_CALENDAR_FILENAME = 'event.ics';

/**
 * Formats a date to ICS format (YYYYMMDDTHHMMSSZ)
 * @param date - Date string or Date object
 * @param timeString - Optional time string to parse
 */
function formatICSDate(date: string | Date, timeString?: string): string {
  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (timeString) {
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const meridiem = timeMatch[3].toUpperCase();

      if (meridiem === 'PM' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'AM' && hours === 12) {
        hours = 0;
      }

      dateObj.setHours(hours, minutes, 0, 0);
    }
  }

  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function generateICS(eventData: CalendarEventData): string {
  const { title, description, location, startDate, endDate, eventTime } = eventData;
  const startDateFormatted = formatICSDate(startDate, eventTime);
  const endDateFormatted = endDate
    ? formatICSDate(endDate, eventTime)
    : formatICSDate(startDate, eventTime);

  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@event`;
  const now = new Date();
  const dtstamp = formatICSDate(now);

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${startDateFormatted}`,
    `DTEND:${endDateFormatted}`,
    `SUMMARY:${escapeICSText(title)}`,
  ];

  if (description) {
    icsLines.push(`DESCRIPTION:${escapeICSText(description)}`);
  }

  if (location) {
    icsLines.push(`LOCATION:${escapeICSText(location)}`);
  }

  icsLines.push('STATUS:CONFIRMED');
  icsLines.push('SEQUENCE:0');
  icsLines.push('END:VEVENT');
  icsLines.push('END:VCALENDAR');

  return icsLines.join('\r\n');
}

export function downloadICS(eventData: CalendarEventData, filename?: string): void {
  const icsContent = generateICS(eventData);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || DEFAULT_CALENDAR_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
