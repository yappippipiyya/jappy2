import { Band, Schedule } from "@/app/lib/types";

export interface RefinedScheduleItem {
  bandId: number;
  bandName: string;
  date: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  startDateTime: Date;
  endDateTime: Date;
}


export function getRefinedSchedules(bands: Band[], rawSchedules: Schedule[], feutureOnly: boolean): RefinedScheduleItem[] {
  const now = new Date();
  const currentYMD = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  return rawSchedules.flatMap((entry) => {
    const scheduleData = entry.schedule as Record<string, number[]>;
    const band = bands.find(b => b.id === entry.band_id);
    if (!band) return [];

    const refined: RefinedScheduleItem[] = [];

    Object.entries(scheduleData).forEach(([date, hours]) => {
      let startHour: number | null = null;

      hours.forEach((isBooked, hour) => {
        if (isBooked === 1 && startHour === null) {
          startHour = hour;
        } else if ((isBooked === 0 || hour === 23) && startHour !== null) {
          const endHour = isBooked === 1 ? hour + 1 : hour;

          const isFuture = date > currentYMD || (date === currentYMD && endHour > currentHour);

          if (!feutureOnly || isFuture) {
            refined.push({
              bandId: band.id,
              bandName: band.name || "",
              date,
              startTime: `${startHour.toString().padStart(2, '0')}:00`,
              endTime: `${endHour.toString().padStart(2, '0')}:00`,
              startDateTime: new Date(`${date}T${startHour.toString().padStart(2, '0')}:00:00`),
              endDateTime: new Date(`${date}T${endHour.toString().padStart(2, '0')}:00:00`),
            });
          }
          startHour = null;
        }
      });
    });
    return refined;
  }).sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());
}