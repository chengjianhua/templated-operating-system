import { MongoClient, Logger } from 'mongodb';
import { databaseUrl } from 'config';

Logger.setLevel('debug');
Logger.filter('class', ['Db']);

const connect = MongoClient.connect(databaseUrl);

export default connect;
