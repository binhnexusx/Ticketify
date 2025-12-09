import express from 'express';
import redis from '../utils/redis.js';
import * as userController from '../controllers/auth.controller.js'; // ✅ fixed
import authenticate from '../middlewares/auth.js'; // ✅ fixed extension

const router = express.Router();
