const jwt = require('jsonwebtoken');
function islogin(req, res, next) {
    const token = req.cookies?.token;
    if (!token){
        return res.status(500).json({message :'token messing'})
    }
    jwt.verify(token, process.env.JWT_token, (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized access");
        }
      console.log({'jwt-token':decoded})
        req.user = decoded;
        next();
    })
}


module.exports = { islogin }