import knex from 'knex';
import { EventFI, EventI } from '../types/event';
import { UserFI, UserI } from '../types/user';
import { ChairArrayFI, ChairFI, ChairI } from '../types/chair';
import { TableArrayFI, TableFI, TableI } from '../types/table';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export default class Pg {
  private static instance: Pg;

  knex;
  static users: any;

  public static getInstance() {
    if (!Pg.instance) {
      Pg.instance = new Pg();
    }

    return Pg.instance;
  }

  public resetInstance() {
    Pg.instance = new Pg();

    return Pg.instance;
  }

  constructor() {
    this.knex = knex({
      client: 'pg',
      connection: {
        host: process.env.PG_DB_HOST,
        port: +process.env.PG_DB_PORT,
        user: process.env.PG_DB_USER,
        password: process.env.PG_DB_PASS,
        database: process.env.PG_DB_NAME,
      },
    });
    this.init().then(() => this.seeding());
  }
  async init() {
    await this.createEventTable();
    await this.createSharesTable();
    await this.createUserTable();
    await this.createChairTable();
    await this.createTable();
  }

  async seeding() {
    // db 'chairs' table seeding
    const chairsJson: any = fs.readFileSync('./data/chairs.json');

    const chairs = JSON.parse(chairsJson);
    chairs.length !== 0 ? await this.saveChairs(chairs).then(data => {}) : '';

    // db 'tables' table seeding
    const tablesJson: any = fs.readFileSync('./data/tables.json');

    const tables = JSON.parse(tablesJson);
    tables.length !== 0 ? await this.saveTables(tables).then(data => {}) : '';
  }
  async createEventTable() {
    await this.knex.schema.dropTableIfExists('events').then(async () => {
      await this.knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      return this.knex.schema.createTable('events', table => {
        table.increments('pk').notNullable().primary();
        table
          .uuid('id')
          .unique()
          .notNullable()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table.string('title', 60).notNullable();
        table.string('room_name', 60).notNullable();
        table.integer('room_width').notNullable();
        table.integer('room_length').notNullable();
        table.text('floorplan');
        table.text('furniture');
        table.boolean('favorite').notNullable().defaultTo(false);
        table.string('added_by');
        table.datetime('event_start_date');
        table.datetime('event_end_date');
        table.uuid('share_id', { useBinaryUuid: true }).unique();
        table
          .timestamp('created_at')
          .notNullable()
          .defaultTo(this.knex.fn.now());
        table
          .timestamp('updated_at')
          .notNullable()
          .defaultTo(this.knex.fn.now());
      });
    });
  }

  createSharesTable() {
    this.knex.schema.dropTableIfExists('shares');
  }

  async saveEvent({
    title,
    startDate,
    endDate,
    roomName,
    roomWidth,
    roomLength,
  }: EventFI): Promise<EventI> {
    const shareUuid = uuidv4();
    const event: EventI = await this.knex('events').insert(
      {
        title,
        room_name: roomName,
        room_width: +roomWidth,
        room_length: +roomLength,
        event_start_date: startDate,
        event_end_date: endDate,

        share_id: shareUuid,
      },
      ['*']
    );

    return event[0];
  }

  async duplicateEvent({
    title,
    event_start_date,
    event_end_date,
    room_name,
    room_width,
    room_length,
    floorplan,
    furniture,
  }: EventI): Promise<EventI> {
    const shareUuid = uuidv4();

    const event: EventI = await this.knex('events').insert(
      {
        title,
        room_name,
        room_width,
        room_length,
        event_start_date,
        event_end_date,
        share_id: shareUuid,
        floorplan,
        furniture,
      },
      ['*']
    );

    return event[0];
  }

  async updateRoomDimensions({ id, roomWidth, roomLength }): Promise<EventI> {
    const data = {
      ...(roomWidth && {
        room_width: +roomWidth,
      }),
      ...(roomLength && {
        room_length: +roomLength,
      }),
      updated_at: this.knex.fn.now(),
    };

    const updateEvent = await this.knex('events')
      .where({ id })
      .update(data, ['*']);

    return updateEvent[0];
  }

  async updateEvent({ id, title, startDate, endDate }): Promise<EventI> {
    const data = {
      title: title,
      event_start_date: startDate,
      event_end_date: endDate,
      updated_at: this.knex.fn.now(),
    };

    const updateEvent = await this.knex('events')
      .where({ id })
      .update(data, ['*']);

    return updateEvent[0];
  }

  async deleteEvent({ id }): Promise<EventI> {
    const deleteEvent = await this.knex('events').where({ id }).del();

    return deleteEvent;
  }

  async addFavoriteEvent({ id }): Promise<EventI> {
    const data = {
      favorite: true,
    };

    const addFavoriteEvent = await this.knex('events')
      .where({ id })
      .update(data, ['*']);

    return addFavoriteEvent[0];
  }
  async removeFavoriteEvent({ id }): Promise<EventI> {
    const data = {
      favorite: false,
    };

    const removeFavoriteEvent = await this.knex('events')
      .where({ id })
      .update(data, ['*']);

    return removeFavoriteEvent[0];
  }
  async getFavoriteEvents() {
    const events = await this.knex('events')
      .select('*')
      .from('events')
      .where('favorite', true)
      .orderBy('event_start_date')
      .then(rows => rows);
    return events;
  }

  async getEvents() {
    const events = await this.knex('events')
      .select('*')
      .from('events')
      .orderBy('event_start_date')
      .then(rows => rows);
    return events;
  }

  async getEvent(id: string): Promise<EventI> {
    const getEvent = await this.knex('events').where({ id });

    return getEvent[0];
  }

  async saveFurniture(id, furniture): Promise<EventI> {
    const updateEvent = await this.knex('events')
      .where({ id })
      .update(
        {
          furniture: JSON.stringify(furniture),
          updated_at: this.knex.fn.now(),
        },
        ['*']
      );
    return updateEvent[0];
  }

  async getEventByShareId(id: string): Promise<EventI> {
    const getEvent = await this.knex('events').where({ share_id: id });

    return getEvent[0];
  }

  async createUserTable() {
    await this.knex.schema.dropTableIfExists('users').then(async () => {
      await this.knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      return this.knex.schema.createTable('users', table => {
        table
          .uuid('id')
          .unique()
          .notNullable()
          .primary()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table.string('user_name').notNullable();
        table.string('password').notNullable();
      });
    });
  }
  async saveUser({ user_name: username, password }: UserFI): Promise<UserI> {
    const shareUuid = uuidv4();
    const user: UserI = await this.knex('users').insert(
      {
        id: shareUuid,
        user_name: username,
        password: password,
      },
      ['*']
    );
    return user[0];
  }
  async getUserByUserName(username: string): Promise<UserI> {
    const getUser = await this.knex('users').where({ user_name: username });
    return getUser[0];
  }

  async getUser(): Promise<UserI> {
    const users = await this.knex('users')
      .select('*')
      .then(rows => rows);
    return users[0];
  }

  async createChairTable() {
    await this.knex.schema.dropTableIfExists('chairs').then(async () => {
      await this.knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      return this.knex.schema.createTable('chairs', table => {
        //table.increments('pk').notNullable().primary();
        table
          .uuid('id')
          .unique()
          .notNullable()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table.string('src').notNullable();
        table.string('title', 60).notNullable();
        table.string('type').notNullable().unique();
        table.string('category');
        //table.json('dimensions').notNullable();
        table.decimal('width').notNullable();
        table.decimal('depth').notNullable();
        table.decimal('height').notNullable();
      });
    });
  }

  async saveChair({
    src,
    title,
    type,
    category,
    width,
    depth,
    height,
  }: ChairFI): Promise<ChairI> {
    const shareUuid = uuidv4();
    const chair: ChairI = await this.knex('chairs').insert(
      {
        id: shareUuid,
        src: src,
        title: title,
        type: type,
        category: category,

        width: width,
        depth: depth,
        height: height,
      },
      ['*']
    );

    return chair[0];
  }

  async saveChairs(data: ChairArrayFI): Promise<ChairArrayFI> {
    const chairs = [];
    data.map(async chair => {
      const temp = await this.saveChair(chair).then(data => data);
      chairs.push(temp);
    });

    return chairs;
  }

  async getChairById(id: string) {
    //: Promise<ChairI>
    const getChair = await this.knex('chairs').where({ id });
    return getChair[0];
  }

  async getChairs() {
    //: Promise<ChairI>
    const chairs = await this.knex('chairs')
      .select('*')
      .from('chairs')
      .then(rows => rows);
    return chairs;
  }

  async createTable() {
    await this.knex.schema.dropTableIfExists('tables').then(async () => {
      await this.knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      return this.knex.schema.createTable('tables', table => {
        //table.increments('pk').notNullable().primary();
        table
          .uuid('id')
          .unique()
          .notNullable()
          .defaultTo(this.knex.raw('uuid_generate_v4()'));
        table.string('src').notNullable();
        table.string('title', 60).notNullable();
        table.string('category').notNullable();
        table.string('type').notNullable().unique();
        //table.json('dimensions').notNullable();
        table.decimal('width').notNullable();
        table.decimal('length').notNullable();
        table.decimal('height').notNullable();
      });
    });
  }

  async saveTable({
    src,
    title,
    category,
    type,
    width,
    length,
    height,
  }: TableFI): Promise<TableI> {
    //const shareUuid = uuidv4();
    const table: TableI = await this.knex('tables').insert(
      {
        src: src,
        title: title,
        category: category,
        type: type,

        width: width,
        length: length,
        height: height,
      },
      ['*']
    );

    return table[0];
  }

  async saveTables(data: TableArrayFI): Promise<TableArrayFI> {
    const tables = [];
    data.map(async table => {
      const temp = await this.saveTable(table).then(data => data);
      tables.push(temp);
    });

    return tables;
  }

  async getTables() {
    //: Promise<TableI>
    const tables = await this.knex('tables')
      .select('*')
      .from('tables')
      .then(rows => rows);

    return tables;
  }

  async getTableById(id: string) {
    //: Promise<TableI>
    const getTable = await this.knex('tables').where({ id });
    return getTable[0];
  }
}
