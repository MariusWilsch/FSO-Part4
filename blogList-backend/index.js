const app = require("./app.js");
const config = require("./utils/config.js");
const { info } = require("./utils/logger.js");

app.listen(config.PORT, () => info(`Server running on port ${config.PORT}`));
