'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Define conversation types
interface User {
  id: string;
  name: string;
  lastMessage: string;
  avatarSrc?: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export default function ConversationsPage() {
  // Initial users
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user1',
      name: 'UserRaj54',
      lastMessage: 'Looking for a 2BHK in Mumbai',
      avatarSrc: '/api/placeholder/40/40?text=RJ',
    },
  ]);

  // Initial messages for the selected conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'UserRaj54',
      content: `Location: Mumbai  
Type: 2-bedroom apartment  
Budget: 1.5 crore  
Preferences:  
- Ready-to-move  
- Near schools  
- Gym in complex  
- High floor with a nice view  
Query: Can you help find a suitable property?`,
      timestamp: '2 mins ago',
    },
  ]);

  // State for selected user
  const [selectedUser, setSelectedUser] = useState<User | null>(users[0]);

  return (
    <div className="flex h-[calc(100vh-100px)] max-w-6xl mx-auto">
      {/* Users Sidebar */}
      <Card className="w-1/4 mr-4">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-3 hover:bg-accent cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <Avatar className="mr-3">
                  <AvatarImage src={user.avatarSrc} alt={user.name} />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Conversation Area */}
      <Card className="w-3/4 flex flex-col">
        {selectedUser && (
          <>
            <CardHeader className="flex flex-row items-center">
              <Avatar className="mr-3">
                <AvatarImage
                  src={selectedUser.avatarSrc}
                  alt={selectedUser.name}
                />
                <AvatarFallback>
                  {selectedUser.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{selectedUser.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Property Search Inquiry
                </p>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="flex-grow overflow-auto">
              <ScrollArea className="h-[500px] pr-4">
                {messages.map((message) => (
                  <div key={message.id} className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">
                        {message.sender}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                    <Card className="p-3 bg-muted">
                      <pre className="whitespace-pre-wrap font-sans">
                        {message.content}
                      </pre>
                    </Card>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
