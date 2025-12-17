module.exports = function (roles = []) {
  if (!Array.isArray(roles)) roles = [roles];

  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "No autenticado" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });

    next();
  };
};
