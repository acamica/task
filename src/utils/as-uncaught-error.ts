import { Task, UncaughtError } from '../task';
export function asUncaughtError <T> (error: T): Task<never, UncaughtError> {
    return Task.reject(new UncaughtError(error));
}
