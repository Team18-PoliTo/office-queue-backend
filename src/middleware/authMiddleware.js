// TODO: Implement authorization middleware
// Check user-type header (customer, officer, manager)

const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    // TODO: Implement authorization logic
  };
};

module.exports = authorize;

