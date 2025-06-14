import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string) {
  return await hash(password, 12)
}

async function main() {
  const email = 'admin@baadaye.com'
  const password = 'admin123'
  const name = 'Admin User'

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin)
      return
    }

    // Create new admin
    const hashedPassword = await hashPassword(password)
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    console.log('✅ Admin user created successfully')
    console.log('Email:', email)
    console.log('Password:', password)
  } catch (error) {
    console.error('❌ Error creating admin user:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
