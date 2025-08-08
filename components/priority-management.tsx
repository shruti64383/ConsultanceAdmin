"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, AlertTriangle, Clock, TrendingDown, User, Edit, X } from "lucide-react"

export function PriorityManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPriority, setEditingPriority] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)

      try {
        const response = await fetch("/api/customers")
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
          const data = await response.json()
          setCustomers(data)
        } else {
          throw new Error("API not available")
        }
      } catch (apiError) {
        console.log("Customers API not available, using mock data")
        setCustomers(getMockCustomers())
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      setCustomers(getMockCustomers())
    } finally {
      setLoading(false)
    }
  }

  const getMockCustomers = () => [
    {
      id: "CUST001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 9876543210",
      service: "Company Registration",
      priority: "high",
      lastActivity: "2025-01-15",
      totalValue: "₹20,000",
      status: "active",
    },
    {
      id: "CUST002",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 9876543211",
      service: "Trademark Registration",
      priority: "medium",
      lastActivity: "2025-01-14",
      totalValue: "₹25,000",
      status: "active",
    },
    {
      id: "CUST003",
      name: "Amit Patel",
      email: "amit.patel@email.com",
      phone: "+91 9876543212",
      service: "Legal Documentation",
      priority: "low",
      lastActivity: "2025-01-13",
      totalValue: "₹35,000",
      status: "active",
    },
    {
      id: "CUST004",
      name: "Sunita Mehta",
      email: "sunita.mehta@email.com",
      phone: "+91 9876543213",
      service: "GST Registration",
      priority: "high",
      lastActivity: "2025-01-12",
      totalValue: "₹5,000",
      status: "active",
    },
  ]

  const handlePriorityChange = async (customerId: string, newPriority: string) => {
    try {
      setActionLoading(customerId)
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priority: newPriority }),
      })

      if (response.ok) {
        setCustomers(
          customers.map((customer) => (customer.id === customerId ? { ...customer, priority: newPriority } : customer)),
        )
        toast({
          title: "Success",
          description: `Customer priority updated to ${newPriority}.`,
        })
      } else {
        throw new Error("Failed to update priority")
      }
    } catch (error) {
      console.error("Error updating priority:", error)
      toast({
        title: "Error",
        description: "Failed to update priority. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
      setEditingPriority(null)
    }
  }

  const bulkUpdatePriority = async (customerIds: string[], newPriority: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/customers/bulk-priority", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerIds, priority: newPriority }),
      })

      if (response.ok) {
        setCustomers(
          customers.map((customer) =>
            customerIds.includes(customer.id) ? { ...customer, priority: newPriority } : customer,
          ),
        )
        toast({
          title: "Success",
          description: `${customerIds.length} customers updated to ${newPriority} priority.`,
        })
      }
    } catch (error) {
      console.error("Error bulk updating priority:", error)
      toast({
        title: "Error",
        description: "Failed to update priorities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPriorityIcon = (priority: string) => {
    const priorityValue = priority || "medium"
    switch (priorityValue) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "low":
        return <TrendingDown className="w-4 h-4 text-green-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    const priorityValue = priority || "medium"
    switch (priorityValue) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.service.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const priorityStats = {
    high: customers.filter((c) => (c.priority || "medium") === "high").length,
    medium: customers.filter((c) => (c.priority || "medium") === "medium").length,
    low: customers.filter((c) => (c.priority || "medium") === "low").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Priority Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={fetchCustomers} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Priority Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{priorityStats.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Priority</p>
                <p className="text-2xl font-bold text-yellow-600">{priorityStats.medium}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Priority</p>
                <p className="text-2xl font-bold text-green-600">{priorityStats.low}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Priority Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Set all customers to:</span>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              onClick={() =>
                bulkUpdatePriority(
                  customers.map((c) => c.id),
                  "high",
                )
              }
            >
              High Priority
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 bg-transparent"
              onClick={() =>
                bulkUpdatePriority(
                  customers.map((c) => c.id),
                  "medium",
                )
              }
            >
              Medium Priority
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
              onClick={() =>
                bulkUpdatePriority(
                  customers.map((c) => c.id),
                  "low",
                )
              }
            >
              Low Priority
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Priority List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(customer.priority)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Service: {customer.service}</p>
                    <p>Value: {customer.totalValue}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm text-gray-500">
                    <p>Last Activity</p>
                    <p>{customer.lastActivity}</p>
                  </div>

                  {editingPriority === customer.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={customer.priority || "medium"}
                        onChange={(e) => handlePriorityChange(customer.id, e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={actionLoading === customer.id}
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPriority(null)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`cursor-pointer ${getPriorityColor(customer.priority || "medium")}`}
                        onClick={() => setEditingPriority(customer.id)}
                      >
                        {(customer.priority || "medium").toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPriority(customer.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
