export const VIDEOS_MOCK = [
    ...Array.from({ length: 962 }, (_, i) => ({
        id: i,
        title: `Video ${i}`,
        description: `Description for ${i}`,
        thumbnail: "https://cataas.com/cat?type=square",
        year: 2012 + ((i - 1) % 14), // cycles years 2012-2025
        type: i === 222 ? "playlist" : "video",
    })),
];
