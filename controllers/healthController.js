const {sequelize} = require("../config/db");

console.log("Sequelize instance:", sequelize);


const checkHealth = async (req, res) => {           //-> works well
  try {
    // Test database connectivity
    await sequelize.authenticate();
    res.status(200).json({ status: "OK", database: "Connected" });
  } catch (error) {
    res.status(500).json({ status: "Error", database: "Disconnected", error: error.message });
  }
};

module.exports = { checkHealth };