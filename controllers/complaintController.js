const Complaint = require('../models/Complaint');
const User = require('../models/User');
const sendEmail = require('../config/mailer');

// @desc    Resident creates complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, location, image } = req.body;

    if (!title || !description || !location || !image) {
      return res.status(400).json({ message: 'All fields (title, description, location, image) are required' });
    }

    const complaint = await Complaint.create({
      resident: req.user._id,
      title,
      description,
      imageUrl: image,
      location
    });

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit complaint', error: err.message });
  }
};

// @desc    Admin gets all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('resident', 'name email')
      .populate('assignedWorker', 'name email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
};

// @desc    Admin assigns worker
exports.assignWorker = async (req, res) => {
  const complaintId = req.params.id;
  const { workerId } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.assignedWorker = workerId;
    complaint.status = 'In Progress';
    await complaint.save();

    const worker = await User.findById(workerId);
    await sendEmail(
      worker.email,
      '🧹 New Complaint Assigned to You',
      `Dear ${worker.name},\n\nYou have been assigned a new complaint to handle. Please check your dashboard.\n\nThanks,\nCleanUPHub Team`
    );

    res.json({ message: 'Worker assigned', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign worker', error: err.message });
  }
};

// @desc    Worker updates status (In Progress / Solved)
exports.updateComplaintStatus = async (req, res) => {
  const complaintId = req.params.id;
  const { status } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId).populate('resident', 'email name');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();

    if (status === 'Solved') {
      await sendEmail(
        complaint.resident.email,
        '✅ Your Complaint Has Been Resolved',
        `Dear ${complaint.resident.name},\n\nYour complaint has been marked as solved by the assigned sanitation worker.\n\nThanks,\nCleanUPHub`
      );
    }

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};
