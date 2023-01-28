import { getRandomDate } from '../utils/date-utils.js';
import { getRandomNumber, sample } from '../utils/collection-utils.js';

const PRODUCT_INIT_LENGTH = 113;
const POINT_POLICY_INIT_LENGTH = 32;

function Database() {
  const POINT_POLICY = Array.from({ length: POINT_POLICY_INIT_LENGTH }).map((v, i) => {
    const createdAt = getRandomDate('YYYYMMDDHHmmss');
    const hasReview = getRandomNumber(0, 2000);
    const hasBuy = getRandomNumber(0, 2000);
    return {
      id: i + 1,
      name: `포인트정책명 ${String(i + 1).padStart(3, '0')}`,
      createdAt: createdAt,
      updatedAt: createdAt,
      review: hasReview > 1000 ? {
        type: 'RATE',
        value: getRandomNumber(1, 15),
        limit: getRandomNumber(1, 10) * 100
      } : null,
      buy: hasBuy > 1000 ? {
        type: 'AMOUNT',
        value: getRandomNumber(10, 100) * 100,
      } : null
    };
  });

  const SUPPLIER_ID = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
  const POINT_POLICY_ID = POINT_POLICY.map(item => item.id);
  const CATEGORY = [ 'COSMETIC', 'FOOD', 'DRINKS', 'APPAREL' ];
  const STATUS = [ 'ON_SALE', 'SALE_END', 'READY', 'ON_SALE' ]
  const PRODUCT = Array.from({ length: PRODUCT_INIT_LENGTH }).map((v, i) => {
    const createdAt = getRandomDate('YYYYMMDDHHmmss');
    return {
      id: new Date().getTime() + i,
      supplierId: sample(SUPPLIER_ID),
      name: `상품 ${String(i + 1).padStart(3, '0')}`,
      price: getRandomNumber(10, 990) * 100,
      status: sample(STATUS),
      createdAt: createdAt,
      updatedAt: createdAt,
      category: sample(CATEGORY),
      pointPolicyId: sample(POINT_POLICY_ID),
      deleted: false,
      imageUrls: [`https://picsum.photos/200/300?random=${i + 1}`]
    }
  });

  return {
    load: (tableName) => {
      if (tableName === 'PRODUCT') {
        return PRODUCT;
      }

      if (tableName === 'POINT_POLICY') {
        return POINT_POLICY;
      }
    }
  }
}

const db = Database();
export default db;
