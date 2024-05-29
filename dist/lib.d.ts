import { Solution } from "./types.js";
declare function solveChallenge(challenge: string, salt: string, algorithm?: string, max?: number, startNumber?: number, concurrency?: number): Promise<Solution | null>;
export { solveChallenge };
