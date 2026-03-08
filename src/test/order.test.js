import request from "supertest"
import prismaClient from "../application/database"
import { web } from "../application/web"
import { depth } from "../application/depht"
import { createItem, getMechanic, mechanicRegister } from "./test-util"

describe("POST /api/orders", () => {

    afterAll(async () => {
        await prismaClient.order.deleteMany()
        await prismaClient.item.deleteMany()
    })

    it("should success create order type transaction", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        let items = []

        for (let i = 1; i <= 2; i++) {
            let item = await createItem("test" + i)
            items.push({ 
                item_id: item.id,
                quantity: i * 2
            })
        }   
        
        const response = await request(web).post("/api/orders")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                type: "transaction",
                items: items
            })

        depth(response.body)

        expect(response.status).toBe(201)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.type).toBe("transaction")
        expect(response.body.data.orderDetail).toBeDefined()
        expect(response.body.data.orderDetail.length).toBe(2)
    })

    it("should success create order type services", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        let items = []

        for (let i = 1; i <= 2; i++) {
            let item = await createItem("test" + i)
            items.push({ 
                item_id: item.id,
                quantity: i * 2
            })
        }

        const mechanic = await mechanicRegister()
        
        const response = await request(web).post("/api/orders")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                type: "services",
                mechanic_id: mechanic.id,
                service_description: "Service motor",
                total_service: 89000,
                items: items
            })

        depth(response.body)

        expect(response.status).toBe(201)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.type).toBe("services")
        expect(response.body.data.orderDetail).toBeDefined()
        expect(response.body.data.orderDetail.length).toBe(2)
    })

    it("should reject if item is not found", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })
        
        const response = await request(web).post("/api/orders")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                type: "transaction",
                items: [
                    {
                        item_id: 999999,
                        quantity: 1
                    }
                ]
            })

        depth(response.body)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject if quantity is more than stock", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        let items = []

        for (let i = 1; i <= 2; i++) {
            let item = await createItem("test" + i)
            items.push({ 
                item_id: item.id,
                quantity: 999
            })
        }   
        
        const response = await request(web).post("/api/orders")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                type: "transaction",
                items: items
            })

        depth(response.body)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject if types services but mechanic id is null", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        let items = []

        for (let i = 1; i <= 2; i++) {
            let item = await createItem("test" + i)
            items.push({ 
                item_id: item.id,
                quantity: i * 2
            })
        }   

        const response = await request(web).post("/api/orders")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                type: "services",
                items: items
            })

        depth(response.body)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

})