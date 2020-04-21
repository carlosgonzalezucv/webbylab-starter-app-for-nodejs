import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/users-delete/positive`,
    'admin/users-delete/positive',
    async ({ config: { serviceClass, before }, expected, checkSideEffects }) => {
        const { userId } = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { id: userId }, expected });

        await checkSideEffects({ userId });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/users-delete/negative`,
    'admin/users-delete/negative',
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);
