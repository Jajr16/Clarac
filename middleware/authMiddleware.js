function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    req.session.errorMessage = null;
    return next();
  } else if (req.path === '/login') {
    req.session.errorMessage = null;
    return next();
  } else {
    req.session.errorMessage = 'Debes iniciar sesión para acceder a esta página';
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render('LogIn', { title: 'CLARAC | LogIn', layout: false, errorMessage });
  }
}

function permissions(...categories) {
  return function (req, res, next) {
    const userPermissions = req.session.permissions || {};

    // Verificar si el usuario tiene todos los permisos requeridos
    const hasAllPermissions = categories.every(category => userPermissions[category]);

    if (hasAllPermissions) {
      return next();
    } else {
      return res.redirect('/users/home');
    }
  };
}

function valArea(requiredArea) {
  return function (req, res, next) {
    const userArea = req.session.area;

    if (userArea === requiredArea) {
      return next()
    } 
    return res.redirect('/users/home')
  }
}

function subperm(category, subPermissions) {
  return function (req, res, next) {
    const userPermissions = req.session.permissions || {};  // Obtener permisos de sesión
    
    // Verificar si el usuario tiene la categoría solicitada y los sub-permisos
    if (userPermissions[category]) {
      const hasAllSubPermissions = subPermissions.every(subPerm => userPermissions[category].includes(subPerm.toString()));
      
      if (hasAllSubPermissions) {
        return next();  // El usuario tiene todos los permisos requeridos
      }
    }

    // Si no tiene los permisos, redirigir al home
    return res.redirect('/users/home');
  };
}


module.exports = {
  isAuthenticated,
  permissions,
  subperm,
  valArea
};