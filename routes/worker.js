const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, allowRoles } = require('../middlewares/authMiddleware');

// @route   GET /api/worker/complaints
// @desc    Worker gets their assigned complaints
router.get('/complaints', protect, allowRoles('worker'), async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedWorker: req.user._id });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});

module.exports = router;

// @route   PUT /api/worker/complaints/:id
// @desc    Worker updates status (In Progress / Solved)
router.put('/complaints/:id', protect, allowRoles('worker'), async (req, res) => {
  const complaintId = req.params.id;
  const { status } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (String(complaint.assignedWorker) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized: Not your complaint' });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
});
