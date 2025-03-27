
const authorize = (roles) => async(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
               error: "Access Denied! You do not have permission."
            })
        }
        next();
}


module.exports = authorize