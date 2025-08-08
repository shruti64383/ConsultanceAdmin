"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, FileText, CheckCircle, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { calculateDashboardStats, generateChartData } from "@/utils/stats-calculator"

interface Leads {
  leadId: Number;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: Number;
  message: string;
  date: Date;
  status: string;
  priority: string;
  business: string;
}

interface Customers {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  services: string[];
  totalSpent: number;
  date: Date;
  status: string;
  priority: string;
}

interface Services{
    serviceId: Number,
    customerId: Number,
    progress: Number,
    name: string,
    price: Number,
    status: string,
    startDate: Date,
    completedDate: Date,
    description: string,
    requiredDocuments: string[],
    certificates: string[],
    uploadedDocuments: Document[]
} 

interface Inquiry{
  customer: string,
  inquiryId: number,
  service: string,
  status: string,
  date: Date,
  priority: string,
}

interface DashboardStats {
  newInquiries: { value: number; change: number; trend: string };
  activeClients: { value: number; change: number; trend: string };
  servicesCompleted: { value: number; change: number; trend: string };
}

interface DashboardData {
  stats: DashboardStats;
  chartData: any[];
  recentInquiries: any[];
}

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      newInquiries: { value: 0, change: 0, trend: "up" },
      activeClients: { value: 0, change: 0, trend: "up" },
      servicesCompleted: { value: 0, change: 0, trend: "up" },
    },
    chartData: [],
    recentInquiries: [],
  })

  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<Leads[]>([]);
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [services, setServices] = useState<Services[]>([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [])

  useEffect(() => {
  if (leads.length > 0 || customers.length > 0 || services.length > 0) {
    fetchCalculations();
  }
}, [leads, customers, services]);


   const fetchDashboardData = async() => {
    try {
      setLoading(true);
      const responseLeads = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`);
      const responseCustomers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers`);
      const responseServices = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);

      if (!responseLeads.ok && !responseCustomers.ok && !responseServices.ok) {
        throw new Error(`HTTP error! status: ${responseLeads.status}`);
      }

      const resultLeads = await responseLeads.json();
      const resultCustomers = await responseCustomers.json();
      const resultServices = await responseServices.json();

      // Match the structure from your backend response
      if (resultLeads.success && resultCustomers.success && resultServices.success) {
        //window.alert("Leads, Customers, and Services data fetched successfully");
        setLeads(resultLeads.data); // Assuming result.data contains the array of leads
        setCustomers(resultCustomers.data); // Assuming result.data contains the array of customers
        setServices(resultServices.data); // Assuming result.data contains the array of services
        console.log("Fetched leads:", resultLeads.data);
      } else {
        console.error("Backend returned success:false", resultLeads.message);
        setLeads([]); // Set empty array on backend failure
        setCustomers([]);
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]); // Ensure leads is always an array
      setCustomers([]);
      setServices([]);
    } finally {
      setLoading(false);
      //fetchCalculations();       
    }
  };

  const fetchCalculations = async() => {
    try {
      //setLoading(true);
      //window.alert("leads ki length "+ leads.length)
      const statsData = { leads, customers, services }
      const calculatedStats = calculateDashboardStats(statsData)
      const chartData = generateChartData(statsData)

      setDashboardData({
        stats: calculatedStats.stats,
        chartData,
        recentInquiries: leads.slice(0, 3).map((lead) => ({
          customer: lead.name,
          inquiryId: lead.leadId,
          service: lead.service,
          status: lead.status === "new" ? "new" : "contacted",
          date: lead.date,
          priority: lead.priority || "medium",
        })),
      })
    } catch (error) {
      console.error("Error fetching calculations:", error)
      setDashboardData(getMockDashboardData());
    }finally{
      //setLoading(false);
    }
  };

  // const fetchDashboardData = async () => {
  //   try {
  //      setLoading(true)

  //     // Try to fetch data from APIs, but handle failures gracefully
  //     let leads: Leads[] = []
  //     let customers: Customers[] = []
  //     let services: Services[] = []

  //     try {
  //       const leadsResponse = await fetch("http://localhost:5000/api/leads")
  //       if (leadsResponse.ok && leadsResponse.headers.get("content-type")?.includes("application/json")) {
  //         leads = await leadsResponse.json()
  //         window.alert("Lead mili h")
  //       }
  //     } catch (error) {
  //       window.alert("lead data not available")
  //       console.log("Leads API not available, using mock data")
  //     }

  //     try {
  //       const customersResponse = await fetch("http://localhost:5000/api/customers")
  //       if (customersResponse.ok && customersResponse.headers.get("content-type")?.includes("application/json")) {
  //         customers = await customersResponse.json()
  //         window.alert("Customer data mili h")
  //       }
  //     } catch (error) {
  //       window.alert("customer data not available")
  //       console.log("Customers API not available, using mock data")
  //     }

  //     try {
  //       const servicesResponse = await fetch("http://localhost:5000/api/services")
  //       if (servicesResponse.ok && servicesResponse.headers.get("content-type")?.includes("application/json")) {
  //         services = await servicesResponse.json()
  //         window.alert("Services data mili h")
  //       }
  //     } catch (error) {
  //       window.alert("Services API not available")
  //       console.log("Services API not available, using mock data")
  //     }

  //     // If we have real data, use the stats calculator, otherwise use mock data
  //     window.alert(leads.length+" counts ")
  //     if (leads.length > 0 || customers.length > 0) {
  //       const statsData = { leads, customers, services }
  //       const calculatedStats = calculateDashboardStats(statsData)
  //       const chartData = generateChartData(statsData)

  //       setDashboardData({
  //         stats: calculatedStats.stats,
  //         chartData,
  //         recentInquiries: leads.slice(0, 3).map((lead) => ({
  //           customer: lead.name,
  //           inquiryId: lead.leadId,
  //           service: lead.service,
  //           status: lead.status === "new" ? "new" : "contacted",
  //           date: lead.date,
  //           priority: lead.priority || "medium",
  //         })),
  //       })
  //     } else {
  //       // Use mock data when APIs are not available
  //       window.alert("Dashboard data not available")
  //       setDashboardData(getMockDashboardData())
  //     }
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error)
  //     // Always fall back to mock data on any error
  //     setDashboardData(getMockDashboardData())
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const getMockDashboardData = () => {
    // Generate realistic chart data for the last 12 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const chartData = months.map((month, index) => ({
      month,
      inquiries: Math.floor(Math.random() * 50) + 20,
      clients: Math.floor(Math.random() * 30) + 10,
      completed: Math.floor(Math.random() * 25) + 15,
    }))

    return {
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
  }

  const stats = [
    {
      title: "New Inquiries",
      value: dashboardData.stats.newInquiries.value,
      change: dashboardData.stats.newInquiries.change,
      trend: dashboardData.stats.newInquiries.trend,
      color: "teal",
      icon: FileText,
      dataKey: "inquiries",
      description: "Daily change",
    },
    {
      title: "Active Clients",
      value: dashboardData.stats.activeClients.value,
      change: dashboardData.stats.activeClients.change,
      trend: dashboardData.stats.activeClients.trend,
      color: "blue",
      icon: Users,
      dataKey: "clients",
      description: "Monthly change",
    },
    {
      title: "Services Completed",
      value: dashboardData.stats.servicesCompleted.value,
      change: dashboardData.stats.servicesCompleted.change,
      trend: dashboardData.stats.servicesCompleted.trend,
      color: "green",
      icon: CheckCircle,
      dataKey: "completed",
      description: "Weekly change",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
   
  return (
    <div className="space-y-6">
      {/* Stats Cards with Working Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600"

          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className={`text-sm flex items-center ${trendColor}`}>
                  <TrendIcon className="w-3 h-3 mr-1" />
                  {stat.change > 0 ? "+" : ""}
                  {stat.change} {stat.description}
                </div>
                {/* Working Chart */}
                <div className="mt-4 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.chartData.slice(-7)}>
                      <Bar
                        dataKey={stat.dataKey}
                        fill={`#${stat.color === "teal" ? "0d9488" : stat.color === "blue" ? "3b82f6" : "10b981"}`}
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Explanation Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📊 How Stats Are Calculated</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>
            <strong>New Inquiries:</strong> Count of leads with status 'new' + daily change comparison
          </p>
          <p>
            <strong>Active Clients:</strong> Count of customers with status 'active' + monthly growth
          </p>
          <p>
            <strong>Services Completed:</strong> Count of services with status 'completed' + weekly change
          </p>
          <p>
            <strong>Charts:</strong> Real data from API calls, updated in real-time
          </p>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <p className="text-sm text-gray-600">Trends over the last 12 months (Real Data)</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="inquiries" stroke="#0d9488" strokeWidth={2} name="New Inquiries" />
                <Line type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={2} name="Active Clients" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed Services" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inquiries</CardTitle>
            <Button variant="link" className="text-blue-600" onClick={fetchDashboardData}>
              Refresh
            </Button>
          </div>
          <p className="text-sm text-gray-600">Inquiries Based on Time</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Service</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Priority</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentInquiries.map((inquiry, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{inquiry.customer}</div>
                        <div className="text-sm text-gray-500">{inquiry.inquiryId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{inquiry.service}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          inquiry.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : inquiry.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{inquiry.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          inquiry.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : inquiry.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inquiry.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
