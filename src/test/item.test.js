import request from "supertest"
import { web } from "../application/web"
import { depth } from "../application/depht"
import prismaClient from "../application/database"
import { createItem, createManyItem } from "./test-util"

describe("POST /api/items", () => {


    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success create new item", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).post("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test",
                price: 10000,
                stock: 10
            })

        depth(response.body)

        expect(response.status).toBe(201)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)
    })

    it("should reject if item is already exist", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        await createItem()

        const response = await request(web).post("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test",
                price: 10000,
                stock: 10
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject is request is invalid", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).post("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "oli",
                price: null,
                stock: null
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

})

describe("PUT /api/items/itemId", () => {

    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success update item", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).put(`/api/items/${item.id}`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update",
                price: 10000,
                stock: 10
            })

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test update")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)

    })

    it("should success update item only name", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).put(`/api/items/${item.id}`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update"
            })

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test update")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)
    })

    it("should reject if item is not found", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).put(`/api/items/123`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update"
            })

        depth(response.body)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject if request is invalid", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).put(`/api/items/123`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update",
                price: null,
                stock: null
            })

        depth(response.body)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe("GET /api/items/itemId", () => {

    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success get item", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).get(`/api/items/${item.id}`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)
    })

    it("should reject if item is not found", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).get(`/api/items/123`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)

        depth(response.body)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe("DELETE /api/items/itemId", () => {
    
    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success delete item", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).delete(`/api/items/${item.id}`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
    })

    it("should reject if item is not found", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).delete(`/api/items/123`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)

        depth(response.body)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})

describe("GET /api/items", () => {
    beforeEach(async () => {
        await createManyItem()
    })

    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success search items", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).get("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .query({
                name: "test",
                page: 1,
                size: 5
            })

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.length).toBe(5)
    })

    it("should not found items", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).get("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .query({
                name: "apa",
                page: 1,
                size: 5
            })

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.length).toBe(0)
        expect(response.body.paging.total_item).toBe(0)
        expect(response.body.paging.total_page).toBe(0)
    })

    it("shoudl success search item with set page and size", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).get("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .query({
                name: "test",
                page: 2,
                size: 15
            })

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.length).toBe(5)
        expect(response.body.paging.total_item).toBe(20)
        expect(response.body.paging.total_page).toBe(2)
    })
})

describe("POST /api/items/itemId/photo", () => {

    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success upload photo", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).post(`/api/items/${item.id}/photo`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "multipart/form-data")
            .attach("photo", __dirname + "/filetest/ayampenyet.jpeg")

        depth(response.body)

        expect(response.status).toBe(201)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.photo).toBeDefined()
    })

    it("should reject if item not found", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).post(`/api/items/123/photo`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "multipart/form-data")
            .attach("photo", __dirname + "/filetest/ayampenyet.jpeg")

        depth(response.body)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject if photo is invalid", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).post(`/api/items/${item.id}/photo`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "multipart/form-data")
            .attach("photo", __dirname + "/filetest/text.txt")

        depth(response.body)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    
})
