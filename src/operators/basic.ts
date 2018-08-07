import { Task, UncaughtError } from '../task';

export type IMapFn <A, B> = (a: A) => B;
export type ITaskChainFn<A, B, E> = (value: A) => Task<B, E>;
export type IPipeFn<T1, T2, E1, E2> = (a: Task<T1, E1>) => Task<T2, E2>;

export function map<T1, T2> (fn: IMapFn<T1, T2>) {
    return function <E>  (input: Task<T1, E>): Task<T2, E | UncaughtError> {
        return new Task((outerResolve, outerReject) => {
            const foo = input.fork(
                outerReject,
                value => {
                    try {
                        const result = fn(value);
                        outerResolve(result);
                    } catch (error) {
                        outerReject(new UncaughtError(error));
                    }
                }
            );
            return () => {
                foo.cancel();
            }
        });
    };
}

export function chain<T1, T2, E2> (fn: ITaskChainFn<T1, T2, E2>) {
    return function <E1> (input: Task<T1, E1>): Task<T2, E1 | E2 | UncaughtError> {
        return new Task((outerResolve, outerReject) => {
            const foo = input.fork(
                outerReject,
                value => {
                    try {
                        fn(value).fork(outerReject, outerResolve);
                    }
                    catch (err) {
                        outerReject(new UncaughtError(err));
                    }
                }
            );
            return () => {
                foo.cancel();
            }
        });
    };
}

export function catchError<T2, E1, E2> (fn: ITaskChainFn<E1, T2, E2>) {
    return function <T1> (input: Task<T1, E1>): Task<T1 | T2, E2 | UncaughtError> {
        return new Task((outerResolve, outerReject) => {
            const foo = input.fork(
                err => {
                    try {
                        fn(err).fork(outerReject, outerResolve);
                    }
                    catch (err) {
                        outerReject(new UncaughtError(err));
                    }
                },
                outerResolve
            );
            return () => {
                foo.cancel();
            }
        });
    };
}

