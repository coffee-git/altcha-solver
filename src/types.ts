export type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

export interface Solution {
    number: number;
    took: number;
    worker?: boolean;
}