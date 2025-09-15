import jwt from 'jsonwebtoken';

// const SECRET = Deno.env.get("SECRET")
const SECRET = process.env.SECRET;

export const setToken = ((user) => {

    const token = jwt.sign({ username: user }, SECRET, { expiresIn: '15min' });

    return token;

});