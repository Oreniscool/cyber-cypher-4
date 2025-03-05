'use client';

import type React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  addDays,
  isSameDay,
  isSameMonth,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addMonths,
  subMonths,
} from 'date-fns';
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Languages,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Building,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchEvents, createEventFromPrompt } from '@/app/api/api';
// Event types
type EventType = 'appointment' | 'followup';

// Event interface
interface Event {
  id: number;
  title: string;
  client: string;
  date: Date;
  location: string;
  language: string;
  avatar: string;
  attendees: number;
  notes?: string;
  type: EventType;
  status: 'confirmed' | 'pending' | 'rescheduled' | 'cancelled';
}

// Sample data
const initialEvents: Event[] = [
  {
    id: 1,
    title: 'Property Viewing - Luxury Villa',
    client: 'Rahul Sharma',
    date: new Date(2025, 2, 5, 14, 0),
    location: 'Bandra West, Mumbai',
    language: 'Hindi',
    avatar: '/placeholder.svg?height=40&width=40',
    attendees: 3,
    type: 'appointment',
    status: 'confirmed',
    notes:
      'Client is interested in 4BHK properties with sea view. Budget: 5-7 Cr.',
  },
  {
    id: 2,
    title: 'Client Meeting - 2BHK Discussion',
    client: 'Priya Patel',
    date: new Date(2025, 2, 6, 11, 30),
    location: 'Andheri East, Mumbai',
    language: 'Marathi/English',
    avatar: '/placeholder.svg?height=40&width=40',
    attendees: 2,
    type: 'appointment',
    status: 'confirmed',
    notes: 'First-time homebuyer looking for affordable options.',
  },
  {
    id: 3,
    title: 'Commercial Space Tour',
    client: 'Venkat Rao',
    date: new Date(2025, 2, 7, 16, 0),
    location: 'Powai, Mumbai',
    language: 'Telugu',
    avatar: '/placeholder.svg?height=40&width=40',
    attendees: 4,
    type: 'appointment',
    status: 'pending',
    notes: 'Looking for office space for tech startup, 2000-3000 sq ft.',
  },
  {
    id: 4,
    title: 'Follow-up - Loan Documentation',
    client: 'Amit Kumar',
    date: new Date(2025, 2, 8, 10, 0),
    location: 'Juhu, Mumbai',
    language: 'Hindi',
    avatar: '/placeholder.svg?height=40&width=40',
    attendees: 2,
    type: 'followup',
    status: 'pending',
    notes: 'Need to collect income documents for bank loan application.',
  },
  {
    id: 5,
    title: 'Villa Property Discussion',
    client: 'Meera Iyer',
    date: new Date(2025, 2, 9, 15, 30),
    location: 'Lonavala',
    language: 'English',
    avatar: '/placeholder.svg?height=40&width=40',
    attendees: 3,
    type: 'appointment',
    status: 'confirmed',
    notes: 'Weekend home buyer, budget 2-3 Cr.',
  },
  {
    id: 6,
    title: 'Follow-up - Price Negotiation',
    client: 'Sanjay Mehta',
    date: new Date(2025, 2, 10, 13, 0),
    location: 'Worli, Mumbai',
    language: 'Hindi/English',
    avatar: '/placeholder.svg?height=40&width=40',
    attendees: 2,
    type: 'followup',
    status: 'pending',
    notes:
      'Client requested price reduction of 5%. Need to discuss with owner.',
  },
  {
    id: 7,
    title: 'Follow-up - Document Verification',
    client: 'Ananya Desai',
    date: new Date(2025, 2, 11, 11, 0),
    location: 'Bandra West, Mumbai',
    language: 'Marathi',
    avatar: '/placeholder.svg?height=40&width=40',
    attendees: 2,
    type: 'followup',
    status: 'confirmed',
    notes: 'Need to verify property documents and NOCs.',
  },
];

// Function to get dates with events
function getDatesWithEvents(events: Event[]) {
  return events.map((event) => event.date);
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<
    'all' | 'appointments' | 'followups'
  >('all');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [promptLanguage, setPromptLanguage] = useState('en');
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    client: '',
    date: new Date(),
    location: '',
    language: '',
    attendees: 1,
    type: 'appointment',
    status: 'pending',
    notes: '',
  });
  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoadingEvents(true);
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        // Optionally, show an error toast or message
      } finally {
        setIsLoadingEvents(false);
      }
    }

    loadEvents();
  }, []);
  const handleCreateEventFromPrompt = useCallback(async () => {
    if (!promptInput) return;

    try {
      const newEvent = await createEventFromPrompt(promptInput, promptLanguage);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setPromptInput('');
    } catch (error) {
      console.error('Failed to create event from prompt:', error);
      // Optionally, show an error toast or message
    }
  }, [promptInput, promptLanguage]);

  const filteredEvents = useMemo(() => {
    return selectedDate
      ? events.filter((event) => {
          const matchesDate = isSameDay(event.date, selectedDate);
          if (activeTab === 'all') return matchesDate;
          if (activeTab === 'appointments')
            return matchesDate && event.type === 'appointment';
          if (activeTab === 'followups')
            return matchesDate && event.type === 'followup';
          return false;
        })
      : [];
  }, [selectedDate, events, activeTab]);

  const handleAddEvent = useCallback(() => {
    if (!newEvent.title || !newEvent.client || !newEvent.date) return;

    const event: Event = {
      id: events.length + 1,
      title: newEvent.title || '',
      client: newEvent.client || '',
      date: newEvent.date || new Date(),
      location: newEvent.location || '',
      language: newEvent.language || '',
      attendees: newEvent.attendees || 1,
      avatar: '/placeholder.svg?height=40&width=40',
      type: newEvent.type || 'appointment',
      status: newEvent.status || 'pending',
      notes: newEvent.notes,
    };

    setEvents((prevEvents) => [...prevEvents, event]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      client: '',
      date: new Date(),
      location: '',
      language: '',
      attendees: 1,
      type: 'appointment',
      status: 'pending',
      notes: '',
    });
  }, [newEvent, events]);

  const handleUpdateEvent = useCallback(() => {
    if (!selectedEvent) return;

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id ? selectedEvent : event
      )
    );
    setIsEditEventOpen(false);
    setSelectedEvent(null);
  }, [selectedEvent]);

  const handleDeleteEvent = useCallback((id: number) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    setIsEditEventOpen(false);
    setSelectedEvent(null);
  }, []);

  const openEditDialog = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsEditEventOpen(true);
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth, 1));
  }, [currentMonth]);

  const prevMonth = useCallback(() => {
    setCurrentMonth(subMonths(currentMonth, 1));
  }, [currentMonth]);

  const onDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
  }, []);

  const renderCalendarCell = useCallback(
    (date: Date) => {
      const dayEvents = events.filter((event) => isSameDay(event.date, date));
      const isCurrentMonth = isSameMonth(date, currentMonth);

      return (
        <div className={`p-2 ${isCurrentMonth ? '' : 'opacity-50'}`}>
          <div className="text-center">{format(date, 'd')}</div>
          {dayEvents.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1 justify-center">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full ${
                    event.type === 'appointment' ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{dayEvents.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
    [events, currentMonth]
  );

  return (
    <div>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments and follow-ups with clients
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Calendar View */}
          <Card className="md:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div
                      key={day}
                      className="bg-background p-2 text-center font-medium"
                    >
                      {day}
                    </div>
                  )
                )}
                {eachDayOfInterval({
                  start: startOfWeek(startOfMonth(currentMonth)),
                  end: endOfWeek(endOfMonth(currentMonth)),
                }).map((date) => (
                  <button
                    key={date.toISOString()}
                    className={`bg-background ${
                      isSameDay(date, selectedDate || new Date())
                        ? 'ring-2 ring-primary'
                        : ''
                    }`}
                    onClick={() => onDateSelect(date)}
                  >
                    {renderCalendarCell(date)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event List and Quick Actions */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Events
                </span>
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? format(selectedDate, 'MMMM d, yyyy')
                  : 'Select a date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={(value) => setActiveTab(value as any)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="followups">Follow-ups</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[400px] mt-4">
                  {filteredEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        No events for this day
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.map((event, index) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onEdit={() => openEditDialog(event)}
                          onDelete={() => handleDeleteEvent(event.id)}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Create Event from Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Select value={promptLanguage} onValueChange={setPromptLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="mr">Marathi</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Describe your event in natural language"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
            />
            <Button
              onClick={handleCreateEventFromPrompt}
              disabled={!promptInput || isLoadingEvents}
            >
              Create Event
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details of this event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventForm
              event={selectedEvent}
              onEventChange={setSelectedEvent}
              onSubmit={handleUpdateEvent}
              onCancel={() => setIsEditEventOpen(false)}
              onDelete={() => handleDeleteEvent(selectedEvent.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 p-4 rounded-lg border ${
        event.type === 'appointment'
          ? 'border-primary/20'
          : 'border-secondary/20'
      }`}
    >
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            event.type === 'appointment'
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary/10 text-secondary'
          }`}
        >
          {event.type === 'appointment' ? (
            <Building className="h-6 w-6" />
          ) : (
            <ArrowRight className="h-6 w-6" />
          )}
        </div>
        <div className="mt-2 text-xs font-medium text-center">
          {format(event.date, 'h:mm a')}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium flex items-center">
              {event.title}
              <Badge
                variant={
                  event.status === 'confirmed'
                    ? 'default'
                    : event.status === 'pending'
                    ? 'outline'
                    : event.status === 'rescheduled'
                    ? 'secondary'
                    : 'destructive'
                }
                className="ml-2"
              >
                {event.status}
              </Badge>
            </h3>
            <p className="text-sm font-medium flex items-center gap-1">
              <img
                src={event.avatar || '/placeholder.svg'}
                alt={event.client}
                className="w-4 h-4 rounded-full object-cover"
              />
              {event.client}
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <Button
                variant="ghost"
                onClick={onEdit}
                className="w-full justify-start"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={onDelete}
                className="w-full justify-start text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        {event.notes && (
          <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {event.location}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {event.attendees} attendees
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Languages className="h-3 w-3 mr-1" />
            {event.language}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface EventFormProps {
  event: Partial<Event>;
  onEventChange: (event: Partial<Event>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

function EventForm({
  event,
  onEventChange,
  onSubmit,
  onCancel,
  onDelete,
}: EventFormProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    if (event.date) {
      newDate.setHours(event.date.getHours());
      newDate.setMinutes(event.date.getMinutes());
    }
    onEventChange({ ...event, date: newDate });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = event.date ? new Date(event.date) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onEventChange({ ...event, date: newDate });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-type" className="text-right">
            Type
          </Label>
          <Select
            value={event.type}
            onValueChange={(value) =>
              onEventChange({ ...event, type: value as EventType })
            }
          >
            <SelectTrigger id="event-type" className="col-span-3">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="followup">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            value={event.title}
            onChange={(e) => onEventChange({ ...event, title: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="client" className="text-right">
            Client
          </Label>
          <Input
            id="client"
            value={event.client}
            onChange={(e) =>
              onEventChange({ ...event, client: e.target.value })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            Date & Time
          </Label>
          <div className="col-span-3 flex gap-2">
            <Input
              id="date"
              type="date"
              value={event.date ? format(event.date, 'yyyy-MM-dd') : ''}
              onChange={handleDateChange}
              className="flex-1"
            />
            <Input
              id="time"
              type="time"
              value={event.date ? format(event.date, 'HH:mm') : ''}
              onChange={handleTimeChange}
              className="w-24"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <Input
            id="location"
            value={event.location}
            onChange={(e) =>
              onEventChange({ ...event, location: e.target.value })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="language" className="text-right">
            Language
          </Label>
          <Input
            id="language"
            value={event.language}
            onChange={(e) =>
              onEventChange({ ...event, language: e.target.value })
            }
            className="col-span-3"
            placeholder="Hindi, English, etc."
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="attendees" className="text-right">
            Attendees
          </Label>
          <Input
            id="attendees"
            type="number"
            min="1"
            value={event.attendees}
            onChange={(e) =>
              onEventChange({
                ...event,
                attendees: Number.parseInt(e.target.value),
              })
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={event.status}
            onValueChange={(value) =>
              onEventChange({ ...event, status: value as any })
            }
          >
            <SelectTrigger id="status" className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="notes" className="text-right pt-2">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={event.notes}
            onChange={(e) => onEventChange({ ...event, notes: e.target.value })}
            className="col-span-3"
            rows={3}
          />
        </div>
      </div>
      <DialogFooter className="flex justify-between">
        {onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete Event
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{event.id ? 'Update' : 'Add'} Event</Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function eachDayOfInterval(interval: { start: Date; end: Date }) {
  const days = [];
  let currentDate = interval.start;
  while (currentDate <= interval.end) {
    days.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return days;
}
