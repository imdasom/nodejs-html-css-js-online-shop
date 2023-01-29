import CategoryRepository from "../repositories/CategoryRepository.js";

function CategoryService() {

  return {
    getCategoryList: () => {
      return CategoryRepository.select();
    },
    getCategoryById: (id, depth) => {
      const category = CategoryRepository.selectById(Number(id), Number(depth));
      if (category) {
        return category;
      }
      throw new Error(JSON.stringify({statusCode: 204, message: 'CONTENT_NOT_FOUND'}));
    },
    createCategory: (depth, category) => {
      return CategoryRepository.create(Number(depth), category);
    },
    updateCategory: (id, depth, category) => {
      return CategoryRepository.update(Number(id), Number(depth), category);
    },
    deleteCategory: (id, depth) => {
      return CategoryRepository.delete(Number(id), Number(depth));
    },
  }
}


export default CategoryService();