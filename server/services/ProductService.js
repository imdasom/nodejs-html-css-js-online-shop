import ProductRepository from "../repositories/ProductRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";

function ProductService() {
  return {
    getProductList: (filter) => {
      if (filter.category1Id) filter.category1Id = Number(filter.category1Id);
      if (filter.category2Id) filter.category2Id = Number(filter.category2Id);
      if (filter.category3Id) filter.category3Id = Number(filter.category3Id);
      const productList = ProductRepository.select(filter);
      productList?.contents.forEach(product => {
        const category1 = CategoryRepository.selectById(product.category1Id, 1);
        const category2 = CategoryRepository.selectById(product.category2Id, 2);
        const category3 = CategoryRepository.selectById(product.category3Id, 3);
        product.category1Name = category1?.name;
        product.category2Name = category2?.name;
        product.category3Name = category3?.name;
      });
      return productList;
    },
    getProductById: (id) => {
      const product = ProductRepository.selectById(Number(id));
      if (product) {
        const category1 = CategoryRepository.selectById(product.category1Id, 1);
        const category2 = CategoryRepository.selectById(product.category2Id, 2);
        const category3 = CategoryRepository.selectById(product.category3Id, 3);
        product.category1Name = category1?.name;
        product.category2Name = category2?.name;
        product.category3Name = category3?.name;
        return product;
      } else {
        throw new Error(JSON.stringify({statusCode: 204, message: 'CONTENT_NOT_FOUND'}));
      }
    },
    createProduct: (product) => {
      return ProductRepository.create(product);
    },
    updateProduct: (id, product) => {
      if (product.category1Id) product.category1Id = Number(product.category1Id);
      if (product.category2Id) product.category2Id = Number(product.category2Id);
      if (product.category3Id) product.category3Id = Number(product.category3Id);
      ProductRepository.update(id, product);
      return ProductRepository.selectById(id);
    },
    deleteProduct: (id) => {
      return ProductRepository.delete(id);
    }
  }
}

export default ProductService();