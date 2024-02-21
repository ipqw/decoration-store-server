import express from 'express';
import addressController from '../controllers/addressController';

export const addressRouter = express();

addressRouter.get('/', addressController.getAllAddresses);
addressRouter.get('/:id', addressController.getOneAddress);
addressRouter.post('/', addressController.createAddress);
addressRouter.put('/:id', addressController.updateAddress);
addressRouter.delete('/:id', addressController.deleteAddress);
