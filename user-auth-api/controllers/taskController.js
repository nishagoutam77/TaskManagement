const Task = require('../models/taskModel');

// Create Task
exports.createTask = async (req, res) => {
    const { teamMember, task, priority, dueDate } = req.body;
    //console.log(req.body);  // Debug: Log the incoming request body
    try {
        const newtask = await Task.create({
            teamMember, 
            task,
            priority,
            dueDate,
            user: req.user.id 
        });

        res.status(201).json(newtask);
    } catch (err) {
        //console.error('Error creating task:', err.message); // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); // Use req.user.id here
        res.json(tasks);
    } catch (err) {
        //console.error('Error fetching tasks:', err.message); // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task && task.user.toString() === req.user.id.toString()) {
            task.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : task.isCompleted;
            task.priority = req.body.priority || task.priority;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found or user not authorized' });
        }
    } catch (err) {
        //console.error('Error updating task:', err.message); // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Find and delete in one step

        if (task) {
            res.json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ message: 'Task not found or user not authorized' });
        }
    } catch (err) {
        //console.error('Error deleting task:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Remove a specific field from a Task
exports.deleteFieldFromTask = async (req, res) => {
    const { taskId } = req.params;
    const { field } = req.body; // The field to be deleted

    try {
        // Check if the field is part of the schema
        const allowedFields = ['title', 'description', 'priority', 'dueDate'];
        if (!allowedFields.includes(field)) {
            return res.status(400).json({ error: 'Invalid field to delete' });
        }

        // Use $unset to remove the specific field
        const task = await Task.findByIdAndUpdate(
            taskId,
            { $unset: { [field]: 1 } },  // Remove the field
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: `${field} has been deleted`, task });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

