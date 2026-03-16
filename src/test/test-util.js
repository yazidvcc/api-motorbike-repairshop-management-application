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
                id: true,
                price: true
            },
            take: count
        })
    }
    return prismaClient.item.findMany({
        select: {
            id: true,
            price: true
        }
    })
}

const createManyOrder = async (total_transaction = 10) => {

    let orders = []

    const items = await createManyItem()
    const mechanic = await createManyMechanic()

    const date = new Date()
    const wibDate = new Date(date.getTime() + (7 * 60 * 60 * 1000))
    
    for (let i = 1; i <= total_transaction; i++) {
        const items = await getItems(Math.floor(Math.random() * 10) + 1)
        let itemOrder = []
        let total_part = 100000
        for (const item of items) {
            itemOrder.push({
                item_id: item.id,
                quantity: Math.floor(Math.random() * 10) + 1
            })
            total_part += item.price * itemOrder[itemOrder.length - 1].quantity
        }

        await prismaClient.order.create({
            data: {
                type: "transaction",
                total_part: total_part,
                date: wibDate,
                time: wibDate,
                orderDetail: {
                    createMany: {
                        data: itemOrder
                    }
                }
            }
        })
    }
}

const dataForMerec = async () => {
    let orders = []

    const now = new Date()

    const items = await createManyItem()
    const mechanic = await createManyMechanic()

    for(let i = 1; i <= 10; i++) {
        const items = await getItems(Math.floor(Math.random() * 10) + 1)
        let itemOrder = []
        let total_part = 0
        for (const item of items) {
            itemOrder.push({
                item_id: item.id,
                quantity: Math.floor(Math.random() * 10) + 1
            })
            total_part += item.price * itemOrder[itemOrder.length - 1].quantity
        }

        orders.push({
            type: "transaction",
            total_part: total_part,
            orderDetail: {
                createMany: {
                    data: itemOrder
                }
            }
        })
    }

    const mechanics = await prismaClient.mechanic.findMany({
        select: {
            id: true
        }
    })

    for (let mechanic of mechanics) {

        for (let i = 1; i <= Math.floor(Math.random() * 10) + 1; i++) {
            const items = await getItems(Math.floor(Math.random() * 10) + 1)
            let itemOrder = []
            let total_part = 0
            for (const item of items) {
                itemOrder.push({
                    item_id: item.id,
                    quantity: Math.floor(Math.random() * 10) + 1
                })
                total_part += item.price * itemOrder[itemOrder.length - 1].quantity
            }

            orders.push({
                type: "services",
                mechanic_id: mechanic.id,
                total_part: total_part,
                total_service: Math.floor(Math.random() * 100000) + 1,
                service_description: "Service motor",
                date: new Date(now.getFullYear(), now.getMonth(), Math.floor(Math.random() * 14) + 1),
                orderDetail: {
                    createMany: {
                        data: itemOrder
                    }
                }
            })
        } 
    }

    for (const order of orders) {
        await prismaClient.order.create({
            data: order
        })
    }
    return "OK"
}

export {
    userRegister,
    createMechanic,
    createManyMechanic,
    getMechanic,
    createItem,
    createManyItem,
    createManyOrder,
    dataForMerec
}