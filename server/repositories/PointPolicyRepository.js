import db from "../database/db.js";

function PointPolicyRepository() {
  const list = db.load('POINT_POLICY');

  return {
    select: (filter) => {
      if (!filter) {
        return list;
      }
      const filteredList = list.filter(pointPolicy => {
        if (filter.name && !pointPolicy.name.includes(filter.name)) {
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
      return {
        totalCount: filteredList.length,
        contents: sortedList
      };
    },
    selectById: (id) => {
      const pointPolicy = list.find(item => item.id === Number(id));
      if (pointPolicy) {
        return pointPolicy;
      } else {
        throw new Error(JSON.stringify({statusCode: 204, message: 'CONTENT_NOT_FOUND'}));
      }
    },
    update: () => {
      // TODO
    },
    delete: () => {
      // TODO
    },
    create: () => {
      // TODO
    }
  }
}

export default PointPolicyRepository();