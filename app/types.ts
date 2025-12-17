export interface User {
    id: number;
    username: string;
    email?: string;
    role: 'admin' | 'player';
    created_at?: string;
}

export interface Question {
    text: string;
    options: string[];
    answer: string;
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LeaderboardEntry {
    username: string;
    time_taken: number;
    score: number;
    created_at?: string;
}
