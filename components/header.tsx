import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <Button variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
