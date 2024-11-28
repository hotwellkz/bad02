import { db, storage, app } from './config';
import { addCategory, updateCategory, deleteCategory } from './categories';
import { transferFunds } from './transactions';
import { addContract, deleteClientContracts } from './contracts';

export {
  db,
  storage,
  app,
  addCategory,
  updateCategory,
  deleteCategory,
  transferFunds,
  addContract,
  deleteClientContracts
};