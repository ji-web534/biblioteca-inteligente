import 'dotenv/config';


import { Resend } from 'resend';
import ENVIRONMENT from './environment.js';



export const resend = new Resend(ENVIRONMENT.API_KEY); 







