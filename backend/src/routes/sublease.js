import { Router } from 'express';
import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'
import { createBio } from '../database/profile.js';

const router = Router()

//TODO
router.get('/get', async (req, res) =>
{
});

//TODO
router.delete('/delete', async (req, res) =>
{
});

//TODO
router.put('/insert', async (req, res) =>
{
});

export default router