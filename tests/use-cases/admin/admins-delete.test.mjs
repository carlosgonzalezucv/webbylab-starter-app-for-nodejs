import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/admins-delete/positive`,
    'admin/admins-delete/positive',
    async ({ config: { serviceClass, before }, expected, checkSideEffects }) => {
        const adminId = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { id: adminId }, expected });

        await checkSideEffects({ adminId });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/admins-delete/negative`,
    'admin/admins-delete/negative',
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);