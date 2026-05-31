const { PrismaClient } = require('./app/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'testpassword123';
  
  try {
    console.log('Testing User creation in PostgreSQL...');
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    console.log('Existing check:', existing);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username: email.split('@')[0],
        province: 'Harare',
        is_active: true,
        role: 'USER'
      }
    });
    
    console.log('Successfully created user in Dokploy DB:', newUser);
    
    // Clean up
    await prisma.user.delete({
      where: { id: newUser.id }
    });
    console.log('Cleaned up test user successfully.');
  } catch (err) {
    console.error('Error during database user test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
