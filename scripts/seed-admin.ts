import { db } from '../server/db';
import { users } from '../shared/schema';
import { hashPassword } from '../server/middleware/auth';

async function seedAdmin() {
  try {
    console.log('Creating admin user...');
    
    const hashedPassword = await hashPassword('MD Tousif2004');
    
    const adminUser = await db.insert(users).values({
      username: 'admin',
      email: 'mohammedtousif3709@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    }).returning();
    
    console.log('Admin user created successfully:', adminUser[0]);
    console.log('Email: mohammedtousif3709@gmail.com');
    console.log('Password: MD Tousif2004');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

seedAdmin();