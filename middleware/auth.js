const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    /*if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ error: 'Access denied. No token provided.' });
    }*/
  
    const token = req.header('Authorization')?.split(" ")[1];
    console.log('Token:', token); // Debug log
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('verified Token:', verified); // Debug log
    req.user = verified;
    
    next();
  } catch (error) {
    // console.error('Token Verification Error:', error); // Debug log
    res.status(401).json({ error: 'Token is not valid' });
  }
};



module.exports = auth;





/*{
	"email": "ccoo@gmail.com",
	"password":"password221",
	"role":"employer"
 }
 
 {
 	"email":"Midroc@gmail.com",
	"password":"heretoemploy",
	"role":"employer"
} 
 
 
 */


/*

  {
	"email":"abenezerteshome7d@gmail.com",
	"password":"pass4321",
	"role":"jobseeker"
}

{
	"email":"Kev@gmail.com",
	"password":"workpass",
  "role":"jobseeker"
}
*/

