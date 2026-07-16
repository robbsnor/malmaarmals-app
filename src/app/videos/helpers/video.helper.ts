import type { Chapter } from '../models/chapter.model';

export class VideoHelper {
    static getUniqueCategories(chapters: Chapter[]) {
        const cats = chapters.map((chapter) => chapter.category.title);
        const uniqueCats = Array.from(new Set(cats));
        return uniqueCats;
    }
}
