const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const pwd = await bcrypt.hash('Tasfiaa024@', 10);
    await prisma.user.upsert({
        where: { email: 'super@maritaldesk.com' },
        update: {},
        create: { email: 'super@maritaldesk.com', password: pwd, name: 'Super User' }
    });

    console.log('Seeded super admin user & habits');
}
main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());