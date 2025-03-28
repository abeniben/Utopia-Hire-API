require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const employerRoutes = require('./routes/employerRoutes');
const jobseekerRoutes = require('./routes/jobSeekerRoutes');
const searchRoutes = require('./routes/searchRoutes');
const healthRouter = require('./routes/healthRouter');
const {sendDailyDigestEmail} = require('./services/emailService')
require('./utils/cron')



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/search', searchRoutes)
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/employer', employerRoutes);
app.use('/api/v1/jobseeker', jobseekerRoutes);
app.use('/api/v1/health', healthRouter);


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
