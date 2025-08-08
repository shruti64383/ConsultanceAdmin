"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Clock, TrendingDown, CheckSquare, Square } from "lucide-react"

interface LeadPriorityBulkManagerProps {
  leads: any[]
  onBulkUpdate: (leadIds: string[], priority: string) => void
}

export function LeadPriorityBulkManager({ leads, onBulkUpdate }: LeadPriorityBulkManagerProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const { toast } = useToast()

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(leads.map((lead) => lead.id))
    }
  }

  const handleBulkPriorityUpdate = (priority: string) => {
    if (selectedLeads.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select leads to update priority.",
        variant: "destructive",
      })
      return
    }

    onBulkUpdate(selectedLeads, priority)
    setSelectedLeads([])
    toast({
      title: "Success",
      description: `Updated ${selectedLeads.length} leads to ${priority} priority.`,
    })
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "low":
        return <TrendingDown className="w-4 h-4 text-green-600" />
      default:
        return null
    }
  }

  const priorityStats = {
    high: leads.filter((l) => l.priority === "high").length,
    medium: leads.filter((l) => l.priority === "medium").length,
    low: leads.filter((l) => l.priority === "low").length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Priority Management</CardTitle>
        <p className="text-sm text-gray-600">Select multiple leads to update their priority at once</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-bold text-red-600">{priorityStats.high}</span>
            </div>
            <p className="text-xs text-red-700">High Priority</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-600">{priorityStats.medium}</span>
            </div>
            <p className="text-xs text-yellow-700">Medium Priority</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="font-bold text-green-600">{priorityStats.low}</span>
            </div>
            <p className="text-xs text-green-700">Low Priority</p>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedLeads.length === leads.length ? (
                <CheckSquare className="w-4 h-4 mr-2" />
              ) : (
                <Square className="w-4 h-4 mr-2" />
              )}
              {selectedLeads.length === leads.length ? "Deselect All" : "Select All"}
            </Button>
            <span className="text-sm text-gray-600">
              {selectedLeads.length} of {leads.length} selected
            </span>
          </div>
        </div>

        {/* Lead Selection List */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedLeads.includes(lead.id) ? "bg-blue-50 border-blue-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => handleSelectLead(lead.id)}
            >
              <div className="flex items-center space-x-3">
                {selectedLeads.includes(lead.id) ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-sm">{lead.name}</p>
                  <p className="text-xs text-gray-600">{lead.service}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getPriorityIcon(lead.priority)}
                <Badge
                  className={
                    lead.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : lead.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }
                >
                  {lead.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t">
          <span className="text-sm text-gray-600">Set selected leads to:</span>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            onClick={() => handleBulkPriorityUpdate("high")}
            disabled={selectedLeads.length === 0}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            High
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 bg-transparent"
            onClick={() => handleBulkPriorityUpdate("medium")}
            disabled={selectedLeads.length === 0}
          >
            <Clock className="w-3 h-3 mr-1" />
            Medium
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
            onClick={() => handleBulkPriorityUpdate("low")}
            disabled={selectedLeads.length === 0}
          >
            <TrendingDown className="w-3 h-3 mr-1" />
            Low
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
