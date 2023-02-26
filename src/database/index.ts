import {Sequelize} from 'sequelize';
import mysql from 'mysql2';
import {SQL_DB} from "../constants";

export const sequelize = new Sequelize(
	SQL_DB.DB_NAME,
	SQL_DB.DB_USERNAME,
	SQL_DB.DB_PASSWORD, {
		host: SQL_DB.DB_HOSTNAME,
		dialect: 'mysql',
		port: SQL_DB.DB_PORT,
		timezone: '+05:30',
		define: {
			createdAt: false,
			updatedAt: false,
			deletedAt: false
		}
	})
