const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            next();
           
        } else {
            
            res.redirect('/admin');
        }
        
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async (req, res, next) => {
    try {
        if(req.session.admin_id){
            res.redirect('/admin/home')
        }else{
            next();
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    isLogin,
    isLogout
};