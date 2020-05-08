import { Request, Response } from 'express';
import EcacCrwl from '../modules/crawlers/ecac';

class CrowlerController {
    public async index(req: Request, res: Response): Promise<Response> {
        return EcacCrwl.getShot()
            .then((data) => {
                console.log(data);
                return res.json({ msg: 'WORKED' });
            })
            .catch((err) => res.json({ err }));
    }
}

export default new CrowlerController();
