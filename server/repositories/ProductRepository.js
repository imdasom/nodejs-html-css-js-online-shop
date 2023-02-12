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
        if (filter.category1Id && product.category1Id !== filter.category1Id) {
          return false;
        }
        if (filter.category2Id && product.category2Id !== filter.category2Id) {
          return false;
        }
        if (filter.category3Id && product.category3Id !== filter.category3Id) {
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
      return list.find(product => product.id === Number(id));
    },
    update: function (id, newProduct) {
      const oldProduct = this.selectById(id);
      if (newProduct.name) oldProduct.name = newProduct.name;
      if (newProduct.supplierId) oldProduct.supplierId = newProduct.supplierId;
      if (newProduct.supplierName) oldProduct.supplierName = newProduct.supplierName;
      if (newProduct.category) oldProduct.category = newProduct.category; // @deprecated
      if (newProduct.category1Id !== undefined) oldProduct.category1Id = newProduct.category1Id;
      if (newProduct.category2Id !== undefined) oldProduct.category2Id = newProduct.category2Id;
      if (newProduct.category3Id !== undefined) oldProduct.category3Id = newProduct.category3Id;
      if (newProduct.pointPolicyId) oldProduct.pointPolicyId = newProduct.pointPolicyId;
      if (newProduct.price) oldProduct.price = newProduct.price;
      if (newProduct.imageUrls) oldProduct.imageUrls = newProduct.imageUrls;
      if (newProduct.status) oldProduct.status = newProduct.status;
      oldProduct.updatedAt = now('YYYYMMDDHHmmss');
    },
    delete: function (id) {
      const product = this.selectById(id);
      product.deleted = true;
    },
    create: (product) => {
      if (!product.name) throw new Error(JSON.stringify({ statusCode: 400, message: 'NAME_REQUIRED' }));
      if (!product.imageUrls) throw new Error(JSON.stringify({ statusCode: 400, message: 'IMAGE_URLS_REQUIRED' }));
      if (!product.price) throw new Error(JSON.stringify({ statusCode: 400, message: 'PRICE_REQUIRED' }));
      if (!product.status) throw new Error(JSON.stringify({ statusCode: 400, message: 'STATUS_REQUIRED' }));
      if (!product.category1Id) throw new Error(JSON.stringify({ statusCode: 400, message: 'CATEGORY_1_ID_REQUIRED' }));
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