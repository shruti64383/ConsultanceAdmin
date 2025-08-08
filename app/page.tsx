"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { NewLeads } from "@/components/new-leads"
import { Customers } from "@/components/customers"
import { BannerManagement } from "@/components/banner-management"
import { PricingManagement } from "@/components/pricing-management"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "new-leads":
        return <NewLeads />
      case "customers":
        return <Customers />
      case "banners":
        return <BannerManagement />
      case "pricing":
        return <PricingManagement />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
