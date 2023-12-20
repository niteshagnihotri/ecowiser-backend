import express from 'express';
import multer from 'multer';
import Image from '../models/image.js';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const base64String = req.file.buffer.toString('base64');
    let imageUrl = `data:${req.file.mimetype};base64,${base64String}`

    const newImage = new Image({
      data: imageUrl
    });

    const savedImage = await newImage.save();

    res.json({ data: savedImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: 'image not found' });
    }
    res.json({ image });
  } catch (error) {
    console.error('Error fetching image:', error);
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
