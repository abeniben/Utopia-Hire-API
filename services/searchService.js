const Job = require('../models/jobModel');
const { Op } = require("sequelize");


const searchJobs = async(query,  sortBy = "date", page = 1, limit = 10) =>{

    const offset = (page-1) * limit;

    return await Job.findAndCountAll({
        where:{
            [Op.and]: [
                {
                    [Op.or] :[
                        {title: { [Op.like]: `%${query}%` } },     //case insensitive search
                        {description: { [Op.like]: `%${query}%` }},
                        {location: { [Op.like]: `%${query}%` }},
                    ],
                },
            ],
        },
        order: sortBy === "salary" ? [["salary", "DESC"]] : [["createdAt", "DESC"]],
        limit,
        offset,
    });
};


module.exports = {searchJobs}