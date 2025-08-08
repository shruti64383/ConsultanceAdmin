"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Eye, FileText, Phone, Mail, MapPin, Calendar, User, CreditCard, Clock, Loader2, Edit, X, AlertCircle, CheckCircle} from "lucide-react"

interface CustomerDetailsProps {
  email: String
  onBack: () => void
}

interface Customers {
  customerId: Number;
  name: string;
  email: string;
  phone: string;
  services: string[];
  totalSpent: Number;
  date: Date;
  status: string;
  priority: string; 
}

interface Documents { 
  documentId: Number;  
  name: String;
  customerEmail: String;
  data: ArrayBuffer;
  contentType: string;
  size: Number; 
  status: String;
  date: Date;
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
    uploadedDocuments: Documents[]
} 

export function CustomerDetails({ email, onBack }: CustomerDetailsProps) {
  const [customer, setCustomer] = useState<Customers | null>(null);
  const [services, setServices] = useState<Services[]>([]);
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [actionLoading, setActionLoading] = useState<String | null>(null)
  const [docs, setDocs] = useState<Documents | null>(null);
  const [editingDocStatus, setEditingDocStatus] = useState<Number | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
      fetchCustomer();
      fetchServices();
      fetchDocuments();
      fetch('/documents') // Endpoint to fetch all PDFs
      .then(res => res.json())
      .then(data => setDocs(data));
  }, [])

    interface HandleDownload {
      (documentId: number): void;
    }

    const handleDownload: HandleDownload = (documentId) => {
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/download/${documentId}`, '_blank');
    };

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        //window.alert("Dhund rha customer for Email: " + email)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/details/${email}`);

        if (!response.ok) {
          //window.alert(`ni mila customer ${response.status}` + JSON.stringify(response))
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Match the structure from your backend response
        if (result.success) {
          setCustomer(result.data); // Assuming result.data contains the array of customers
          console.log("Fetched customer:", result.data);
        } else {
          console.error("Backend returned success:false", result.message);
          setCustomer(null); // Set empty array on backend failure
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        setCustomer(null); // Ensure customer is always an array
      } finally {
        setLoading(false);
      }
    }; 

    const fetchServices = async () => {
      try {
        setLoading(true);
        //window.alert("Fetching services for Email: " + email)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/get/${email}`);

        if (!response.ok) {
          //window.alert("Kuch ni mila")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const result = await response.json();
      
        // Match the structure from your backend response
        if (result.success) {
          //window.alert("RESULTS customerEmail: " +email+ " result: " + JSON.stringify(result.data))
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

    const fetchDocuments = async () => {
          try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${email}`);
          
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          
            const result = await response.json();
          
            // Match the structure from your backend response
            if (result.success) {
              setDocuments(result.data); // Assuming result.data contains the array of docs
              console.log("Fetched Documents:", result.data);
            } else {
              console.error("Backend returned success:false", result.message);
              setDocuments([]); // Set empty array on backend failure
            }    
          } catch (error) {
            console.error('Error fetching docs:', error);
            setDocuments([]); // Ensure docs is always an array
          } finally {
            setLoading(false);
          }
        };
    

    const handleStatusChange = async (documentId: Number, newStatus: string) => {
    try {
      setActionLoading(documentId.toLocaleString())
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/status/${documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, documentId: documentId }),
      })

      if (response.ok) {
        setDocuments(documents.map((doc) => (doc.documentId === documentId ? { ...doc, status: newStatus } : doc)))
        toast({
          title: "Success",
          description: "Document status updated successfully.",
        })
      } else {
        throw new Error("Failed to update document status")
      }
    } catch (error) {
      console.error("Error updating document status:", error)
      // Update locally even if API fails (for demo purposes)
      setDocuments(documents.map((doc) => (doc.documentId === documentId ? { ...doc, status: newStatus } : doc)))
      toast({
        title: "Updated",
        description: "Lead status updated (demo mode).",
      })
    } finally {
      setActionLoading(null)
      setEditingDocStatus(null) // Reset editing state after update
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getDocStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "under review":
        return "bg-yellow-100 text-yellow-800"
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending review":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (customer === null) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      <span className="ml-2 text-gray-700">Loading customer data...</span>
    </div>
  );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Customer ID: {customer.customerId.toLocaleString()}</p>
          </div>
        </div>
        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
      </div>

      {/* Customer Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <User className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{customer.services.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold">{customer.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Query Open Since</p>
                <p className="text-2xl font-bold">{new Date(customer.date).toISOString().split('T')[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            {/* <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{customer.address}</p>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {services.map((service) => (
            <Card key={service.serviceId.toLocaleString()}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-600">Service ID: {service.serviceId.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(service.startDate).toISOString().split('T')[0]}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.requiredDocuments.map((doc, index) => (
                        <Badge key={index} variant="outline">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                    <p className="text-lg font-bold">{service.price.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Card key={document.documentId.toLocaleString()}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{document.name}</h4>
                      {/* <p className="text-sm text-gray-600">{document.type}</p> */}
                      <p className="text-xs text-gray-500">Uploaded: {new Date(document.date).toISOString().split('T')[0]}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {/* Status Management */}
                        {editingDocStatus === document.documentId ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={document.status.toLocaleString()}
                              onChange={(e) => handleStatusChange(document.documentId, e.target.value)}
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                              <option value="pending">Pending</option>
                               
                            </select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingDocStatus(null)} 
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          ) : (
                          <div className="flex items-center space-x-1">
                            <Badge
                              className={`cursor-pointer ${getDocStatusColor(document.status.toLocaleString())}`}
                              onClick={() => setEditingDocStatus(document.documentId)}
                            >
                              {document.status} 
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingDocStatus(document.documentId)}
                              className="h-6 w-6 p-0"
                            >
                               <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        {/* <Badge className={getDocStatusColor(document.status.toLocaleString())}>{document.status}</Badge> */}
                      </div>
                      {/* <Badge className={getStatusColor(document.status.toLocaleString())}>{document.status}</Badge> */}
                      <div className="flex space-x-2">
                        {/* <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button> */}
                        <Button onClick={() => handleDownload(Number(document.documentId))} variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          {/* {customer.communications.map((comm) => (
            <Card key={comm.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{comm.type}</Badge>
                      <h4 className="font-medium">{comm.subject}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{comm.content}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{comm.date}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(comm.status)}>{comm.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))} */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
