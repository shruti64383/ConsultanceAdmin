"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { NewLeads } from "@/components/new-leads"
import { Customers } from "@/components/customers"
import { BannerManagement } from "@/components/banner-management"
import { PricingManagement } from "@/components/pricing-management"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [collapsed, setCollapsed] = useState(false); 
  const toggleSidebar = () => setCollapsed(!collapsed);
  const router = useRouter()
  
  useEffect(() => {
    const fetchUserData = async () => {
       
      try {

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/mine`, {
          withCredentials: true
        }); 

        setUserEmail(res.data.user.email);
        setUserName(res.data.user.name);
        if(res.data.user.role === "admin") setIsAuthenticated(true)
        else router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);

      } catch (error: any) {
         
        if (error.response?.status === 401) {         
          router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`); // redirect to login page
        } else {
          console.error("Error fetching user data:", error);
        }

      } finally {
        setIsLoading(false)  
      }
    }

    fetchUserData();
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null // ⛔ Don't render dashboard at all if not logged in
  }

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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setCollapsed(prev => !prev)}/>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
