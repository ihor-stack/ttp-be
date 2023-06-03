import Pg from '../services/Pg';
import { UserFI, UserI } from '../types/user';
import base64 from 'uuid-base64';
import fs from 'fs';

export class Users {
  pg;
  constructor() {
    this.pg = Pg.getInstance();
  }
  async saveUser(user_name, password) {
    return await this.pg.saveUser({ user_name, password });
  }
  async getUserByUserName(username: string): Promise<UserFI | boolean> {
    const user: UserI = await this.pg.getUserByUserName(username);
    const userToFE = !user ? !!user : this.convertFields(user);
    return userToFE;
  }

  async getUser(): Promise<UserFI | boolean> {
    const user: UserI = await this.pg.getUser();
    console.log(user[0]);
    const userToFE = !user ? !!user : this.convertFields(user);
    return userToFE;
  }

  convertFields(user) {
    const encodeUserId = base64.encode(user.user_name);
    const userToFE = {
      id: encodeUserId,
      user_name: user.user_name,
      password: user.password,
    };

    return userToFE;
  }
}
