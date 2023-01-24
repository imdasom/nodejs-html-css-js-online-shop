import PointPolicyRepository from "../repositories/PointPolicyRepository.js";
import {HOST_URL} from "../constants.js";

function PointPolicyController() {

  const getPointPolicyList = (filter) => {
    return PointPolicyRepository.select(filter);
  }

  const getPointPolicyById = (id) => {
    return PointPolicyRepository.selectById(id);
  }

  return {
    handle: (req, res) => {
      const method = req.method;
      const url = new URL(`${HOST_URL}${req.url}`);
      const pathname = url.pathname;
      const queryString = url.searchParams;

      if (/\/point-policy$/.test(pathname)) {
        if (method === 'GET') {
          const pointPolicyList = getPointPolicyList(queryString);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(pointPolicyList));
          return;
        }

        throw new Error({ statusCode: 405, message: 'METHOD_NOT_ALLOWED' });
      }

      if (/\/point-policy\/(\d)*$/.test(pathname)) {
        if (method === 'GET') {
          const id = pathname.split('/')[2];
          const pointPolicy = getPointPolicyById(id);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(pointPolicy));
          return;
        }

        throw new Error({ statusCode: 405, message: 'METHOD_NOT_ALLOWED' });
      }
    }
  }
}

export default PointPolicyController();