
export interface CalendlyConfig {
  id: string;
  mentor_id: string;
  calendly_username: string;
  event_type_slug: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendlyEvent {
  id: string;
  calendly_event_uri: string;
  student_id: string;
  mentor_id: string;
  event_name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  meeting_link?: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  calendly_reschedule_url?: string;
  calendly_cancel_url?: string;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface CalendlyWidgetOptions {
  url: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
}

export interface CalendlyEventPayload {
  event: string;
  payload: {
    uri: string;
    event: {
      start_time: string;
      end_time: string;
      name: string;
      duration: number;
    };
    invitee: {
      name: string;
      email: string;
      uri: string;
    };
    event_memberships?: Array<{
      user: {
        name: string;
        email: string;
        uri: string;
      };
    }>;
  };
}
