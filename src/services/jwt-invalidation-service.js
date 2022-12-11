import jwtInvalidationRepository from '../repositories/jwt-invalidation-repository.js';
import mysqlTransactionFactory from '../repositories/mysql-transaction-factory.js';

const globalId = '__global';

export default function (jwtInvRepository, txnFactory) {
    jwtInvRepository = jwtInvRepository ?? jwtInvalidationRepository;
    txnFactory = txnFactory ?? mysqlTransactionFactory;
    return {
        globalInvalidation: async function (newTime) {
            if (newTime) {
                // Set a new global invalidation record.
                const txn = await txnFactory.create();
                try {
                    await txn.start();
                    // Clear all invalidation records.
                    await jwtInvRepository.clear(txn);
                    // Insert the global invalidation record.
                    await jwtInvRepository.add(globalId, newTime, txn);
                    // Commit the transaction.
                    await txn.commit();
                }
                catch (err) {
                    console.error('Error caught while trying to add global invalidation.\n%o', err);
                    await txn.rollback();
                    throw err;
                }
                return newTime;
            }
            const r = await jwtInvRepository.get(globalId);
            if (r?.length) {
                return r[0].MinimumIat;
            }
            return null;
        },
        userInvalidation: async function (userId, newTime) {
            if (newTime) {
                await jwtInvRepository.add(userId, newTime);
                return newTime;
            }
            const r = await jwtInvRepository.get(userId);
            if (r?.length) {
                return r[0].MinimumIat;
            }
            return null;
        }
    };
};
