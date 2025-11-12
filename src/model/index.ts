import type { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import type { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions.js";
import { DataSource } from "typeorm";
import { PlayList } from "./entities/playlist.entity";
import { Video } from "./entities/video.entity";
import "reflect-metadata";


const {
    DB_SERVER,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_LOGGING,
    DB_TYPE
} = process.env
const entities = [
    PlayList,
    Video,
]
const postgresSqlConnectionOprtions: PostgresConnectionOptions = {
    type: "postgres",
    host: DB_SERVER,
    port: +DB_PORT!,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    logging: DB_LOGGING == "true",
    entities: entities,
}

const sqliteConnectionOption: SqliteConnectionOptions = {
    type: "sqlite",
    database: `${DB_NAME}.sqlite`,
    entities:entities,
    logging: DB_LOGGING == "true",
    synchronize: true,
}

export const sqlDatasource = new DataSource(
    DB_TYPE == "postgres"?postgresSqlConnectionOprtions:sqliteConnectionOption
) 

export async function connectToDB(){
    try{
        await sqlDatasource.initialize();
        console.log(`Connected to ${DB_TYPE} Datasource`)
        await sqlDatasource.synchronize();
    }catch(err){
        console.error(err);
    }
}

export async function clearDB(){
    try{
        await sqlDatasource.synchronize(true);
    }catch(err){
        console.error(err);
    }
}

export async function disconnectFromDB(){
    try{
        await sqlDatasource.destroy();
    }catch(err){
        console.error(err);
    }
}

export const playlistRepo = sqlDatasource.getRepository(PlayList);
export const videoRepo = sqlDatasource.getRepository(Video);
export { PlayList, Video };
