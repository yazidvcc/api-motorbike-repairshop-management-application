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

const mechanicRegister = async () => {
    return prismaClient.mechanic.create({
        data: {
            name: "test",
            phone: "0895600436143",
            address: "Jalan jalan"
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

const createItem = async () => {
    return prismaClient.item.create({
        data: {
            name: "test",
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

export {
    userRegister,
    mechanicRegister,
    createManyMechanic,
    getMechanic,
    createItem,
    createManyItem
}