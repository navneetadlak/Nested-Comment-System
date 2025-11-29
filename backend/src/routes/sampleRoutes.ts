import { Router } from 'express';
import Comment from '../models/Comment';

const router = Router();

// Route to create sample data
router.post('/sample-data', async (req, res) => {
    try {
        // Clear existing data
        await Comment.deleteMany({});

        // Create sample comments
        const sampleComments = [
            {
                postId: 'demo-post-123',
                userId: 'user-1',
                content: 'This is the first root comment',
                parentId: null,
            },
            {
                postId: 'demo-post-123',
                userId: 'user-2',
                content: 'This is a reply to the first comment',
                parentId: null,
            },
            {
                postId: 'demo-post-123',
                userId: 'user-3',
                content: 'This is another root comment',
                parentId: null,
            }
        ];

        const createdComments = await Comment.insertMany(sampleComments);

        // Update the second comment to be a reply to the first one
        if (createdComments.length >= 2) {
            await Comment.findByIdAndUpdate(
                createdComments[1]._id,
                { parentId: createdComments[0]._id.toString() }
            );

            // Create a nested reply
            await Comment.create({
                postId: 'demo-post-123',
                userId: 'user-4',
                content: 'This is a nested reply to the reply!',
                parentId: createdComments[1]._id.toString(),
            });
        }

        res.json({
            message: 'Sample data created successfully',
            comments: await Comment.find({ postId: 'demo-post-123' })
        });
    } catch (error) {
        console.error('Error creating sample data:', error);
        res.status(500).json({ error: 'Failed to create sample data' });
    }
});

// Route to get all comments (for debugging)
router.get('/debug/comments', async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

export default router;