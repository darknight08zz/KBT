export interface User {
    id: number;
    username: string;
    email?: string;
    university?: string;
    role: 'admin' | 'player';
    is_blocked?: boolean;
    created_at?: string;
}

export interface Question {
    text: string;
    options: string[];
    answer: string;
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    type?: 'mcq' | 'multiselect' | 'short_answer' | 'long_answer';
    image_url?: string;
    keywords?: string[]; // For smart matching
}

export interface LeaderboardEntry {
    username: string;
    time_taken: number;
    score: number;
    created_at?: string;
}
