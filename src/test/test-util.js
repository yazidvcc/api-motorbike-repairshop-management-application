import prismaClient from "../application/database.js"
import bcrypt from "bcrypt"

const userRegister = async () => {

    const password = await bcrypt.hash("test", 10)

    return prismaClient.user.create({
        data: {
            username: "test",
            password: password,
            token: null
        }
    })
}

const createMechanic = async () => {
    return prismaClient.mechanic.create({
        data: {
            name: "test",
            phone: "0895600436143",
            address: "Jalan jalan"
        },
        select: {
            id: true,
            name: true
        }
    })
}

const createManyMechanic = async () => {
    let mechanics = []
    for (let i = 0; i < 12; i++) {
        mechanics.push({
            name: `test-${i}`,
            phone: `089560043614${i}`,
            address: `Jalan jalan ${i}`
        })
    }

    return prismaClient.mechanic.createMany({
        data: mechanics
    })
}

const getMechanic = async () => {
    return prismaClient.mechanic.findFirst({
        select: {
            id: true,
            name: true,
            phone: true,
            address: true
        }
    })

}

const createItem = async (name = "test") => {
    return prismaClient.item.create({
        data: {
            name: name,
            price: 10000,
            stock: 10
        },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true
        }
    })
}

const createManyItem = async () => {
    let items = []
    for (let i = 1; i < 21; i++) {
        items.push({
            name: `test-${i}`,
            price: 10000,
            stock: 10
        })
    }

    return prismaClient.item.createMany({
        data: items
    })
}

const getItems = async (count = undefined) => {
    if (count) {
        return prismaClient.item.findMany({
            select: {
                id: true
            },
            take: count
        })
    }
    return prismaClient.item.findMany({
        select: {
            id: true
        }
    })
}

const createManyOrder = async (total_transaction = 10) => {

    let orders = []

    const items = await createManyItem()
    const mechanic = await createManyMechanic()

    for (let i = 1; i <= total_transaction; i++) {
        const items = await getItems(Math.floor(Math.random() * 10) + 1)
        let itemOrder = []
        let total_part = 100000
        for (const item of items) {
            itemOrder.push({
                item_id: item.id,
                quantity: Math.floor(Math.random() * 10) + 1
            })
            // total_part += item.price * itemOrder[itemOrder.length - 1].quantity
        }

        await prismaClient.order.create({
            data: {
                type: "transaction",
                total_part: total_part,
                orderDetail: {
                    createMany: {
                        data: itemOrder
                    }
                }
            }
        })
    }
}

export {
    userRegister,
    createMechanic,
    createManyMechanic,
    getMechanic,
    createItem,
    createManyItem,
    createManyOrder
}