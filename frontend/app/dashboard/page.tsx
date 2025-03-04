"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Building,
  MessageSquare,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Languages,
  Mic,
  Clock,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data
const languageData = [
  { name: "Hindi", value: 40, color: "#3b82f6" },
  { name: "English", value: 30, color: "#10b981" },
  { name: "Marathi", value: 15, color: "#f59e0b" },
  { name: "Telugu", value: 10, color: "#8b5cf6" },
  { name: "Mixed", value: 5, color: "#ec4899" },
]

const conversationData = [
  { month: "Jan", count: 45 },
  { month: "Feb", count: 52 },
  { month: "Mar", count: 48 },
  { month: "Apr", count: 61 },
  { month: "May", count: 55 },
  { month: "Jun", count: 67 },
  { month: "Jul", count: 70 },
]

const recentConversations = [
  {
    id: 1,
    client: "Amit Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    property: "3BHK Apartment in Bandra",
    time: "10:30 AM",
    date: "Today",
    language: "Hindi",
    status: "Follow-up Required",
    keyPoints: ["Interested in 3BHK", "Budget: 1.5-2 Cr", "Needs parking space"],
  },
  {
    id: 2,
    client: "Priya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    property: "2BHK Villa in Andheri",
    time: "Yesterday",
    date: "2:15 PM",
    language: "English/Hindi",
    status: "Interested",
    keyPoints: ["Looking for investment", "Prefers ground floor", "Wants garden area"],
  },
  {
    id: 3,
    client: "Rajesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    property: "Commercial Space in Powai",
    time: "Monday",
    date: "11:45 AM",
    language: "Marathi",
    status: "Scheduled Visit",
    keyPoints: ["Needs 2000 sq ft", "For IT company", "Requires 24/7 access"],
  },
]

const upcomingFollowUps = [
  {
    id: 1,
    client: "Amit Sharma",
    time: "Today, 2:30 PM",
    type: "Call",
    notes: "Discuss financing options",
  },
  {
    id: 2,
    client: "Priya Patel",
    time: "Tomorrow, 11:00 AM",
    type: "Site Visit",
    notes: "Show Andheri properties",
  },
  {
    id: 3,
    client: "Rajesh Kumar",
    time: "Wed, 3:00 PM",
    type: "Meeting",
    notes: "Finalize commercial space requirements",
  },
]

export default function DashboardPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Rahul!</h1>
        <p className="text-muted-foreground">Here's what's happening with your client conversations today.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">348</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    +12.5%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    +4.3%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties Shown</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 inline-flex items-center">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    -2.5%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="mt-2">
                  <Progress value={progress} className="progress-bar" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{progress}% completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Conversation Analytics</CardTitle>
                <CardDescription>Number of client conversations over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>Languages used in client conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {languageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex flex-wrap gap-2">
                  {languageData.map((lang) => (
                    <Badge key={lang.name} style={{ backgroundColor: lang.color }}>
                      {lang.name}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Conversations</CardTitle>
                  <CardDescription>Your latest client interactions</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-start space-x-4 rounded-md p-3 conversation-item">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} alt={conversation.client} />
                        <AvatarFallback>
                          {conversation.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{conversation.client}</p>
                          <div className="flex items-center">
                            <Badge variant="outline" className="ml-2">
                              <Languages className="mr-1 h-3 w-3" />
                              {conversation.language}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{conversation.property}</p>
                        <div className="flex items-center pt-2">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {conversation.date}, {conversation.time}
                          </span>
                          <Badge variant="secondary" className="ml-auto">
                            {conversation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Follow-ups</CardTitle>
                <CardDescription>Scheduled follow-ups with clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingFollowUps.map((followUp) => (
                    <div
                      key={followUp.id}
                      className="flex items-center justify-between space-x-4 rounded-md border p-4 conversation-item"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{followUp.client}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {followUp.time}
                        </div>
                        <p className="text-sm text-muted-foreground">{followUp.notes}</p>
                      </div>
                      <Badge>{followUp.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Follow-up
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Conversations</CardTitle>
              <CardDescription>Manage and analyze all your client conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex flex-col space-y-2 rounded-md border p-4 conversation-item"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} alt={conversation.client} />
                          <AvatarFallback>
                            {conversation.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{conversation.client}</p>
                          <p className="text-sm text-muted-foreground">{conversation.property}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          <Languages className="mr-1 h-3 w-3" />
                          {conversation.language}
                        </Badge>
                        <Badge variant="secondary">{conversation.status}</Badge>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium">Key Points:</p>
                      <ul className="ml-5 mt-1 list-disc text-sm text-muted-foreground">
                        {conversation.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {conversation.date}, {conversation.time}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Mic className="mr-1 h-3 w-3" />
                          Transcript
                        </Button>
                        <Button size="sm">Follow-up</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>View and manage your client information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentConversations.map((client) => (
                  <Card key={client.id} className="card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={client.avatar} alt={client.client} />
                          <AvatarFallback>
                            {client.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{client.client}</CardTitle>
                          <CardDescription className="text-xs">Preferred: {client.language}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Interested in:</span> {client.property}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Status:</span> {client.status}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Requirements:</span>
                          <ul className="ml-5 mt-1 list-disc text-xs text-muted-foreground">
                            {client.keyPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-ups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Management</CardTitle>
              <CardDescription>Track and manage your client follow-ups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Today</h3>
                  <div className="space-y-3">
                    {upcomingFollowUps
                      .filter((f) => f.time.includes("Today"))
                      .map((followUp) => (
                        <div
                          key={followUp.id}
                          className="flex items-center justify-between rounded-md border p-4 conversation-item"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {followUp.type === "Call" ? (
                                <Mic className="h-5 w-5 text-primary" />
                              ) : followUp.type === "Site Visit" ? (
                                <Building className="h-5 w-5 text-primary" />
                              ) : (
                                <Calendar className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{followUp.client}</p>
                              <p className="text-sm text-muted-foreground">{followUp.notes}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge>{followUp.time.split(",")[1]}</Badge>
                            <Button variant="outline" size="sm">
                              Complete
                            </Button>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Upcoming</h3>
                  <div className="space-y-3">
                    {upcomingFollowUps
                      .filter((f) => !f.time.includes("Today"))
                      .map((followUp) => (
                        <div
                          key={followUp.id}
                          className="flex items-center justify-between rounded-md border p-4 conversation-item"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {followUp.type === "Call" ? (
                                <Mic className="h-5 w-5 text-primary" />
                              ) : followUp.type === "Site Visit" ? (
                                <Building className="h-5 w-5 text-primary" />
                              ) : (
                                <Calendar className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{followUp.client}</p>
                              <p className="text-sm text-muted-foreground">{followUp.notes}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge>{followUp.time}</Badge>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New Follow-up
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

