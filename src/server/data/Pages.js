import { ObjectId } from 'mongodb';
import log4js from 'log4js';

import connect from './database';
import { handleDbOpResult as handlers } from './utils';

const logger = log4js.getLogger('Model [Pages]');
const collection = connect.then(database => database.collection('pages'));

class Pages {
  static async createPage(page) {
    const opResult = await (await collection).insertOne(page);

    try {
      const { insertedId, ops: [insertedPage] } = await handlers.updateWriteOpResult(opResult);
      logger.info(`Add page ${insertedId} successfully.`);
      return insertedPage;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default Pages;
