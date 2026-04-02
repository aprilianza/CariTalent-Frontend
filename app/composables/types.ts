export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type TalentProfile = {
  id: number;
  stage_name: string;
  genre: string[];
  verified: boolean;
  average_rating: number;
};

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export type BookingStatus = 'confirmed' | 'completed';

export type EventStatus = 'draft' | 'open' | 'closed' | 'completed' | 'cancelled';

export type Application = {
  id: number;
  source?: 'apply' | 'invitation';
  event: {
    id?: number;
    title: string;
    event_date?: string;
    venue_name?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  proposed_price: number;
  status: ApplicationStatus;
  created_at?: string;
};

export type Invitation = {
  id: number;
  event: {
    id?: number;
    title: string;
    event_date?: string;
    venue_name?: string;
    city?: string;
    budget?: number;
    latitude?: number;
    longitude?: number;
  };
  organizer_name: string;
  offered_price: number;
  status: InvitationStatus;
  created_at?: string;
};

export type Booking = {
  id: number;
  source?: 'apply' | 'invitation';
  event: {
    id?: number;
    title: string;
    event_date: string;
    venue_name: string;
    latitude?: number;
    longitude?: number;
  };
  agreed_price?: number;
  status: BookingStatus;
  created_at?: string;
};

export type Event = {
  id: number;
  organizer_id?: number;
  organizer_name?: string;
  title: string;
  description?: string;
  genre_needed?: string[];
  budget: number;
  event_date: string;
  venue_name: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  status: EventStatus;
  created_at?: string;
};

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type MyApplicationsData = {
  applications: Application[];
};

export type MyInvitationsData = {
  invitations: Invitation[];
};

export type MyBookingsData = {
  bookings: Booking[];
};

export type EventsData = {
  events: Event[];
  pagination?: PaginationMeta;
};
