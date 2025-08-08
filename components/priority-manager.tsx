"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { calculateCustomerPriority, getServiceValue, type PriorityFactors } from "@/utils/priority-calculator"
import { AlertTriangle, TrendingUp, User, Clock } from "lucide-react"

interface PriorityManagerProps {
  customer: any
  onPriorityUpdate: (customerId: string, priority: string) => void
}

export function PriorityManager({ customer, onPriorityUpdate }: PriorityManagerProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Calculate priority based on customer data
  const priorityFactors: PriorityFactors = {
    serviceValue: getServiceValue(customer.service || customer.lastService),
    inquiryDate: customer.date,
    businessType: customer.businessType || "Individual",
    responseUrgency: customer.responseUrgency || "normal",
    customerHistory: customer.customerHistory || "new",
    serviceComplexity: customer.serviceComplexity || "medium",
  }

  const priorityResult = calculateCustomerPriority(priorityFactors)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "low":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Priority Analysis</span>
          <Badge className={getPriorityColor(priorityResult.priority)}>
            {getPriorityIcon(priorityResult.priority)}
            <span className="ml-1 capitalize">{priorityResult.priority} Priority</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Priority Score</span>
            <span className="text-sm text-gray-600">{priorityResult.score}/100</span>
          </div>
          <Progress value={priorityResult.score} className="h-2" />
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowBreakdown(!showBreakdown)} className="w-full">
          {showBreakdown ? "Hide" : "Show"} Priority Breakdown
        </Button>

        {showBreakdown && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-medium">Priority Factors:</h4>
            {Object.entries(priorityResult.breakdown).map(([factor, score]) => (
              <div key={factor} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{factor}</span>
                <div className="flex items-center space-x-2">
                  <Progress value={(score / 40) * 100} className="w-16 h-1" />
                  <span className="text-xs font-medium w-8">{score}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            variant={priorityResult.priority === "high" ? "default" : "outline"}
            onClick={() => onPriorityUpdate(customer.id, "high")}
            className="flex-1"
          >
            High
          </Button>
          <Button
            size="sm"
            variant={priorityResult.priority === "medium" ? "default" : "outline"}
            onClick={() => onPriorityUpdate(customer.id, "medium")}
            className="flex-1"
          >
            Medium
          </Button>
          <Button
            size="sm"
            variant={priorityResult.priority === "low" ? "default" : "outline"}
            onClick={() => onPriorityUpdate(customer.id, "low")}
            className="flex-1"
          >
            Low
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
