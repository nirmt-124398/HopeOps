const express = require('express');
const router = express.Router();
const rescueController = require('../controllers/rescue.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Create a new rescue (Admin only)
router.post('/', authenticateToken, isAdmin, rescueController.createRescue);

// Get all rescues
router.get('/', authenticateToken, rescueController.getAllRescues);

// Get rescue by ID
router.get('/:id', authenticateToken, rescueController.getRescueById);

// Update rescue (Admin only)
router.put('/:id', authenticateToken, isAdmin, rescueController.updateRescue);

// Delete rescue (Admin only)
router.delete('/:id', authenticateToken, isAdmin, rescueController.deleteRescue);

// Update rescue status (Admin only)
router.patch('/:id/status', authenticateToken, isAdmin, rescueController.updateRescueStatus);

module.exports = router; 