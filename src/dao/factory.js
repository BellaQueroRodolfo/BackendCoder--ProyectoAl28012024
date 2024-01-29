const { PremiumUserDAO, UserDAO, PremiumCartDAO, CartDAO } = require('./index');
const getUserDAO = (daoType) => {
  if (daoType === 'premium') {
    return new PremiumUserDAO();
  } else {
    return new UserDAO();
  }
};

const getCartDAO = (daoType) => {
  if (daoType === 'premium') {
    return new PremiumCartDAO();
  } else {
    return new CartDAO();
  }
};

module.exports = { getUserDAO, getCartDAO };
