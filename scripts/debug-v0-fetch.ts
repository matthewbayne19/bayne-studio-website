import { config } from "dotenv"
config({ path: ".env.local" })

async function test() {
  console.log("Node version:", process.version)
  try {
    const res = await fetch("https://api.v0.dev/v2/chats", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.V0_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "diagnostic test" }),
    })
    console.log("Status:", res.status)
    console.log(await res.json())
  } catch (err) {
    console.error("Raw fetch failed:", err)
    console.error("Underlying cause:", (err as any)?.cause)
  }
}

test()
