"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Plus } from "lucide-react"

export function PricingManagement() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Company Registration",
      description: "Complete company registration with all legal documentation",
      basePrice: 15000,
      isActive: true,
      features: ["Certificate of Incorporation", "MOA & AOA", "PAN & TAN", "Bank Account Opening Support"],
      category: "Registration",
    },
    {
      id: 2,
      name: "GST Registration",
      description: "GST registration and compliance setup",
      basePrice: 5000,
      isActive: true,
      features: ["GST Certificate", "Return Filing Setup", "Compliance Calendar", "Initial Consultation"],
      category: "Tax & Compliance",
    },
    {
      id: 3,
      name: "Trademark Registration",
      description: "Brand protection through trademark registration",
      basePrice: 25000,
      isActive: true,
      features: ["Trademark Search", "Application Filing", "Response to Objections", "Certificate Issuance"],
      category: "Intellectual Property",
    },
    {
      id: 4,
      name: "Legal Documentation",
      description: "Comprehensive legal document preparation and review",
      basePrice: 10000,
      isActive: true,
      features: ["Contract Drafting", "Agreement Review", "Legal Compliance", "Document Notarization"],
      category: "Legal Services",
    },
  ])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    basePrice: 0,
    features: [""],
    category: "Development",
    isActive: true,
  })

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleSave = (id: number, updatedService: any) => {
    setServices(services.map((service) => (service.id === id ? { ...service, ...updatedService } : service)))
    setEditingId(null)
  }

  const handleToggleStatus = (id: number) => {
    setServices(services.map((service) => (service.id === id ? { ...service, isActive: !service.isActive } : service)))
  }

  const handleAddService = () => {
    const service = {
      id: Date.now(),
      ...newService,
      features: newService.features.filter((f) => f.trim() !== ""),
    }
    setServices([...services, service])
    setNewService({
      name: "",
      description: "",
      basePrice: 0,
      features: [""],
      category: "Development",
      isActive: true,
    })
    setShowAddForm(false)
  }

  const addFeature = () => {
    setNewService({
      ...newService,
      features: [...newService.features, ""],
    })
  }

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...newService.features]
    updatedFeatures[index] = value
    setNewService({
      ...newService,
      features: updatedFeatures,
    })
  }

  const removeFeature = (index: number) => {
    setNewService({
      ...newService,
      features: newService.features.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Registration">Registration</option>
                  <option value="Tax & Compliance">Tax & Compliance</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Legal Services">Legal Services</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Enter service description"
              />
            </div>
            <div>
              <Label htmlFor="basePrice">Base Price (₹)</Label>
              <Input
                id="basePrice"
                type="number"
                value={newService.basePrice}
                onChange={(e) => setNewService({ ...newService, basePrice: Number.parseInt(e.target.value) || 0 })}
                placeholder="Enter base price"
              />
            </div>
            <div>
              <Label>Features</Label>
              {newService.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Enter feature"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature} className="mt-2 bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newService.isActive}
                onCheckedChange={(checked) => setNewService({ ...newService, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={handleAddService} className="bg-green-600 hover:bg-green-700">
                Add Service
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isEditing={editingId === service.id}
            onEdit={() => handleEdit(service.id)}
            onSave={(updatedService) => handleSave(service.id, updatedService)}
            onCancel={() => setEditingId(null)}
            onToggleStatus={() => handleToggleStatus(service.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ServiceCard({ service, isEditing, onEdit, onSave, onCancel, onToggleStatus }: any) {
  const [editData, setEditData] = useState(service)

  const handleSave = () => {
    onSave(editData)
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Service Name</Label>
              <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
            </div>
            <div>
              <Label>Base Price (₹)</Label>
              <Input
                type="number"
                value={editData.basePrice}
                onChange={(e) => setEditData({ ...editData, basePrice: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <Badge variant="outline">{service.category}</Badge>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={service.isActive}
                  onCheckedChange={onToggleStatus}
                  className="data-[state=checked]:bg-green-600"
                />
                <span className="text-sm">{service.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
            <p className="text-gray-600">{service.description}</p>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-600">₹{service.basePrice.toLocaleString()}</span>
              <span className="text-sm text-gray-500">Base Price</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
