import { Router } from 'express';
import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'
import { createSublease, getSublease, deleteSublease, getSubleases } from "../database/sublease.js";

const router = Router()

router.get('/get', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
  
    try {
      const sublease = await getSublease(user_id);
      res.json(sublease);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  });

router.get('/getmultiple', async (req, res) => {
  const { count, page } = req.query;

  if (!count || !page) {
    return res.status(400).json({ message: "invalid params" });
  }

  try {
    const subleases = await getSubleases(count, page);
    res.json(subleases);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

  router.delete('/delete', async (req, res) => {
    const { user_id } = req.query; // Or req.params if you're using route parameters
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
  
    try {
      await deleteSublease(user_id);
      res.json({ message: 'Sublease successfully deleted' });
    } catch (err) {
      // Assuming the error thrown is due to not finding a sublease to delete,
      // which might not always warrant a 404. Adjust as necessary.
      res.status(500).json({ message: err.message });
    }
  });

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