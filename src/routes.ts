import { Router } from 'express';
import UserController from './controllers/UserController';
import CrowlerController from './controllers/CrowlerController';

const routes = Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.get('/hi', (req, res) => res.json({ msg: 'Hi' }));
routes.get('/ecac', CrowlerController.index);

export default routes;
