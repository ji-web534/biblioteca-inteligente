// el frontend esta teniendo problemas cuando el backend tiene un error.esto es porque no tiene forma de procesarlo asique cree esta class para que asi pueda hacerlo    
export class backendError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "ServerError";
        this.statusCode = statusCode; // Guardamos si fue un 400, 401, 500, etc.
    }
}