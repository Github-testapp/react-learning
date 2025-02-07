export class ContentLoader {
    constructor() {
        this.cache = new Map();
    }

    async getChapter(chapterId) {
        const cacheKey = `chapter-${chapterId}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const chapter = await import(`../data/lessons/chapter${chapterId}.js`);
            this.cache.set(cacheKey, chapter);
            return chapter;
        } catch (error) {
            console.error(`Error loading chapter ${chapterId}:`, error);
            return null;
        }
    }

    async searchContent(query) {
        const results = [];
        for (const chapterId of [1, 2]) {
            const chapter = await this.getChapter(chapterId);
            if (!chapter) continue;

            const matches = chapter.lessons.filter(lesson =>
                lesson.title.toLowerCase().includes(query.toLowerCase()) ||
                lesson.content.toLowerCase().includes(query.toLowerCase())
            );

            results.push(...matches.map(match => ({
                ...match,
                chapterId
            })));
        }
        return results;
    }
}