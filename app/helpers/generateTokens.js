import jwt from 'jsonwebtoken';

const tokenSign = async (user) => {
    return jwt.sign({
        _id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "24"
    }
    );
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return null
    }
}

const decodeSign = (token) => { 
    return jwt.decode(token, null)
}

export { tokenSign, verifyToken, decodeSign };