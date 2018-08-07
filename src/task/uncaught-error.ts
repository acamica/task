// TODO: Improve stacks https://github.com/acamica/task/issues/7
export class UncaughtError extends Error {
    type: 'UncaughtError' = 'UncaughtError';

    constructor (private error: any) {
        super('UncaughtError: ' + error.toString());
    }
}
