"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, Trash2, Phone, Mail, Calendar, Loader2, X, Edit } from "lucide-react"

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

export function NewLeads() {
  const [searchTerm, setSearchTerm] = useState("")
  const [leads, setLeads] = useState<Leads[]>([]); // Properly typed state
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Number | null>(null)
  const [editingPriority, setEditingPriority] = useState<Number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const result = await response.json();
    
      // Match the structure from your backend response
      if (result.success) {
        setLeads(result.data); // Assuming result.data contains the array of leads
        console.log("Fetched leads:", result.data);
      } else {
        console.error("Backend returned success:false", result.message);
        setLeads([]); // Set empty array on backend failure
      }    
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]); // Ensure leads is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCustomer = async (leadId: Number) => {          
          try {
            const leadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${leadId}`, {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
            },
            });

            if (!leadResponse.ok) { 
              throw new Error('Failed to fetch lead data');
            } 

            const leadBody = await leadResponse.json();
            const leadData = leadBody.data;
            //window.alert(JSON.stringify(leadData))

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(leadData),
            });

            if (!response.ok) {
              throw new Error('Failed to create customer');
            }

            //window.alert("Customer added successfully");
            handleDelete(leadId);

          } catch (error: unknown) {
            let errorMessage = 'Failed to submit inquiry';
      
            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (typeof error === 'string') {
              errorMessage = error;
            }
            console.error('Submission error:', error);
             
          } 
      };

  const handlePriorityChange = async (leadId: Number, newPriority: string) => {
    try { 
      setActionLoading(leadId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/priority/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priority: newPriority, leadId: leadId }),
      })

      if (response.ok) { 
        setLeads(leads.map((lead) => (lead.leadId == leadId ? { ...lead, priority: newPriority } : lead)))
        toast({
          title: "Success",
          description: `Lead priority updated to ${newPriority}.`,
        })
      } else { 
        throw new Error("Failed to update priority")
      }
    } catch (error) {
      console.error("Error updating priority:", error)
      // Update locally even if API fails (for demo purposes)
      setLeads(leads.map((lead) => (lead.leadId === leadId ? { ...lead, priority: newPriority } : lead)))
      toast({
        title: "Updated",
        description: `Lead priority updated to ${newPriority} (demo mode).`,
      })
    } finally {
      setActionLoading(null)
      setEditingPriority(null)
    }
  }

  const handleDelete = async (leadId: Number) => {
    try {
      setActionLoading(leadId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${leadId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLeads(leads.filter((lead) => lead.leadId !== leadId))
        toast({
          title: "Success",
          description: "Lead deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete lead")
      }
    } catch (error) {
      console.error("Error deleting lead:", error)
      // Delete locally even if API fails (for demo purposes)
      setLeads(leads.filter((lead) => lead.leadId !== leadId))
      toast({
        title: "Deleted",
        description: "Lead deleted (demo mode).",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleStatusUpdate = async (leadId: Number, newStatus: string) => {
    try {
      setActionLoading(leadId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/status/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, leadId: leadId }),
      })

      if (response.ok) {
        setLeads(leads.map((lead) => (lead.leadId === leadId ? { ...lead, status: newStatus } : lead)))
        toast({
          title: "Success",
          description: "Lead status updated successfully.",
        })
      } else {
        throw new Error("Failed to update lead status")
      }
    } catch (error) {
      console.error("Error updating lead status:", error)
      // Update locally even if API fails (for demo purposes)
      setLeads(leads.map((lead) => (lead.leadId === leadId ? { ...lead, status: newStatus } : lead)))
      toast({
        title: "Updated",
        description: "Lead status updated (demo mode).",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-800"
      case "contacted":
        return "bg-blue-100 text-blue-800"
      case "qualified":
        return "bg-purple-100 text-purple-800"
      case "converted":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  //window.alert("leads ki length "+ leads.length)

  const filteredLeads = (leads || []).filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.service.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Priority statistics
  const priorityStats = {
    high: leads.filter((l) => l.priority === "high").length,
    medium: leads.filter((l) => l.priority === "medium").length,
    low: leads.filter((l) => l.priority === "low").length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">New Leads</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={fetchLeads} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Priority Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              <p className="text-sm text-gray-600">Total Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{priorityStats.high}</p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{priorityStats.medium}</p>
              <p className="text-sm text-gray-600">Medium Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{priorityStats.low}</p>
              <p className="text-sm text-gray-600">Low Priority</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.leadId.toLocaleString()} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Lead ID: {lead.leadId.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Priority Management */}
                  {editingPriority === lead.leadId ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={lead.priority}
                        onChange={(e) => handlePriorityChange(lead.leadId, e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={actionLoading === lead.leadId}
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPriority(null)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Badge
                        className={`cursor-pointer ${getPriorityColor(lead.priority)}`}
                        onClick={() => setEditingPriority(lead.leadId)}
                      >
                        {lead.priority} priority
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPriority(lead.leadId)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{new Date(lead.date).toISOString().split('T')[0]}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-700">Service Required:</p>
                    <p className="text-sm text-gray-600">{lead.service}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-700">Budget Range:</p>
                    <p className="text-sm text-gray-600">{lead.budget.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  })}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-700">Business Type:</p>
                    <p className="text-sm text-gray-600">{lead.business}</p>
                  </div>
                </div>
              </div>
              {/* <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{lead.message}</p>
              </div> */}
              <div className="mt-4">
  <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg max-h-[150px] overflow-y-auto scrollbar-hide whitespace-pre-wrap">
    {lead.message}
  </div>
</div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusUpdate(lead.leadId, e.target.value)}
                    disabled={actionLoading === lead.leadId}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    {/* <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option> */}
                  </select>
                  <Button onClick={() => handleCustomer(lead.leadId)}variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    Add in Customer List
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                        Contact
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDelete(lead.leadId)}
                    disabled={actionLoading === lead.leadId}
                  >
                    {actionLoading === lead.leadId ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">🎯 Priority Management Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>
            <strong>Set Priority:</strong> Click on any priority badge to change it (High/Medium/Low)
          </p>
          <p>
            <strong>High Priority:</strong> Urgent leads requiring immediate attention
          </p>
          <p>
            <strong>Medium Priority:</strong> Standard leads with normal follow-up
          </p>
          <p>
            <strong>Low Priority:</strong> Leads that can be handled when time permits
          </p>
          <p>
            <strong>Status Update:</strong> Change lead status as you progress through the sales process
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
