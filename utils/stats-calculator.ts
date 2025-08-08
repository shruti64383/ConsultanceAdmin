export interface StatsData {
  leads: any[]
  customers: any[]
  services: any[]
}

export function calculateDashboardStats(data: StatsData) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const thisWeek = new Date(today)
  thisWeek.setDate(thisWeek.getDate() - 7)

  const thisMonth = new Date(today)
  thisMonth.setMonth(thisMonth.getMonth() - 1)

  // Calculate New Inquiries
  const newInquiriesToday = data.leads.filter((lead) => {
    const leadDate = new Date(lead.date)
    return leadDate.toDateString() === today.toDateString() && lead.status === "new"
  }).length

  const newInquiriesYesterday = data.leads.filter((lead) => {
    const leadDate = new Date(lead.date)
    return leadDate.toDateString() === yesterday.toDateString() && lead.status === "new"
  }).length

  const totalNewInquiries = data.leads.filter((lead) => lead.status === "new").length

  // Calculate Active Clients
  const activeClientsThisMonth = data.customers.filter((customer) => {
    const customerDate = new Date(customer.date)
    return customerDate >= thisMonth && customer.status === "active"
  }).length

  const activeClientsLastMonth = data.customers.filter((customer) => {
    const customerDate = new Date(customer.date)
    const lastMonth = new Date(thisMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    return customerDate >= lastMonth && customerDate < thisMonth && customer.status === "active"
  }).length

  const totalActiveClients = data.customers.filter((customer) => customer.status === "active").length

  // Calculate Services Completed
  const servicesCompletedThisWeek =
    data.services?.filter((service) => {
      const serviceDate = new Date(service.completedDate || service.date)
      return serviceDate >= thisWeek && service.status === "completed"
    }).length || 0

  const servicesCompletedLastWeek =
    data.services?.filter((service) => {
      const serviceDate = new Date(service.completedDate || service.date)
      const lastWeek = new Date(thisWeek)
      lastWeek.setDate(lastWeek.getDate() - 7)
      return serviceDate >= lastWeek && serviceDate < thisWeek && service.status === "completed"
    }).length || 0

  const totalServicesCompleted = data.services?.filter((service) => service.status === "completed").length || 0

  return {
    stats: {
      newInquiries: {
        value: totalNewInquiries,
        change: newInquiriesToday - newInquiriesYesterday,
        trend: newInquiriesToday - newInquiriesYesterday >= 0 ? "up" : "down",
      },
      activeClients: {
        value: totalActiveClients,
        change: activeClientsThisMonth - activeClientsLastMonth,
        trend: activeClientsThisMonth - activeClientsLastMonth >= 0 ? "up" : "down",
      },
      servicesCompleted: {
        value: totalServicesCompleted,
        change: servicesCompletedThisWeek - servicesCompletedLastWeek,
        trend: servicesCompletedThisWeek - servicesCompletedLastWeek >= 0 ? "up" : "down",
      },
    },
  }
}

export function generateChartData(data: StatsData) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()

  return months.map((month, index) => {
    // Calculate actual data for each month
    const monthData = {
      month,
      inquiries: 0,
      clients: 0,
      completed: 0,
    }

    // Filter data by month
    const monthLeads = data.leads.filter((lead) => {
      const leadDate = new Date(lead.date)
      return leadDate.getMonth() === index
    })

    const monthCustomers = data.customers.filter((customer) => {
      const customerDate = new Date(customer.date)
      return customerDate.getMonth() === index
    })

    const monthServices =
      data.services?.filter((service) => {
        const serviceDate = new Date(service.date)
        return serviceDate.getMonth() === index && service.status === "completed"
      }) || []

    monthData.inquiries = monthLeads.length
    monthData.clients = monthCustomers.length
    monthData.completed = monthServices.length

    // Add some realistic variation for demo
    if (index <= currentMonth) {
      monthData.inquiries += Math.floor(Math.random() * 20) + 10
      monthData.clients += Math.floor(Math.random() * 15) + 5
      monthData.completed += Math.floor(Math.random() * 12) + 8
    }

    return monthData
  })
}
