import jwt from "jsonwebtoken"

export const generateToken = (userId, role, res) => {
    const token = jwt.sign({userId, role}, process.env.JWT_SECRET, {
        expiresIn: "24h"
    })

    res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: false,
    })
}