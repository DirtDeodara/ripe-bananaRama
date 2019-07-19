
const logger = (req, res, next) => {
  console.log(`Attention! We have an incoming ${req.method} request from a client at the "${req.path}" path!`);
  next();
};

module.exports = logger;
