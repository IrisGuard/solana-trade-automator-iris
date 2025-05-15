
// Import the connection from config
import { connection } from '../config';
import { getSolBalance } from './balance';
import { sendToken } from './transfer';

// Export wallet-related functions
export { getSolBalance, sendToken };
