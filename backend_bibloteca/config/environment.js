import dotenv from 'dotenv';
dotenv.config();

// 1. Esto le sirve a los archivos que usan llaves {}
export const ENVIRONMENT = {
    PORT: process.env.PORT ,
    MONGODB_URI: process.env.MONGODB_URI,
    URL_FRONTEND: process.env.URL_FRONTEND,
    JWT_SECRET: process.env.JWT_SECRET,
    API_KEY: process.env.API_KEY,
};

// 2. ¡LA LÍNEA MÁGICA! Esto le sirve a los archivos que NO usan llaves
export default ENVIRONMENT;