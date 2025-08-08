import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate database query delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate realistic chart data for the last 12 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const chartData = months.map((month, index) => ({
      month,
      inquiries: Math.floor(Math.random() * 50) + 20,
      clients: Math.floor(Math.random() * 30) + 10,
      completed: Math.floor(Math.random() * 25) + 15,
    }))

    const dashboardData = {
      stats: {
        newInquiries: { value: 24, change: 5, trend: "up" },
        activeClients: { value: 156, change: 12, trend: "up" },
        servicesCompleted: { value: 89, change: -3, trend: "down" },
      },
      chartData,
      recentInquiries: [
        {
          customer: "Rajesh Kumar",
          inquiryId: "INQ001",
          service: "Company Registration",
          status: "In Progress",
          date: "2025-01-15",
          priority: "High",
        },
        {
          customer: "Priya Sharma",
          inquiryId: "INQ002",
          service: "GST Registration",
          status: "Completed",
          date: "2025-01-14",
          priority: "Medium",
        },
        {
          customer: "Amit Patel",
          inquiryId: "INQ003",
          service: "Trademark Registration",
          status: "Under Review",
          date: "2025-01-13",
          priority: "High",
        },
      ],
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
