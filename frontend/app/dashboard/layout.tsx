"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import {
  Home,
  MessageSquare,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Building,
  Mic,
  Languages,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Conversations", icon: MessageSquare, path: "/dashboard/conversations" },
    { name: "Clients", icon: Users, path: "/dashboard/clients" },
    { name: "Properties", icon: Building, path: "/dashboard/properties" },
    { name: "Voice Calls", icon: Mic, path: "/dashboard/voice-calls" },
    { name: "Translations", icon: Languages, path: "/dashboard/translations" },
    { name: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
    { name: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden min-w-full">
        <Sidebar variant="inset" className="fade-in">
          <SidebarHeader className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2">
              <Building className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold tracking-tight">RealTalk</h1>
                <p className="text-xs text-sidebar-foreground/70">Communication Assistant</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.path}
                    tooltip={item.name}
                    className="flex items-center"
                  >
                    <a href={item.path} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/help" className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Help & Support</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/logout" className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Logout</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
            <div className="flex flex-1 items-center gap-4">
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <ModeToggle />
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="fade-in">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

