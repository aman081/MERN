import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    branch: '',
    game: ''
  });

  // Fetch events
  const fetchEvents = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();
      
      const response = await api.get(`/events?${queryParams}`);
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Get single event
  const getEvent = async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
      return null;
    }
  };

  // Create event (admin only)
  const createEvent = async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      toast.success('Event created successfully!');
      fetchEvents(); // Refresh events list
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update event (admin only)
  const updateEvent = async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      toast.success('Event updated successfully!');
      fetchEvents(); // Refresh events list
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete event (admin only)
  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully!');
      fetchEvents(); // Refresh events list
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update event status (admin only)
  const updateEventStatus = async (id, status) => {
    try {
      const response = await api.patch(`/events/${id}/status`, { status });
      toast.success(`Event status updated to ${status}!`);
      fetchEvents(); // Refresh events list
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event status';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Add winners to event (admin only)
  const addWinners = async (id, payload) => {
    try {
      const response = await api.patch(`/events/${id}/winners`, payload);
      toast.success('Winners added successfully!');
      fetchEvents(); // Refresh events list
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add winners';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Filter events
  const filterEvents = (newFilters) => {
    setFilters(newFilters);
    fetchEvents(newFilters);
  };

  // Get events by status
  const getEventsByStatus = (status) => {
    return events.filter(event => event.status === status);
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    return getEventsByStatus('Upcoming');
  };

  // Get active events
  const getActiveEvents = () => {
    return getEventsByStatus('Active');
  };

  // Get concluded events
  const getConcludedEvents = () => {
    return getEventsByStatus('Concluded');
  };

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const value = {
    events,
    loading,
    filters,
    fetchEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    addWinners,
    filterEvents,
    getEventsByStatus,
    getUpcomingEvents,
    getActiveEvents,
    getConcludedEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 