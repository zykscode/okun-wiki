import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    const existing = await prisma.community.findFirst({ where: { slug: "test-community" } })
    if (!existing) {
        const community = await prisma.community.create({
            data: {
                name: "Test Community",
                slug: "test-community",
                description: "A community for testing.",
                region: "Kogi West"
            }
        })
        console.log("Created:", community)
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
