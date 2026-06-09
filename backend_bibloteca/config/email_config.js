import 'dotenv/config';
import nodemailer from "nodemailer";
import environment from "./enviroments.js"
import { Resend } from 'resend';
import environment from "./enviroments.js";


export const resend = new Resend(environment.API_KEY); 







