import { parentPort } from 'worker_threads';
import crypto from 'node:crypto';
parentPort?.on("message", async (message) => {
    const { type, payload } = message;
    if (type === 'abort') {
        //process.exit(1);
    }
    if (type === 'work') {
        const { alg, challenge, max, salt, start } = payload || {};
        const result = solveChallenge(challenge, salt, alg, max, start);
        const solution = await result.promise;
        parentPort?.postMessage(solution);
    }
});
const encoder = new TextEncoder();
export function solveChallenge(challenge, salt, algorithm = 'SHA-256', max = 1e6, start = 0) {
    const controller = new AbortController();
    const startTime = Date.now();
    const fn = async () => {
        for (let n = start; n <= max; n += 1) {
            if (controller.signal.aborted) {
                return null;
            }
            const t = hashHex(algorithm, salt + n);
            if (t === challenge) {
                return {
                    number: n,
                    took: Date.now() - startTime,
                };
            }
        }
        return null;
    };
    return {
        promise: fn(),
        controller,
    };
}
export function hashHex(algorithm, data) {
    return ab2hex(hash(algorithm, data));
}
export function ab2hex(ab) {
    return [...new Uint8Array(ab)]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');
}
export function hash(algorithm, data) {
    const input = typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data);
    return crypto.createHash(algorithm).update(input).digest();
}
//# sourceMappingURL=worker.js.map