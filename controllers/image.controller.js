import { uploadToCloudinary } from '../services/cloudinary.service.js';
import axios from 'axios';
import logger from '../utils/logger.js';

// @desc    Generate Image
// @route   POST /api/image/generate
// @access  Public
export const generateImage = async (req, res, next) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        console.log(`[Backend] Received image generation request for prompt: "${prompt}"`);
        logger.info(`[Image Generation] Generating image for prompt: "${prompt}"`);

        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        // Fetch the image as a buffer
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Upload to Cloudinary
        const cloudResult = await uploadToCloudinary(buffer, {
            folder: 'generated_images',
            public_id: `gen_${Date.now()}`
        });

        logger.info(`[Image Generation] Image uploaded to Cloudinary: ${cloudResult.secure_url}`);

        res.status(200).json({
            success: true,
            data: cloudResult.secure_url
        });
    } catch (error) {
        logger.error(`[Image Generation] Error: ${error.message}`);
        next(error);
    }
};
