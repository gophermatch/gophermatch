import { Router } from 'express';
import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'
import { createSublease } from '../database/sublease.js';

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
router.put('/insert', async (req, res) =>{
    try{
    const subleaseData = req.body.sublease_data;
    
    const result = await createSublease(subleaseData);
   
    res.status(201).json({
      message: 'Sublease created successfully',
      data: result // This could be the newly created sublease object/ID
    });
  } catch (error) {
    console.error('Error inserting sublease:', error);
    
    res.status(500).json(createErrorObj('Error creating sublease', error.message));
  }
});

export default router