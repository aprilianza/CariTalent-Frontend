export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type TalentMediaType = 'image' | 'video' | 'audio';

export type TalentMedia = {
  id: number;
  media_url: string;
  type: TalentMediaType;
};

export type TalentProfile = {
  id: number;
  talent_id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'eo' | 'talent';
  stage_name: string;
  genre: string[];
  verified: boolean;
  average_rating: number;
  media?: TalentMedia[];
};

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export type BookingStatus = 'confirmed' | 'completed';

export type EventStatus = 'draft' | 'open' | 'closed' | 'completed' | 'cancelled';

export type TalentReviewItem = {
  id: number;
  organizer_name: string;
  event_title: string;
  rating: number;
  comment: string;
  created_at?: string;
};

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


// ─── EO-specific types ────────────────────────────────────────────────────────

export type Genre = {
  id: number;
  name: string;
};

export type EoEvent = Event & {
  total_applicants?: number;
};

export type TalentSummary = {
  id: number;
  stage_name: string;
  genre: string[];
  city?: string;
  verified: boolean;
  average_rating: number;
};

export type EoApplication = {
  id: number;
  talent: TalentSummary;
  source: 'apply' | 'invitation';
  message?: string;
  proposed_price: number;
  status: ApplicationStatus;
  created_at?: string;
};

export type EoBooking = {
  id: number;
  application_id: number;
  source?: 'apply' | 'invitation';
  event: {
    id: number;
    title: string;
    event_date: string;
    venue_name: string;
    latitude?: number;
    longitude?: number;
  };
  talent: {
    id: number;
    stage_name: string;
  };
  agreed_price: number;
  status: BookingStatus;
  created_at?: string;
};

export type ScoreBreakdown = {
  genre_score: number;
  budget_score: number;
  location_score: number;
};

export type TalentRecommendation = {
  rank: number;
  score: number;
  score_breakdown: ScoreBreakdown;
  talent: TalentSummary;
};

export type MyEoEventsData = {
  events: EoEvent[];
  pagination?: PaginationMeta;
};

export type EventApplicationsData = {
  applications: EoApplication[];
};

export type MyEoBookingsData = {
  bookings: EoBooking[];
};

export type RecommendationsData = {
  event_id: number;
  event_title: string;
  recommendations: TalentRecommendation[];
};

export type GenresData = {
  genres: Genre[];
};

// ─── Payload types ────────────────────────────────────────────────────────────

export type CreateEventPayload = {
  title: string;
  description: string;
  genre_ids: number[];
  budget: number;
  event_date: string;
  venue_name: string;
  latitude?: number;
  longitude?: number;
  city: string;
  status: EventStatus;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;

export type UpdateApplicationStatusPayload = {
  status: 'accepted' | 'rejected';
  agreed_price?: number;
};

export type SendInvitationPayload = {
  event_id: number;
  talent_id: number;
  offered_price: number;
};

export type CreateReviewPayload = {
  booking_id: number;
  rating: number;
  comment: string;
};
export type TalentReviewsData = {
  talent_id: number;
  stage_name: string;
  average_rating: number;
  total_reviews: number;
  reviews: TalentReviewItem[];
  pagination?: PaginationMeta;
};
// ─── Admin Types ───────────────────────────────────────────────────────────────

export type AdminDashboardStats = {
  total_users: number;
  total_talents: number;
  total_eo: number;
  total_events: number;
  active_events: number;
  total_bookings: number;
  completed_bookings: number;
  total_reviews: number;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: 'talent' | 'eo';
  phone?: string;
  created_at?: string;
};

export type AdminUsersData = {
  users: AdminUser[];
  pagination?: PaginationMeta;
};

export type AdminTalent = {
  id: number;
  user_id: number;
  stage_name: string;
  genre: string[];
  verified: boolean;
  average_rating: number;
  total_reviews?: number;
  price_min?: number;
  price_max?: number;
  city?: string;
  bio?: string;
};

export type AdminTalentsData = {
  talents: AdminTalent[];
  pagination?: PaginationMeta;
};

export type AdminModeratePayload = {
  status: EventStatus;
  reason?: string;
};

export type AdminVerifyPayload = {
  verified: boolean;
};
