"use client"

import { LayoutDashboard, Users, UserPlus, ImageIcon, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "new-leads", label: "New Leads", icon: UserPlus },
    { id: "customers", label: "Customer List", icon: Users },
    { id: "banners", label: "Banners", icon: ImageIcon },
    { id: "pricing", label: "Customize Pricing", icon: DollarSign },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Business Services</h2>
        <p className="text-xs text-gray-400">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                activeTab === item.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
