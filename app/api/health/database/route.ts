import { testDatabaseConnection } from "@/lib/database"

export async function GET() {
  try {
    const result = await testDatabaseConnection()

    if (result.success) {
      return Response.json({
        status: "healthy",
        message: result.message,
        timestamp: new Date().toISOString(),
      })
    } else {
      return Response.json(
        {
          status: "unhealthy",
          message: result.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "Database health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
