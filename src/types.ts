export enum ReadingLevel {
  LEVEL1 = 'Level 1 (입문)',
  LEVEL2 = 'Level 2 (중급)',
  LEVEL3 = 'Level 3 (심화)',
}

export interface UserProfile {
  name: string;
  categories: string[];
  level: ReadingLevel;
  preferredStyle: string;
  weeklyHours: number;
  completedBooks: string[];
  wishlist: Book[]; // We'll use this as the primary storage for saved books
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  level: ReadingLevel;
  description: string;
  priceInfo: {
    kyobo?: string;
    yes24?: string;
    aladin?: string;
  };
  emoji: string;
  status: 'wish' | 'reading' | 'done';
}

export const CATEGORIES = [
  '인문', '자기계발', '경제/경영', '소설', '과학', '예술', '사회학'
];

export const THEME = {
  bg: 'bg-[#F5F2ED]',
  card: 'bg-[#FFFDFB]',
  accent: 'text-[#8B5E3C]',
  border: 'border-[#E6D5C3]',
  button: 'bg-[#8B5E3C] hover:bg-[#724D31] text-white',
  textSecondary: 'text-[#6D6D6D]',
};
