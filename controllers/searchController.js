const searchService = require('../services/searchService');

const searchJobs = async(req, res) => {
    try{
        const { query } = req.query;
        const jobs = await searchService.searchJobs(query);
        res.status(200).json({jobs})
    } catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = {searchJobs}