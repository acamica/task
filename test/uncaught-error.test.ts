// Weird but I have to import "nothing" from "jest" to have the global jest functions  (describe, etc.) available
import {} from 'jest';
import { UncaughtError } from '../src/task';

describe('UncaughtError', () => {
    // Maintains wrapped error's stack
    describe('.message', () => {
        it('should include the wrapped error\'s message', () => {
            const originalErrorMsg = 'Buuuu!';
            const wrappedError = new Error(originalErrorMsg);
            expect(new UncaughtError(wrappedError).message).toMatch(originalErrorMsg);
        });

        it('should prepend "UncaughtError:"', () => {
            const wrappedError = new Error('Buuuu!');
            expect(new UncaughtError(wrappedError).message).toMatch(/^UncaughtError\:/);
        });
    });

    describe('.stack', () => {
        it('should mantain wrapped error\'s stack', () => {
            // Throw an Error with an "interesting" stack
            const foo = () => bar();
            const bar = () => baz();
            const baz = () => {
                throw new Error('Buuuu!');
            };

            try {
                foo();
            }
            catch (wrappedError) {
                const uncaughtError = new UncaughtError(wrappedError);
                expect(uncaughtError.stack).toBe(wrappedError.stack);
            }
        });
    });
});
