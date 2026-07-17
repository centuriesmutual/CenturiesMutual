import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

interface Event {
  id: number;
  title: string;
  time: string;
  date: string;
  type: 'meeting' | 'review' | 'event';
  createdAt: string;
  updatedAt: string;
}

interface Database {
  events: Event[];
  nextId: number;
}

// Helper function to read database
function readDatabase(): Database {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty database
    return { events: [], nextId: 1 };
  }
}

// Helper function to write database
function writeDatabase(db: Database): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Failed to save event');
  }
}

// GET /api/events - Get all events
export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json({ events: db.events });
  } catch (error) {
    console.error('Error reading events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, time, date, type } = body;

    // Validate required fields
    if (!title || !time || !date || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = readDatabase();
    
    // Create new event
    const newEvent: Event = {
      id: db.nextId,
      title,
      time,
      date,
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add event to database
    db.events.push(newEvent);
    db.nextId++;

    // Save to file
    writeDatabase(db);

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT /api/events - Update an existing event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, time, date, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const db = readDatabase();
    const eventIndex = db.events.findIndex(event => event.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Update event
    db.events[eventIndex] = {
      ...db.events[eventIndex],
      title: title || db.events[eventIndex].title,
      time: time || db.events[eventIndex].time,
      date: date || db.events[eventIndex].date,
      type: type || db.events[eventIndex].type,
      updatedAt: new Date().toISOString()
    };

    writeDatabase(db);

    return NextResponse.json({ event: db.events[eventIndex] });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events - Delete an event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const db = readDatabase();
    const eventIndex = db.events.findIndex(event => event.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Remove event
    const deletedEvent = db.events.splice(eventIndex, 1)[0];
    writeDatabase(db);

    return NextResponse.json({ event: deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
