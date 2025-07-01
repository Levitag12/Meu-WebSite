import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';

const consultants = [
  { name: 'Sergio Bandeira', email: 'sergio.bandeira@company.com' },
  { name: 'Mauricio Simões', email: 'mauricio.simoes@company.com' },
  { name: 'Mayco Muniz', email: 'mayco.muniz@company.com' },
  { name: 'Paulo Marcio', email: 'paulo.marcio@company.com' },
  { name: 'Fernando Basil', email: 'fernando.basil@company.com' },
  { name: 'Lucas Almeida', email: 'lucas.almeida@company.com' },
];

function generatePassword(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('112233', 10);
    await db.insert(users).values({
      name: 'Admin',
      email: 'admin@company.com',
      password: adminPassword,
      role: 'ADMIN',
    });

    console.log('✅ Admin user created: admin@company.com / 112233');

    // Create consultant users
    console.log('\n👥 Generated consultant credentials:');
    for (const consultant of consultants) {
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.insert(users).values({
        name: consultant.name,
        email: consultant.email,
        password: hashedPassword,
        role: 'CONSULTANT',
      });

      console.log(`📧 ${consultant.email} / ${password}`);
    }

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Execute if run directly
if (require.main === module) {
  seed().then(() => {
    process.exit(0);
  });
}

export { seed };