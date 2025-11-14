const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const pwd = await bcrypt.hash('password123', 10);
    await prisma.user.upsert({
        where: { email: 'demo@local' },
        update: {},
        create: { email: 'demo@local', password: pwd, name: 'Demo User' }
    });

    console.log('Seeded demo user & habits');
}
main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());