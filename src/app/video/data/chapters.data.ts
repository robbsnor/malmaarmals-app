import type { Tables } from '../../shared/models/database.types';

export const WAITING_CATEGORY: Tables<'categories'> = {
    category_id: 'WAITING',
    id: '',
    image_url: '',
    title: 'Waiting',
};

export const INTRO_CATEGORY: Tables<'categories'> = {
    category_id: 'INTRO',
    id: '',
    image_url: '',
    title: 'Intro',
};

export const BABBELEN_CATEGORY: Tables<'categories'> = {
    category_id: 'BABBELEN',
    id: '',
    image_url: '',
    title: 'Babbelen',
};

// const WAITING_CHAPTER: Tables<'chapters'> = {
//     category_id: '',
//     end_s: 0,
//     id: '',
//     start_s: 0,
//     video_id: videoStore.videoId,
// };

// const INTRO_CHAPTER: Tables<'chapters'> = {
//     category_id: '',
//     end_s: 0,
//     id: '',
//     start_s: 0,
//     video_id: videoStore.videoId,
// };

// const BABBELEN_CHAPTER: Tables<'chapters'> = {
//     category_id: '',
//     end_s: 0,
//     id: '',
//     start_s: 30,
//     video_id: videoStore.videoId,
// };
