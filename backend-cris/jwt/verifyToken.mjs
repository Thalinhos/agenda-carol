import jwt from 'jsonwebtoken';

// const SECRET = Deno.env.get("SECRET")
const SECRET = process.env.SECRET;

export const verifyToken = ((req, res, next) => {
    const reqToken = req.headers['x-access-token'] || req.headers['authorization']
    
    if(!reqToken){
        return res.status(400).json({errorMessage: 'Token é necessário para verificação.'});  
    }
    
    const token = reqToken?.split('Bearer ')[1]

    if(!token){
        return res.status(400).json({errorMessage: 'Token é necessário para verificação.'});  
    } 


    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) { 
            return res.status(400).json({errorMessage: 'Token expirado/inválido.'}); //invalido, mas vamos bater essa msg para mostrar direto ao cliente  
        }
        
        req.decoded = decoded
        next()
    });
})