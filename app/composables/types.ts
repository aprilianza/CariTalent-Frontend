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

export type Application = {
  id: number;
  event: {
    title: string;
  };
  proposed_price: number;
  status: ApplicationStatus;
};

export type Invitation = {
  id: number;
  event: {
    title: string;
  };
  organizer_name: string;
  offered_price: number;
  status: InvitationStatus;
};

export type Booking = {
  id: number;
  event: {
    title: string;
    event_date: string;
    venue_name: string;
  };
  status: BookingStatus;
};
