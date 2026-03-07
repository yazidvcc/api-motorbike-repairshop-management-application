import redis from "../application/redis"

afterAll(async () => {
    await redis.quit()
})

test("test redis connection", async () => {

    await redis.set("name", "yazid", "EX", 1000)
    const name = await redis.get("name")

    expect(name).toBe("yazid")


})