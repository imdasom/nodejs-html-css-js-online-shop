import ProductController from "./ProductController.js";
import PointPolicyController from "./PointPolicyController.js";
import CategoryController from "./CategoryController.js";

function MainController() {
  return {
    handle: (req, res) => {
      const pathname = req.url;

      if (/\/api\/products/.test(pathname)) {
        ProductController.handle(req, res);
        return;
      }

      if (/\/api\/point-policy/.test(pathname)) {
        PointPolicyController.handle(req, res);
        return;
      }

      if (/\/api\/categories/.test(pathname)) {
        CategoryController.handle(req, res);
        return;
      }

      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end();
    }
  }
}

export default MainController();
