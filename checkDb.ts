import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    const communities = await prisma.community.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    members: true,
                    updates: true,
                },
            },
        },
    })
    console.log(JSON.stringify(communities, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
