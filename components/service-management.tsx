"use client"

import { useState, ChangeEvent, useEffect} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Loader2
} from "lucide-react"

interface ServiceManagementProps {
  customerId: Number
  customerName: string
  onBack: () => void
}

interface Document {
  name: string;
  status: string;
  uploadDate: string;
}

interface Services{
    serviceId: Number,
    customerId: Number,
    progress: Number,
    name: string,
    price: Number,
    status: string,
    startDate: Date,
    completedDate: Date,
    description: string,
    requiredDocuments: string[],
    certificates: string[],
    uploadedDocuments: Document[]
} 
  
    

export function ServiceManagement({ customerId, customerName, onBack }: ServiceManagementProps) {
  const [services, setServices] = useState<Services[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useState([
  //   {
  //     id: "SRV001",
  //     name: "Company Registration",
  //     price: 15000,
  //     status: "completed",
  //     startDate: "2024-12-15",
  //     completedDate: "2024-12-25",
  //     description: "Private Limited Company registration with all legal documentation",
  //     requiredDocuments: [
  //       "PAN Card of Directors",
  //       "Aadhaar Card of Directors",
  //       "Address Proof",
  //       "Bank Statement",
  //       "Passport Size Photos",
  //     ],
  //     certificates: [
  //       "Certificate of Incorporation",
  //       "Memorandum of Association (MOA)",
  //       "Articles of Association (AOA)",
  //       "PAN Card of Company",
  //       "TAN Certificate",
  //     ],
  //     uploadedDocuments: [
  //       { name: "PAN Card - Director 1", status: "verified", uploadDate: "2024-12-15" },
  //       { name: "Aadhaar Card - Director 1", status: "verified", uploadDate: "2024-12-15" },
  //       { name: "Address Proof", status: "verified", uploadDate: "2024-12-16" },
  //     ],
  //   },
  //   {
  //     id: "SRV002",
  //     name: "GST Registration",
  //     price: 5000,
  //     status: "in_progress",
  //     startDate: "2025-01-05",
  //     description: "GST registration and compliance setup",
  //     requiredDocuments: [
  //       "Company Registration Certificate",
  //       "Bank Account Details",
  //       "Address Proof of Business",
  //       "Identity Proof of Authorized Signatory",
  //     ],
  //     certificates: ["GST Registration Certificate", "GST Login Credentials"],
  //     uploadedDocuments: [
  //       { name: "Company Certificate", status: "verified", uploadDate: "2025-01-05" },
  //       { name: "Bank Details", status: "pending", uploadDate: "2025-01-06" },
  //     ],
  //   },
  // ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<Number | null>(null)
  const [loading, setLoading] = useState(true)
  const [newService, setNewService] = useState({
    name: "",
    price: 0,
    description: "",
    requiredDocuments: [""],
    certificates: [""],
  })

  const [errors, setErrors] = useState({
            name: "",
            price: 0,
            description: "",
            requiredDocuments: [""],
            certificates: [""]
  })

  const { toast } = useToast()

  useEffect(() => {
      fetchServices()
    }, [])

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${customerId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const result = await response.json();
      
        // Match the structure from your backend response
        if (result.success) {
          setServices(result.data); // Assuming result.data contains the array of services
          console.log("Fetched services:", result.data);
        } else {
          console.error("Backend returned success:false", result.message);
          setServices([]); // Set empty array on backend failure
        }    
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]); // Ensure services is always an array
      } finally {
        setLoading(false);
      }
    };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewService(prev => ({
          ...prev,
          [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
  }

  const handleAddService = async (e: React.FormEvent) => { 
      e.preventDefault();
      setIsSubmitting(true);
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${customerId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newService),
            });
    
            if (response.ok) {
               //window.alert('Service added successfully');
            } else {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Submission failed');
            }
          } catch (error: unknown) {
            let errorMessage = 'Failed to submit inquiry';
      
            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (typeof error === 'string') {
              errorMessage = error;
            }
             console.error('Submission error:', error);
             setErrors(prev => ({ ...prev, form: errorMessage }));
          } finally {
            setShowAddForm(false)
            setIsSubmitting(false);   
            setNewService({
    name: "",
    price: 0,
    description: "",
    requiredDocuments: [""],
    certificates: [""],
  });     
          fetchServices();
          }
         
    };
  
  // (customerId: Number) => {
  //   const service = {
  //     id: `SRV${String(services.length + 1).padStart(3, "0")}`,
  //     ...newService,
  //     startDate: new Date().toISOString().split("T")[0],
  //     requiredDocuments: newService.requiredDocuments.filter((doc) => doc.trim() !== ""),
  //     certificates: newService.certificates.filter((cert) => cert.trim() !== ""),
  //     uploadedDocuments: [],
  //   }

  //   setServices([...services, service])
  //   setNewService({
  //     name: "",
  //     price: 0,
  //     description: "",
  //     requiredDocuments: [""],
  //     certificates: [""],
  //     status: "not_started",
  //   })
  //   setShowAddForm(false)

  //   toast({
  //     title: "Success",
  //     description: "Service added successfully!",
  //   })
  // }

  const handleUpdateServiceStatus = async (serviceId: Number, newStatus: string) => {
    try{
      setActionLoading(serviceId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/status/${serviceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus}),
      })

      if(response.ok){
        //window.alert("Service status updated successfully");
        setServices(services.map((service) => 
          service.serviceId === serviceId ? { ...service, status: newStatus } : service
        ))
        toast({
          title: "Success",
          description: "Service status updated successfully",
        })
      }  else{
        //window.alert(`Failed to update service status ${response.statusText}`);
        throw new Error("Failed to update service status")
      }
    }catch (error) {
      console.error("Error updating service status:", error)
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      })
    }finally {
       setActionLoading(null)
    }     
  }

  const handleDeleteService = async (serviceId: Number) => {
    try {
      setActionLoading(serviceId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${customerId}/delete/${serviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setServices(services.filter((service) => service.serviceId !== serviceId))
        toast({
          title: "Success",
          description: "Service deleted successfully",
        })
      } else {
        throw new Error("Failed to delete service")
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      // Delete locally even if API fails (for demo purposes)
      setServices(services.filter((service) => service.serviceId !== serviceId))
      toast({
        title: "Deleted",
        description: "Service deleted (demo mode).",
      })
    }finally{
      setActionLoading(null)
    }
  }

  const addDocumentField = (type: "requiredDocuments" | "certificates") => {
    setNewService({
      ...newService,
      [type]: [...newService[type], ""],
    })
  }

  const updateDocumentField = (type: "requiredDocuments" | "certificates", index: number, value: string) => {
    const updated = [...newService[type]]
    updated[index] = value
    setNewService({
      ...newService,
      [type]: updated,
    })
  }

  const removeDocumentField = (type: "requiredDocuments" | "certificates", index: number) => {
    setNewService({
      ...newService,
      [type]: newService[type].filter((_, i) => i !== index),
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "under review":
        return "bg-yellow-100 text-yellow-800"
      case "not started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in progress":
        return <Clock className="w-4 h-4" />
      case "under review":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
            ← Back to Customers
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">
            Customer: {customerName} (ID: {String(customerId)})
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Service Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              <p className="text-sm text-gray-600">Total Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {services.filter((s) => s.status === "completed").length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {services.filter((s) => s.status === "in progress").length}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                ₹{services.reduce((total, service) => total + Number(service.price), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <form onSubmit={handleAddService}>
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newService.name}
                  // onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  onChange={handleChange}
                  placeholder="Enter service name"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newService.price}
                  // onChange={(e) => setNewService({ ...newService, price: Number.parseInt(e.target.value) || 0 })}
                  onChange={handleChange}
                  placeholder="Enter price"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Service Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newService.description}
                // onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                onChange={handleChange}
                placeholder="Describe the service details"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label>Required Documents</Label>
              {newService.requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    //name={`requiredDocuments[${index}]`}
                    value={doc}
                    // onChange={(e) => updateDocumentField("requiredDocuments", index, e.target.value) }
                    onChange={(e) => {
                      updateDocumentField("requiredDocuments", index, e.target.value);
                      handleChange(e);
                    }}
                    placeholder="Enter required document"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDocumentField("requiredDocuments", index)}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addDocumentField("requiredDocuments")}
                className="mt-2"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            </div>

            <div>
              <Label>Certificates/Deliverables</Label>
              {newService.certificates.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    //name={`certificates[${index}]`}
                    value={cert}
                    // onChange={(e) => updateDocumentField("certificates", index, e.target.value)}
                    onChange={(e) => {
                      updateDocumentField("certificates", index, e.target.value);
                      handleChange(e);
                   }}
                    placeholder="Enter certificate/deliverable"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDocumentField("certificates", index)}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addDocumentField("certificates")}
                className="mt-2"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certificate
              </Button>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              {/* <Button onClick={() => handleAddService(customerId)} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Add Service
              </Button> */}
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Add Service
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
        </form>
      )}

      {/* Services List */}
      <div className="space-y-6">
        {services.map((service) => (
          <Card key={service.serviceId.toLocaleString()} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Service ID: {service.serviceId.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(service.status)}>
                    {getStatusIcon(service.status)}
                    <span className="ml-1">{service.status}</span>
                  </Badge>
                  <div className="flex items-center text-green-600 font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    {service.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Description:</p>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Documents:</p>
                  <div className="space-y-1">
                    {service.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Certificates/Deliverables:</p>
                  <div className="space-y-1">
                    {service.certificates.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-sm text-gray-600">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Document Upload Status */}
              {service.uploadedDocuments && service.uploadedDocuments.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</p>
                  <div className="space-y-2">
                    {service.uploadedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              doc.status === "verified"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {doc.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{doc.uploadDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Timeline */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Started:</span> {new Date(service.startDate).toISOString().split('T')[0]}
                </div>
                {service.completedDate && (
                  <div>
                    <span className="font-medium">Completed:</span> {service.completedDate 
                      ? new Date(service.completedDate).toISOString().split('T')[0] 
                      : "00-00-0000"}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <select
                    value={service.status}
                    onChange={(e) => handleUpdateServiceStatus(service.serviceId, e.target.value)}
                    disabled={actionLoading === service.serviceId}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not started">Not Started</option>
                    <option value="in progress">In Progress</option>
                    <option value="under review">Under Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  {/* <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Service
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Manage Documents
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDeleteService(service.serviceId)}
                    disabled={actionLoading === service.serviceId}
                  >
                    {actionLoading === service.serviceId ? (
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

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📋 Service Management Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>
            <strong>Add Service:</strong> Click "Add New Service" to create custom services with pricing
          </p>
          <p>
            <strong>Set Price:</strong> Define service cost in rupees
          </p>
          <p>
            <strong>Required Documents:</strong> List all documents customer needs to provide
          </p>
          <p>
            <strong>Certificates:</strong> Specify what deliverables customer will receive
          </p>
          <p>
            <strong>Status Management:</strong> Track progress from Not Started → In Progress → Under Review → Completed
          </p>
          <p>
            <strong>Document Tracking:</strong> Monitor uploaded documents and verification status
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
