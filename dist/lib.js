import { Worker } from "worker_threads";
async function solveChallenge(challenge, salt, algorithm = 'SHA-256', max = 1e6, startNumber = 0, concurrency = 4) {
    const workers = [];
    for (let n = 0; n < concurrency; n++) {
        const url = new URL('./worker.js', import.meta.url);
        const worker = new Worker(url, { workerData: n });
        //worker.stdout.pipe(process.stdout);
        worker.on("error", console.error);
        workers.push(worker);
    }
    const step = Math.ceil(max / concurrency);
    const promises = workers.map((worker, i) => {
        const start = startNumber + i * step;
        return new Promise((resolve) => {
            worker.on("message", message => {
                if (!message) {
                    console.log("worker didnt find solution");
                    return;
                }
                for (const w of workers) {
                    w.postMessage({ type: 'abort' });
                }
                resolve(message);
            });
            worker.postMessage({
                payload: {
                    algorithm,
                    challenge,
                    max: start + step,
                    salt,
                    start,
                },
                type: 'work',
            });
        });
    });
    const expiration = salt.substring(salt.indexOf("?expires=") + "?expires=".length);
    const timeout = +expiration * 1000 - Date.now();
    const timeoutFn = new Promise((_, rejected) => setTimeout(() => rejected("timeout"), timeout));
    try {
        const solution = await Promise.race([...promises, timeoutFn]);
        return solution;
    }
    finally {
        for (const worker of workers) {
            worker.terminate();
        }
    }
}
export { solveChallenge };
//# sourceMappingURL=lib.js.map