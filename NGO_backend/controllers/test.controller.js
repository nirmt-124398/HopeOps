export const ShouldBeLoggedIn = (req, res) => {
  try {
    res.json({ 
      message: 'You are authenticated!', 
      userId: req.user,
      role: req.userRole,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const ShouldBeUser = (req, res) => {
  try {
    res.json({ 
      message: 'You are authorized as a regular USER',
      userId: req.user,
      role: req.userRole,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const ShouldBeNGOAdmin = (req, res) => {
  try {
    res.json({ 
      message: 'You are authorized as an NGO_ADMIN',
      userId: req.user,
      role: req.userRole,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const ShouldBeSuperAdmin = (req, res) => {
  try {
    res.json({ 
      message: 'You are authorized as a SUPER_ADMIN',
      userId: req.user,
      role: req.userRole,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const ShouldBeAdminOrSuperAdmin = (req, res) => {
  try {
    res.json({ 
      message: 'You are authorized as either an NGO_ADMIN or SUPER_ADMIN',
      userId: req.user,
      role: req.userRole,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};