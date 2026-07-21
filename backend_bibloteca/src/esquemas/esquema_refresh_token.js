import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, index: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "usuario", required: true },
    familia: { type: String, required: true, index: true },
    status: { type: String, enum: ["active", "used", "revoked"], default: "active" },
    createdAt: { type: Date, default: Date.now, expires: "30d" }
})

refreshTokenSchema.index({ familia: 1, status: 1 })

export default mongoose.model("refreshToken", refreshTokenSchema)
