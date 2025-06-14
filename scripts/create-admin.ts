import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@baadaye.com'
  const password = 'admin123'
  const name = 'Admin User'

  const hashedPassword = await hashPassword(password)

  try {
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    console.log('Admin user created:', admin)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 