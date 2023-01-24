import { now } from '../utils/date-utils.js';
import db from "../database/db.js";

function ProductRepository() {
  const list = db.load('PRODUCT');

  return {
    select: function (filter) {
      if (!filter) {
          filter = {};
          filter.sortOrder = 'DESC';
          filter.sortTarget = 'UPDATED_AT';
          filter.page = 1;
          filter.pageSize = 50;
      }

      const filteredList = list.filter(product => {
        if (product.deleted) {
          return false;
        }
        if (filter.name && !product.name.includes(filter.name)) {
          return false;
        }
        if (filter.category && product.category !== filter.category) {
          return false;
        }
        if (filter.supplierId && product.supplierId !== filter.supplierId) {
          return false;
        }
        if (filter.createdAtStart && product.createdAt < filter.createdAtStart) {
          return false;
        }
        if (filter.createdAtEnd && product.createdAt > filter.createdAtEnd) {
          return false;
        }
        if (filter.status && product.status === filter.status) {
          return false;
        }
        return true;
      });

      const sortedList = filteredList.sort((p1, p2) => {
        const order = filter.sortOrder || 'DESC';
        const target = filter.sortTarget || 'UPDATED_AT';
        const targetMap = {
          CREATED_AT: 'createdAt',
          UPDATED_AT: 'updatedAt',
          NAME: 'name',
        }
        const target1 = p1[targetMap[target]];
        const target2 = p2[targetMap[target]];
        return order === 'ASC' ? target1.localeCompare(target2) : target2.localeCompare(target1);
      });

      const page = filter.page ? Number(filter.page) : 1;
      const pageSize = filter.pageSize ? Number(filter.pageSize) : 50;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedList = sortedList.slice(startIndex, endIndex);
      return {
        totalCount: filteredList.length,
        contents: paginatedList
      };
    },
    selectById: function (id) {
      const product = list.find(product => product.id === Number(id));
      if (product) {
        return product;
      } else {
        throw new Error(JSON.stringify({statusCode: 204, message: 'CONTENT_NOT_FOUND'}));
      }
    },
    update: function (id, newProduct) {
      const oldProduct = this.selectById(id);
      if (newProduct.name) oldProduct.name = newProduct.name;
      if (newProduct.supplierId) oldProduct.supplierId = newProduct.supplierId;
      if (newProduct.supplierName) oldProduct.supplierName = newProduct.supplierName;
      if (newProduct.category) oldProduct.category = newProduct.category;
      if (newProduct.pointPolicyId) oldProduct.pointPolicyId = newProduct.pointPolicyId;
      if (newProduct.price) oldProduct.price = newProduct.price;
      if (newProduct.imageUrls) oldProduct.price = newProduct.imageUrls;
      if (newProduct.status) oldProduct.status = newProduct.status;
      oldProduct.updatedAt = now('YYYYMMDDHHmmss');
      return oldProduct;
    },
    delete: function (id) {
      const product = this.selectById(id);
      product.deleted = true;
    },
    create: (product) => {
      if (!product.name) throw new Error(JSON.stringify({ statusCode: 400, message: 'NAME_REQUIRED' }));
      if (!product.category) throw new Error(JSON.stringify({ statusCode: 400, message: 'CATEGORY_REQUIRED' }));
      if (!product.imageUrls) throw new Error(JSON.stringify({ statusCode: 400, message: 'IMAGE_URLS_REQUIRED' }));
      if (!product.price) throw new Error(JSON.stringify({ statusCode: 400, message: 'PRICE_REQUIRED' }));
      if (!product.status) throw new Error(JSON.stringify({ statusCode: 400, message: 'STATUS_REQUIRED' }));
      const createdAt = now('YYYYMMDDHHmmss');
      const newProduct = {
        id: new Date().getTime(),
        createdAt: createdAt,
        updatedAt: createdAt,
        deleted: false,
        ...product,
      };
      list.push(newProduct);
      return newProduct;
    }
  }
}

export default ProductRepository();