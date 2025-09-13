import {Injectable, signal} from '@angular/core';
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from "@capacitor-community/sqlite";
import {Capacitor} from "@capacitor/core";

const DB_USERS = 'myuserdb';

export interface User {
  id: number;
  name: string;
  active: number;
}

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private users = signal<User[]>([]);

  constructor() { }

  getUsers()
  {
    return this.users;
  }

  async initWebStore(): Promise<void> {
    try {
      await this.sqlite.initWebStore();
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${err}`);
    }
  }

  async openDatabase(dbName:string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<any> {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqlite.checkConnectionsConsistency()).result;
    let isConn = (await this.sqlite.isConnection(dbName, readonly)).result;
    if(retCC && isConn) {
      db = await this.sqlite.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqlite
        .createConnection(dbName, encrypted, mode, version, readonly);
    }
    await db.open();
    return db;
  }

  async initialisePlugin()
  {

    await this.initWebStore()
      .then(async () => {

        await this.openDatabase(DB_USERS,
          false,
          'no-encryption',
          1,
          false)

        const schema = `CREATE TABLE IF NOT EXISTS users
                        (
                          id     INTEGER PRIMARY KEY AUTO_INCREMENT,
                          name   TEXT NOT NULL,
                          active INTEGER DEFAULT 1
                        );`;

        if( Capacitor.getPlatform() === 'web') {
          await this.sqlite.saveToStore(DB_USERS);
        }


        await this.db.execute(schema)
          .then(() => {
            this.loadUsers();
          });

        return true;
      })


  }

  //CRUD

  async loadUsers()
  {
    const users = await this.db.query('SELECT * FROM users;');

    this.users.set(users.values || []);
  }

  async addUser(name : String)
  {
    const query = `INSERT INTO users (name) VALUES ('${name}')`;

    const result = await this.db.query(query);

    await this.loadUsers();

    return result;
  }

  async updateUser(id : String, active : Number)
  {
    const query = `UPDATE users SET active = ${active} WHERE id = ${id}`;

    const result = await this.db.query(query);

    await this.loadUsers();

    return result;
  }

  async deleteUserById(id : String)
  {
    const query = `DELETE FROM users WHERE id = ${id}`;

    const result = await this.db.query(query);

    await this.loadUsers();

    return result;
  }
}
