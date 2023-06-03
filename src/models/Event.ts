import Pg from '../services/Pg';
import { EventFI, EventI } from '../types/event';
import { ChairI } from '../types/chair';
import { TableFI, TableI } from '../types/table';
import base64 from 'uuid-base64';
import S3 from '../services/S3';

export class Event {
  pg;
  s3;
  constructor() {
    this.pg = Pg.getInstance();
    this.s3 = new S3();
  }

  saveFurniture(id, furniture) {
    return this.pg.saveFurniture(id, furniture);
  }

  async getEventByShareId(id: string): Promise<EventFI | boolean> {
    const decodedShareId = base64.decode(id);
    const event: EventI = await this.pg.getEventByShareId(decodedShareId);

    const eventToFE = !event ? !!event : this.convertEventFields(event);

    return eventToFE;
  }

  convertEventFields(event) {
    const encodeShareId = base64.encode(event.share_id);
    const eventToFE = {
      id: event.id,
      title: event.title,
      roomName: event.room_name,
      roomWidth: event.room_width,
      roomLength: event.room_length,
      floorplan: event.floorplan,
      furniture: event.furniture,
      favorite: event.favorite,
      addedBy: event.added_by,
      startDate: event.event_start_date,
      endDate: event.event_end_date,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      shareId: encodeShareId,
    };

    return eventToFE;
  }

  async saveEvent(data: EventFI): Promise<EventFI> {
    const event = await this.pg.saveEvent({
      title: data.title,
      roomName: data.roomName,
      roomWidth: data.roomWidth,
      roomLength: data.roomLength,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    const eventToFE = this.convertEventFields(event);

    return eventToFE;
  }

  async updateRoomDimensions(id, data): Promise<EventFI> {
    const width = !!data.roomWidth && +data.roomWidth;
    const length = !!data.roomLength && +data.roomLength;
    const event = await this.pg.updateRoomDimensions({
      id,
      roomWidth: width,
      roomLength: length,
    });
    const eventToFE = this.convertEventFields(event);
    return eventToFE;
  }

  async updateEvent(id, data): Promise<EventFI> {
    const title = data.title;
    const start = data.startDate;
    const end = data.endDate;

    const event = await this.pg.updateEvent({
      id,
      title: title,
      startDate: start,
      endDate: end,
    });

    const eventToFE = this.convertEventFields(event);
    return eventToFE;
  }

  async duplicateEvent(id, title, startDate, endDate): Promise<EventFI> {
    const data = await this.pg.getEvent(id);

    const event = await this.pg.duplicateEvent({
      title: title,
      event_start_date: startDate,
      event_end_date: endDate,
      room_name: data.room_name,
      room_width: data.room_width,
      room_length: data.room_length,
      floorPlan: data.floorplan,
      furniture: data.furniture,
    });
    const eventToFE = this.convertEventFields(event);

    return eventToFE;
  }

  async deleteEvent(id): Promise<EventFI> {
    const event = await this.pg.deleteEvent({
      id,
    });
    return event;
  }

  async addFavoriteEvent(id): Promise<EventFI> {
    const event = await this.pg.addFavoriteEvent({
      id,
    });
    const eventToFE = this.convertEventFields(event);
    return eventToFE;
  }

  async removeFavoriteEvent(id): Promise<EventFI> {
    const event = await this.pg.removeFavoriteEvent({
      id,
    });
    const eventToFE = this.convertEventFields(event);
    return eventToFE;
  }

  async getFavoriteEvents(): Promise<EventFI[] | boolean> {
    const events: EventFI[] = await this.pg.getFavoriteEvents();
    const eventsFe = [];

    events.forEach(event => {
      const eventF = this.convertEventFields(event);
      eventsFe.push(eventF);
    });

    return eventsFe;
  }

  async getEvents(): Promise<EventFI[] | boolean> {
    const events: EventFI[] = await this.pg.getEvents();
    const eventsFe = [];

    events.forEach(event => {
      const eventF = this.convertEventFields(event);
      eventsFe.push(eventF);
    });

    return eventsFe;
  }

  async getEvent(id: string): Promise<EventFI | boolean> {
    const event = await this.pg.getEvent(id);

    const eventToFE = !event ? !!event : this.convertEventFields(event);

    return eventToFE;
  }
  async getEventByStartDate(startDate): Promise<EventFI | boolean> {
    const event = await this.pg.getEventByStartDate(startDate);

    const eventToFE = !event ? !!event : this.convertEventFields(event);

    return eventToFE;
  }

  async getChairs(): Promise<ChairI[] | boolean> {
    const chairs: ChairI[] = await this.pg.getChairs();

    const chairsToFe = [];
    chairs.forEach(chair => {
      const chairToFe = this.convertChairFields(chair);
      chairsToFe.push(chairToFe);
    });
    return chairsToFe;
  }

  convertChairFields(chair) {
    const chairToFE = {
      id: chair.id,
      src: chair.src,
      title: chair.title,
      type: chair.type,
      category: chair.category,
      dimensions: {
        width: chair.width,
        depth: chair.depth,
        height: chair.height,
      },
    };

    return chairToFE;
  }

  async getTables(): Promise<TableFI[] | boolean> {
    const tables: TableI[] = await this.pg.getTables();
    const tablesToFe = [];
    tables.forEach(chair => {
      const chairToFe = this.convertTableField(chair);
      tablesToFe.push(chairToFe);
    });
    return tablesToFe;
  }

  convertTableField(table) {
    const tableToFE = {
      id: table.id,
      src: table.src,
      title: table.title,
      category: table.category,
      type: table.type,
      dimensions: {
        width: table.width,
        length: table.length,
        height: table.height,
      },
    };

    return tableToFE;
  }
}
