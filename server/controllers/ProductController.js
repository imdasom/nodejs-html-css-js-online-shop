import {HOST_URL} from "../constants.js";
import {parseQueryString} from "../utils/network-utils.js";
import ProductService from "../services/ProductService.js";

function ProductController() {
  return {
    handle: (req, res) => {
      const method = req.method;
      const url = new URL(`${HOST_URL}${req.url}`);
      const pathname = url.pathname;
      let queryString = req.url.split('?').length > 1
        ? parseQueryString(req.url.split('?')[1])
        : null;

      if (/\/api\/products$/.test(pathname)) {
        if (method === 'GET') {
          const productList = ProductService.getProductList(queryString);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(productList));
          return;
        }

        if (method === 'POST') {
          let body = '';
          req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
              throw new Error(JSON.stringify({ statusCode: 500, message: 'EXCEED_BODY_CONTENT_LENGTH' }));
          });
          req.on('end', function () {
            try {
              const params = JSON.parse(body);
              const product = ProductService.createProduct(params);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(product));
            } catch (error) {
              const errorObj = JSON.parse(error.message);
              res.statusCode = errorObj.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(error.message);
            }
          });
          return;
        }

        throw new Error(JSON.stringify({ statusCode: 405, message: 'METHOD_NOT_ALLOWED' }));
      }

      if (/\/api\/products\/(\d)*$/.test(pathname)) {
        if (method === 'GET') {
          const id = pathname.split('/')[3];
          const product = ProductService.getProductById(id);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(product));
          return;
        }

        if (method === 'PUT') {
          const id = pathname.split('/')[3];
          let body = '';
          req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
              throw new Error(JSON.stringify({ statusCode: 500, message: 'EXCEED_BODY_CONTENT_LENGTH' }));
          });
          req.on('end', function () {
            const params = JSON.parse(body);
            const product = ProductService.updateProduct(id, params);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(product));
          });
          return;
        }

        if (method === 'DELETE') {
          const id = pathname.split('/')[3];
          ProductService.deleteProduct(id);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end();
          return;
        }

        throw new Error(JSON.stringify({ statusCode: 405, message: 'METHOD_NOT_ALLOWED' }));
      }
    }
  }
}

export default ProductController();