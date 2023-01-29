import { getRandomDate } from '../utils/date-utils.js';
import { getRandomNumber, sample } from '../utils/collection-utils.js';

const PRODUCT_INIT_LENGTH = 113;
const POINT_POLICY_INIT_LENGTH = 32;

function Database() {
  const CATEGORIES = Array.from([
    {
      name: '가구',
      child: [
        { name: '침대', child: [{name: '침대프레임', child: []}, {name: '침대+매트리스', child: []}, {name: '침대부속가구', child: []}] },
        { name: '소파', child: [{name: '일반소파', child: []}, {name: '소파배드', child: []}, {name: '좌식소파', child: []}, {name: '소파스툴', child: []}] },
        { name: '테이블/식탁/책상', child: [{name: '거실테이블', child: []}, {name: '소파테이블', child: []}, {name: '사이드테이블', child: []}, {name: '식탁', child: []}, {name: '책상', child: []}] },
        { name: '의자', child: [{name: '인테리어의자', child: []}, {name: '스툴/벤치', child: []}, {name: '빈백', child: []}, {name: '좌식의자', child: []}] },
      ]
    },
    {
      name: '패브릭',
      child: [
        { name: '커튼/부자재', child: [{name: '암막커튼', child: []}, {name: '일반커튼', child: []}, {name: '레이스커튼', child: []}, {name: '속커튼', child: []}] },
        { name: '러그/카페트', child: [{name: '극세사/단모러그', child: []}, {name: '사이잘룩러그', child: []}, {name: '샤기러그', child: []}] },
        { name: '이불/이불솜', child: [{name: '이불', child: []}, {name: '이불솜/구스', child: []}] },
      ]
    },
    {
      name: '주방용품',
      child: [
        { name: '냄비/프라이팬/솥', child: [{name: '냄비/프라이팬세트', child: []}, {name: '냄비/뚝배기', child: []}, {name: '압력솥/찜솥', child: []}, {name: '프라이팬/그릴', child: []}] },
        { name: '그룻/홈세트', child: [{name: '그릇세트', child: []}, {name: '공기/대접', child: []}, {name: '접시/플레이트', child: []}, {name: '면기/파스타', child: []}, {name: '소스볼/종지', child: []}, {name: '샐러드볼/다용도볼', child: []}] },
        { name: '주방수납/정리', child: [{name: '주방선반/정리대', child: []}, {name: '컵걸이/컵꽂이', child: []}, {name: '수저통', child: []}] },
        { name: '컵', child: [{name: '머그컵', child: []}, {name: '유리컵/물컵', child: []}, {name: '텀블러', child: []}, {name: '주전자/티포트', child: []}, {name: '찾잔/커피잔', child: []}] },
      ]
    },
    {
      name: '조명',
      child: [
        { name: '장스탠드', child: [] },
        { name: '단스탠드', child: [] },
      ]
    },
    {
      name: '수납/정리',
      child: [
        { name: '서랍장/트롤리', child: [{name: '플라스틱서랍장', child: []}, {name: '트롤리/이동식선반', child: []}] },
        { name: '행거', child: [{name: '스탠드행거', child: []}, {name: '이동식행거', child: []}, {name: '고정식행거', child: []}] },
        { name: '선반', child: [] },
      ]
    },
  ]).map((category1, i) => {
    const createdAt = getRandomDate('YYYYMMDDHHmmss');
    return {
      id: Number(createdAt),
      createdAt: createdAt,
      updatedAt: createdAt,
      name: category1.name,
      child: category1.child?.map((category2, i) => {
        const createdAt = getRandomDate('YYYYMMDDHHmmss');
        return {
          id: Number(createdAt),
          createdAt: createdAt,
          updatedAt: createdAt,
          name: category2.name,
          child: category2.child?.map((category3, i) => {
            const createdAt = getRandomDate('YYYYMMDDHHmmss');
            return {
              id: Number(createdAt),
              createdAt: createdAt,
              updatedAt: createdAt,
              name: category3.name,
            };
          })
        };
      })
    }
  });

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
  const STATUS = [ 'ON_SALE', 'SALE_END', 'READY', 'ON_SALE' ];
  const PRODUCT = Array.from({ length: PRODUCT_INIT_LENGTH }).map((v, i) => {
    const createdAt = getRandomDate('YYYYMMDDHHmmss');
    const CATEGORY_1 = CATEGORIES.length === 0 ? null :  sample(CATEGORIES);
    const CATEGORY_2 = CATEGORY_1.child.length === 0 ? null : sample(CATEGORY_1.child);
    const CATEGORY_3 = CATEGORY_2.child.length === 0 ? null : sample(CATEGORY_2.child);
    return {
      id: new Date().getTime() + i,
      supplierId: sample(SUPPLIER_ID),
      name: `상품 ${String(i + 1).padStart(3, '0')}`,
      price: getRandomNumber(10, 990) * 100,
      status: sample(STATUS),
      createdAt: createdAt,
      updatedAt: createdAt,
      category1Id: CATEGORY_1?.id,
      category2Id: CATEGORY_2?.id,
      category3Id: CATEGORY_3?.id,
      category: sample(CATEGORY), // @deprecated
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

      if (tableName === 'CATEGORIES') {
        return CATEGORIES;
      }
    }
  }
}

const db = Database();
export default db;
