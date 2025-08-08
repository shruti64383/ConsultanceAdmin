export interface PriorityFactors {
  serviceValue: number
  inquiryDate: string
  businessType: string
  responseUrgency: "urgent" | "normal" | "low"
  customerHistory: "new" | "returning" | "vip"
  serviceComplexity: "high" | "medium" | "low"
}

export function calculateCustomerPriority(factors: PriorityFactors): {
  priority: "high" | "medium" | "low"
  score: number
  breakdown: Record<string, number>
} {
  let score = 0
  const breakdown: Record<string, number> = {}

  // 1. Service Value Weight (40%)
  let serviceValueScore = 0
  if (factors.serviceValue >= 50000) {
    serviceValueScore = 40
  } else if (factors.serviceValue >= 20000) {
    serviceValueScore = 25
  } else if (factors.serviceValue >= 10000) {
    serviceValueScore = 15
  } else {
    serviceValueScore = 5
  }
  breakdown["Service Value"] = serviceValueScore
  score += serviceValueScore

  // 2. Response Urgency Weight (25%)
  const daysSinceInquiry = Math.floor(
    (new Date().getTime() - new Date(factors.inquiryDate).getTime()) / (1000 * 60 * 60 * 24),
  )
  let urgencyScore = 0
  if (daysSinceInquiry > 7 || factors.responseUrgency === "urgent") {
    urgencyScore = 25
  } else if (daysSinceInquiry > 3 || factors.responseUrgency === "normal") {
    urgencyScore = 15
  } else {
    urgencyScore = 5
  }
  breakdown["Response Urgency"] = urgencyScore
  score += urgencyScore

  // 3. Business Type Weight (20%)
  const businessTypeScores = {
    Enterprise: 20,
    "Technology Startup": 18,
    Manufacturing: 15,
    Healthcare: 15,
    Finance: 15,
    Retail: 10,
    Consulting: 10,
    Individual: 5,
  }
  const businessScore = businessTypeScores[factors.businessType as keyof typeof businessTypeScores] || 8
  breakdown["Business Type"] = businessScore
  score += businessScore

  // 4. Customer History Weight (10%)
  const historyScores = {
    vip: 10,
    returning: 7,
    new: 3,
  }
  const historyScore = historyScores[factors.customerHistory]
  breakdown["Customer History"] = historyScore
  score += historyScore

  // 5. Service Complexity Weight (5%)
  const complexityScores = {
    high: 5,
    medium: 3,
    low: 1,
  }
  const complexityScore = complexityScores[factors.serviceComplexity]
  breakdown["Service Complexity"] = complexityScore
  score += complexityScore

  // Determine priority based on total score
  let priority: "high" | "medium" | "low"
  if (score >= 70) {
    priority = "high"
  } else if (score >= 40) {
    priority = "medium"
  } else {
    priority = "low"
  }

  return { priority, score, breakdown }
}

export function getServiceValue(serviceName: string): number {
  const serviceValues = {
    "Company Registration": 15000,
    "GST Registration": 5000,
    "Trademark Registration": 25000,
    "Legal Documentation": 10000,
    "Tax Compliance": 8000,
    "Business License": 12000,
    "Patent Filing": 50000,
    "Corporate Restructuring": 75000,
  }
  return serviceValues[serviceName as keyof typeof serviceValues] || 10000
}
