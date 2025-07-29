import { headers } from "next/headers"
import { Webhook } from "svix"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { createUser, trackUserEvent } from "@/lib/database"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occurred", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const email = email_addresses[0]?.email_address

    if (email) {
      try {
        await createUser(id, email, first_name || undefined, last_name || undefined, image_url || undefined)

        // Track user registration event
        await trackUserEvent(id, "user_registered", {
          email,
          registration_method: "clerk",
          has_name: !!(first_name || last_name),
          has_image: !!image_url,
        })

        console.log(`User created: ${id} (${email})`)
      } catch (error) {
        console.error("Error creating user:", error)
        return new Response("Error creating user", { status: 500 })
      }
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const email = email_addresses[0]?.email_address

    if (email) {
      try {
        await createUser(id, email, first_name || undefined, last_name || undefined, image_url || undefined)

        console.log(`User updated: ${id} (${email})`)
      } catch (error) {
        console.error("Error updating user:", error)
        return new Response("Error updating user", { status: 500 })
      }
    }
  }

  return new Response("", { status: 200 })
}
