import mongoose from "mongoose"
import ServerError from "../helpers/error_class.js"
import { escaparRegex } from "../helpers/regex_utils.js"
che wewewewe
const sanitizadores = {
  trim: (v) => (typeof v === "string" ? v.trim() : v),
  escaparRegex: (v) => (typeof v === "string" ? escaparRegex(v) : v),
  lowercase: (v) => (typeof v === "string" ? v.toLowerCase() : v),
}

function aplicarSanitizadores(valor, sanitizar) {
  if (!sanitizar) return valor
  const pasos = Array.isArray(sanitizar) ? sanitizar : [sanitizar]
  return pasos.reduce((v, paso) => {
    const fn = sanitizadores[paso]
    return fn ? fn(v) : v
  }, valor)
}

function validarCampos(schema) {
  return (request, response, next) => {
    try {
      for (const [fuente, reglas] of Object.entries(schema)) {
        if (!["body", "params", "query"].includes(fuente)) continue

        for (const [campo, regla] of Object.entries(reglas)) {
          let valor = request[fuente]?.[campo]

          if (regla.sanitizar) {
            valor = aplicarSanitizadores(valor, regla.sanitizar)
            request[fuente][campo] = valor
          }

          if (regla.requerido) {
            const esVacio = valor === undefined || valor === null || (typeof valor === "string" && valor === "")
            if (esVacio) {
              throw new ServerError(
                regla.mensaje || `El campo "${campo}" es obligatorio.`,
                400
              )
            }
          }

          if (valor === undefined || valor === null) continue

          if (regla.tipo === "objectId") {
            if (!mongoose.Types.ObjectId.isValid(valor)) {
              throw new ServerError(
                regla.mensaje || `El campo "${campo}" no es un ID válido.`,
                400
              )
            }
            continue
          }

          if (regla.tipo === "number") {
            const num = Number(valor)
            if (isNaN(num)) {
              throw new ServerError(
                regla.mensaje || `El campo "${campo}" debe ser un número.`,
                400
              )
            }
            if (regla.min !== undefined && num < regla.min) {
              throw new ServerError(
                regla.mensaje || `El campo "${campo}" debe ser mayor o igual a ${regla.min}.`,
                400
              )
            }
            if (regla.max !== undefined && num > regla.max) {
              throw new ServerError(
                regla.mensaje || `El campo "${campo}" debe ser menor o igual a ${regla.max}.`,
                400
              )
            }
            continue
          }

          if (typeof valor !== "string") {
            throw new ServerError(
              regla.mensaje || `El campo "${campo}" debe ser un texto.`,
              400
            )
          }

          if (regla.min !== undefined && valor.length < regla.min) {
            throw new ServerError(
              regla.mensaje || `El campo "${campo}" debe tener al menos ${regla.min} caracteres.`,
              400
            )
          }

          if (regla.max !== undefined && valor.length > regla.max) {
            throw new ServerError(
              regla.mensaje || `El campo "${campo}" no debe exceder ${regla.max} caracteres.`,
              400
            )
          }

          if (regla.coincidir && !regla.coincidir.test(valor)) {
            throw new ServerError(
              regla.mensaje || `El campo "${campo}" no tiene un formato válido.`,
              400
            )
          }
        }
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default validarCampos
