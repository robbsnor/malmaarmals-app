export class DateHelper {
    public static getDayOfYear(date: Date): number {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = date.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    }
}
