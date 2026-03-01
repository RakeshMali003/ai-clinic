try {
    const utils = require('@prisma/client-runtime-utils');
    console.log('✅ Successfully required @prisma/client-runtime-utils');
    console.log('Keys:', Object.keys(utils));
} catch (e) {
    console.error('❌ Failed to require @prisma/client-runtime-utils');
    console.error(e);
}
