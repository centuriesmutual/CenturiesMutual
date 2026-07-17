interface Event {
  id: number;
  title: string;
  time: string;
  date: string;
  type: 'meeting' | 'review' | 'event';
  createdAt: string;
  updatedAt: string;
}

interface CreateEventData {
  title: string;
  time: string;
  date: string;
  type: 'meeting' | 'review' | 'event';
}

interface UpdateEventData {
  id: number;
  title?: string;
  time?: string;
  date?: string;
  type?: 'meeting' | 'review' | 'event';
}

class EventService {
  private baseUrl = '/api/events';

  // Get all events
  async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Create a new event
  async createEvent(eventData: CreateEventData): Promise<Event | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();
      return data.event;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  // Update an existing event
  async updateEvent(eventData: UpdateEventData): Promise<Event | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const data = await response.json();
      return data.event;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  // Delete an event
  async deleteEvent(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  // Format date for display
  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  // Convert date to YYYY-MM-DD format for storage
  formatDateForStorage(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

export const eventService = new EventService();
export type { Event, CreateEventData, UpdateEventData };
