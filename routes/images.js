import express from 'express';
import multer from 'multer';
import Image from '../models/image.js';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const savedImage = await newImage.save();

    res.json({ imageId: savedImage._id });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:imageId', async (req, res) => {
  const { imageId } = req.params;

  try {
    const deletedImage = await Image.deleteOne({ _id: imageId });

    if (!deletedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully', deletedImage });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
