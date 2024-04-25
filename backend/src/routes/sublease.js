import { Router } from 'express';
import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'
import { createSublease, getSublease, deleteSublease, getSubleases, updateSublease, saveSublease, deleteSavedSublease, getSavedSubleases } from "../database/sublease.js";

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
  if (!req.query) {
    return res.status(400).json({ message: "invalid params" });
  }

  try {
    const subleases = await getSubleases(req.query);
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

router.put('/update', async (req, res) =>{
  try{
    const subleaseData = req.body.sublease_data;

    const result = await updateSublease(subleaseData);

    res.status(201).json({
      message: 'Sublease updated successfully',
      data: result // This could be the newly created sublease object/ID
    });
  } catch (error) {
    console.error('Error updated sublease:', error);

    res.status(500).json(createErrorObj('Error updating sublease', error.message));
  }
});

router.post('/save', async (req, res) =>{
  try {
    const {user_id, sublease_id} = req.body;
    console.log(user_id)
    console.log(sublease_id)
    if(!user_id || !sublease_id){
      return res.status(400).json({ error: "Missing required fields: user_id, sublease_id." });
    }
    await saveSublease(user_id, sublease_id);
    res.json({ message: 'Sublease successfully saved' });
  } catch (error) {
    console.error("Error saving sublease: ", error);
    res.status(500).json(createErrorObj('Error saving sublease', error.message));
  }
});

router.delete('/delete-save', async (req, res) =>{
  try {
    const {user_id, sublease_id} = req.query;
    if(!user_id || !sublease_id){
      return res.status(400).json({ error: "Missing required fields: user_id, sublease_id." });
    }
    await deleteSavedSublease(user_id, sublease_id);
    res.json({ message: 'Sublease successfully deleted' });
  } catch (error) {
    console.error("Error deleting sublease: ", error);
    res.status(500).json(createErrorObj('Error deleting sublease', error.message));
  }
});

router.get('/get-saves', async (req, res) =>{
  try {
    const {user_id} = req.query;
    console.log(user_id)
    if(!user_id){
      return res.status(400).json({ error: "Missing required fields: user_id." });
    }
    const subleases = await getSavedSubleases(user_id);
    res.json(subleases);
  } catch (error) {
    console.error("Error getting saved sublease: ", error);
    res.status(500).json(createErrorObj('Error geting saved sublease', error.message));
  }
});

export default router