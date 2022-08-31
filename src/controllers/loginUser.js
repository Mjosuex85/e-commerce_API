const { Router } = require('express');
const router = Router();

router.get('/', (req, res)=>{
    res.send('ok')
})

router.post('/', (req, res)=>{
    const {email, password} = req.body
    res.send('ok')
})
module.exports = router;