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
export {
    userRegister,
    mechanicRegister,
    createManyMechanic,
    getMechanic
}