import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const plans = await prisma.plano.findMany()
  console.log('PLANS:', JSON.stringify(plans, null, 2))
  const users = await prisma.user.findMany({ take: 5 })
  console.log('USERS:', JSON.stringify(users, null, 2))
}
main().catch(console.error).finally(() => prisma.$disconnect())
