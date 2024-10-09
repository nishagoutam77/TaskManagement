const express = require('express');
const TaskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, TaskController.createTask);
router.get('/', authMiddleware, TaskController.getTasks);
router.put('/:id', authMiddleware, TaskController.updateTask);
router.delete('/:id', authMiddleware, TaskController.deleteTask);

//router.delete('/:taskId/field', authMiddleware, TaskController.deleteFieldFromTask);

module.exports = router;
