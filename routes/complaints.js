const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  assignWorker,
  updateComplaintStatus,
} = require('../controllers/complaintController');

const { protect, allowRoles } = require('../middlewares/authMiddleware');

// Resident creates a complaint
router.post('/', protect, allowRoles('resident'), createComplaint);

// Admin fetches all complaints
router.get('/', protect, allowRoles('admin'), getAllComplaints);

// Admin assigns a worker
router.put('/assign/:id', protect, allowRoles('admin'), assignWorker);

// Worker updates status
router.put('/status/:id', protect, allowRoles('worker'), updateComplaintStatus);

module.exports = router;
