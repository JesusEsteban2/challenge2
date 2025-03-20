import { Router } from 'express';
import { productController } from '../product.controller.js';

const filmRepo = new ProductRepo();
const productControl = new productController(filmRepo);

export class CreateRouter {
    createProductRouter() {
        console.log('Creating Product Router');
        const productRouter = Router();

        // getAll
        productRouter.get('/', productControl.getAll.bind(productControl));
        // getById
        productRouter.get('/:id', productControl.getById.bind(productControl));
        // add film
        productRouter.post('/', productControl.post.bind(productControl));
        // modify by id
        productRouter.patch('/:id', productControl.patch.bind(productControl));
        //delete
        productRouter.delete(
            '/:id',
            productControl.delete.bind(productControl),
        );

        return productRouter;
    }
}
