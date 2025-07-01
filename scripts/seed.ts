
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Generate random 3-digit passwords for consultants
    function generateRandomPassword(): string {
      return Math.floor(100 + Math.random() * 900).toString();
    }

    // Hash password function
    async function hashPassword(password: string): Promise<string> {
      return await bcrypt.hash(password, 12);
    }

    // Create admin user
    const adminPassword = '112233';
    const hashedAdminPassword = await hashPassword(adminPassword);

    await db.insert(users).values({
      name: 'Administrator',
      email: 'admin@company.com',
      hashedPassword: hashedAdminPassword,
      role: 'ADMIN',
    });

    console.log('✅ Admin user created');
    console.log('   Email: admin@company.com');
    console.log('   Password: 112233');

    // Create consultant users
    const consultants = [
      { name: 'Sergio Bandeira', email: 'sergio.bandeira@company.com' },
      { name: 'Mauricio Simões', email: 'mauricio.simoes@company.com' },
      { name: 'Mayco Muniz', email: 'mayco.muniz@company.com' },
      { name: 'Paulo Marcio', email: 'paulo.marcio@company.com' },
      { name: 'Fernando Basil', email: 'fernando.basil@company.com' },
      { name: 'Lucas Almeida', email: 'lucas.almeida@company.com' },
    ];

    console.log('\n📋 Consultant users created:');
    console.log('================================');

    for (const consultant of consultants) {
      const password = generateRandomPassword();
      const hashedPassword = await hashPassword(password);

      await db.insert(users).values({
        name: consultant.name,
        email: consultant.email,
        hashedPassword: hashedPassword,
        role: 'CONSULTANT',
      });

      console.log(`   ${consultant.name}`);
      console.log(`   Email: ${consultant.email}`);
      console.log(`   Password: ${password}`);
      console.log('   ---');
    }

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seed().then(() => {
    process.exit(0);
  });
}

export default seed;
