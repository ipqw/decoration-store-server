import express from 'express';
import likeController from '../controllers/likeController';

export const likeRouter = express();

likeRouter.get('/', likeController.getAllLikes);
likeRouter.get('/:id', likeController.getOneLike);
likeRouter.post('/', likeController.createLike);
likeRouter.delete('/:id', likeController.deleteLike);
