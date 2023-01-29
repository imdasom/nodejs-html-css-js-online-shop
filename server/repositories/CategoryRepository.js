import { now } from '../utils/date-utils.js';
import db from "../database/db.js";

function CategoryRepository() {
  let list = db.load('CATEGORIES');

  return {
    select: function () {
      const sortedList = list.sort((p1, p2) => {
        const target1 = p1.createdAt;
        const target2 = p2.createdAt;
        return target1.localeCompare(target2);
      });
      return {
        contents: sortedList
      };
    },
    selectById: function (id, depth) {
      let category;
      if (depth === 1) {
        category = list.find(category1 => category1.id === Number(id));
      } else if (depth === 2) {
        category = list.map(category1 => category1?.child)?.flat()?.find(category2 => category2.id === Number(id));
      } else if (depth === 3) {
        category = list.map(category1 => category1?.child)?.flat()?.map(category2 => category2?.child)?.flat()?.find(category3 => category3.id === Number(id));
      } else {
        throw new Error(JSON.stringify({statusCode: 400, message: 'CATEGORY_STEP_IS_UNDER_3'}));
      }

      return category;
    },
    update: function (id, depth, newCategory) {
      const oldCategory = this.selectById(id, depth);
      if (newCategory.name) oldCategory.name = newCategory.name;
      oldCategory.updatedAt = now('YYYYMMDDHHmmss');
      return oldCategory;
    },
    delete: function (id, depth) {
      if (depth === 1) {
        list = list.filter(c => c.id !== id);
      } else if (depth === 2) {
        list.forEach(c1 => {
          c1.child = c1.child?.filter(c2 => c2.id !== id);
        });
      } else if (depth === 3) {
        list.forEach(c1 => {
          c1?.child?.forEach(c2 => {
            c2.child = c2.child?.filter(c3 => c3.id !== id);
          });
        });
      } else {
        throw new Error(JSON.stringify({statusCode: 400, message: 'CATEGORY_DEPTH_IS_UNDER_3'}));
      }
    },
    create: (depth, category) => {
      const { name, parentId } = category;
      if (!name) throw new Error(JSON.stringify({ statusCode: 400, message: 'NAME_REQUIRED' }));
      if (parentId && !depth) throw new Error(JSON.stringify({ statusCode: 400, message: 'CATEGORY_DEPTH_REQUIRED' }));
      if (depth > 1 && !parentId) throw new Error(JSON.stringify({ statusCode: 400, message: 'PARENT_ID_REQUIRED' }));
      const createdAt = now('YYYYMMDDHHmmss');
      const newCategory = {
        id: new Date().getTime(),
        createdAt: createdAt,
        updatedAt: createdAt,
        name,
        child: []
      };
      if (depth === 1) {
        list = list.push(newCategory);
      } else if (depth === 2) {
        list.forEach(c1 => {
          if (c1.id === Number(parentId)) {
             c1.child?.push(newCategory);
          }
        });
      } else if (depth === 3) {
        list.forEach(c1 => {
          c1.child?.forEach(c2 => {
            if (c2.id === Number(parentId)) {
              c2.child?.push(newCategory);
            }
          });
        });
      } else {
        throw new Error(JSON.stringify({statusCode: 400, message: 'CATEGORY_DEPTH_IS_UNDER_3'}));
      }
      return newCategory;
    }
  }
}

export default CategoryRepository();