/// <reference types="node" resolution-mode="require"/>
import { Solution, Algorithm } from './types.js';
export declare function solveChallenge(challenge: string, salt: string, algorithm?: string, max?: number, start?: number): {
    promise: Promise<Solution | null>;
    controller: AbortController;
};
export declare function hashHex(algorithm: Algorithm, data: ArrayBuffer | string): string;
export declare function ab2hex(ab: ArrayBuffer | Uint8Array): string;
export declare function hash(algorithm: Algorithm, data: ArrayBuffer | string): Buffer;
