import { Sequelize } from "sequelize";
import debug from 'debug';
import {readFileSync} from 'fs'
import {Promise  as DPromise} from "bluebird";
import ConfigProperty from "../config/env.config";

const path = require('path')

const log: debug.IDebugger = debug('app:db-connection');

class DBConnection {
    private static instance: DBConnection;
    private readonly dbName = ConfigProperty.Db_Name
    private readonly username = ConfigProperty.Db_Username
    private readonly password = ConfigProperty.Db_Password
    private readonly sequelize : Sequelize;

    constructor() {
        this.sequelize = new Sequelize(this.dbName, this.username, this.password, {
            dialect: "mysql",
            host: "localhost",
            port: 3306,
        });

        this.sequelize.authenticate()
            .then(x => {
                log("Connection to the databasse has been established successfully.");
            })
            .catch((error) => {
                log('Unable to connect to the database:', error);
            })
        
        this.dbSetup()
    }

    static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }

        return DBConnection.instance;
    }

    getSequelize (): Sequelize {
        return this.sequelize;
    }

    //loads the script and apply it to the database
    async dbSetup () {
        let promises: any[] = [];
        let filePath = path.resolve(__dirname, './db-init.sql');
        let sql_string = readFileSync(filePath, 'utf8')
        let splitQueries = sql_string.toString().replace(/^\s*[\r\n]/gm, '').split(';');
        splitQueries.forEach((splitQuery) => {
            if (!/^\s*$/.test(splitQuery)) {
                promises.push(this.sequelize.query(splitQuery));
            }
        });
        
        DPromise.each(promises, ()=>{})
            .then(() => {
                log("Migration Successful")
            })
            .catch((e) => {
                log("Migration failed", e)
            })
    }
}

export default DBConnection.getInstance();
