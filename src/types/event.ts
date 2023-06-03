interface EventFI {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  roomName: string;
  roomLength: number;
  roomWidth: number;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  furniture: string;
  floorplan: string;
  addedBy: string;
}

interface EventI {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  room_name: string;
  room_length: number;
  room_width: number;
  floorplan: string;
  furniture: string;
  favorite: boolean;
  added_by: string;
  event_start_date: string;
  event_end_date: string;
  created_at: string;
  updated_at: string;
}

export { EventFI, EventI };
