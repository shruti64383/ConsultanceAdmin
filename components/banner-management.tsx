"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, Eye, Trash2, Edit, Plus } from "lucide-react"
import Image from "next/image"

export function BannerManagement() {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: "Summer Sale Banner",
      image: "/placeholder.svg?height=200&width=800&text=Summer+Sale+Banner",
      isActive: true,
      position: "home-hero",
      link: "/summer-sale",
    },
    {
      id: 2,
      title: "New Collection Banner",
      image: "/placeholder.svg?height=200&width=800&text=New+Collection+Banner",
      isActive: true,
      position: "home-secondary",
      link: "/new-collection",
    },
    {
      id: 3,
      title: "Special Offer Banner",
      image: "/placeholder.svg?height=200&width=800&text=Special+Offer+Banner",
      isActive: false,
      position: "sidebar",
      link: "/special-offers",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newBanner, setNewBanner] = useState({
    title: "",
    image: "",
    position: "home-hero",
    link: "",
    isActive: true,
  })

  const handleToggleStatus = (id: number) => {
    setBanners(banners.map((banner) => (banner.id === id ? { ...banner, isActive: !banner.isActive } : banner)))
  }

  const handleDeleteBanner = (id: number) => {
    setBanners(banners.filter((banner) => banner.id !== id))
  }

  const handleAddBanner = () => {
    const banner = {
      id: Date.now(),
      ...newBanner,
    }
    setBanners([...banners, banner])
    setNewBanner({
      title: "",
      image: "",
      position: "home-hero",
      link: "",
      isActive: true,
    })
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Banner
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Banner Title</Label>
                <Input
                  id="title"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  placeholder="Enter banner title"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <select
                  id="position"
                  value={newBanner.position}
                  onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="home-hero">Home Hero</option>
                  <option value="home-secondary">Home Secondary</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                value={newBanner.link}
                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                placeholder="Enter link URL"
              />
            </div>
            <div>
              <Label htmlFor="image">Banner Image</Label>
              <div className="mt-2 flex items-center space-x-4">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </Button>
                <span className="text-sm text-gray-500">Recommended size: 1200x400px</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newBanner.isActive}
                onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={handleAddBanner} className="bg-green-600 hover:bg-green-700">
                Add Banner
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    width={200}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                    <p className="text-sm text-gray-600">Position: {banner.position}</p>
                    <p className="text-sm text-gray-600">Link: {banner.link}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={() => handleToggleStatus(banner.id)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <span className="text-sm">{banner.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDeleteBanner(banner.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
