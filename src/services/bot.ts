import { config } from 'dotenv';
config();

import { CustomClient } from '../common/interfaces.js';

const Beatscape = new CustomClient();
Beatscape.login(process.env.BOT_TOKEN);
