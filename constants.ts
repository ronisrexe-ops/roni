
import { Walker, Article, Product, DogVideo, BreedInfo } from './types';

export const PLATFORM_COMMISSION_RATE = 0.20;
export const BUSINESS_PROMOTION_MONTHLY = 250; 
export const BUSINESS_PROMOTION_ANNUAL = 2500; 

export const CUBE_ADDON_MONTHLY = 80; 
export const CUBE_ADDON_ANNUAL = 50;  

export const ISRAEL_CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'בני ברק', 'באר שבע', 'חולון',
  'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'הרצליה', 'כפר סבא', 'רעננה', 'חדרה', 'מודיעין', 'נהריה',
  'רמלה', 'לוד', 'גבעתיים', 'קריית גת', 'רמת השרון', 'עפולה', 'נצרת', 'קריית אתא', 'טבריה', 'עכו'
];

export const DOG_BREEDS_LIST = [
  'שיצו', 'גולדן רטריבר', 'רועה גרמני', 'פודל', 'בולדוג צרפתי', 'ביגל', 'לברדור', 'מלטז', 'פינצ׳ר', 'בורדר קולי', 
  'פאג', 'דוברמן', 'בוקסר', 'צ׳יוואווה', 'האסקי סיבירי', 'קאנה קורסו', 'רוטוויילר', 'בולטרייר', 'בישון פריזה', 'אמסטף', 
  'סמוייד', "קאבליר קינג צ'ארלס", 'ויסלה', 'סטר אירי', 'דלמטי', 'אקיטה', 'באסט האונד', 'בולדוג אנגלי', 'גרייאהונד', 'וימרנר', 
  'טרייר אירי', 'מלטזי', 'ניופאונדלנד', 'סן ברנרד', 'פאפיון', 'צ׳או צ׳או', 'קוקר ספניאל', 'רועה אוסטרלי', 'שיבא אינו', 'פיטבול',
  'בול מסטיף', 'גרייהאונד איטלקי', 'דני ענק', 'יורקשייר טרייר', 'כנעני', 'פאג סיני', 'פומרניאן', 'פוקס טרייר', 'קולי', 'רועה בלגי'
];

// Final Reliable Image Pool for Production Launch
const STABLE_DOG_IMAGES = {
    'TRAINING': ['1583511655857-d19b40a7a54e', '1537151608828-ea2b11777ee8', '1587300003388-59208cc962cb'],
    'HEALTH': ['1583337130417-3346a1be7dee', '1628009368231-7bb7cfcb0def', '1596202891395-930c52ee523b'],
    'RESEARCH': ['1581091226825-a6a2a5aee158', '1554734867-bf3c00a49371'],
    'NUTRITION': ['1589924691106-073b69759f7b', '1535930891776-0c2dfb7fda1a'],
    'KIDS': ['1516734212186-a967f81ad0d7', '1535930749574-139a327ce78f'],
    'BEHAVIOR': ['1518717758536-85ae29035b6d', '1544568100-847a948585b9'],
    'BREED': ['1543466835-00a7907e9de1', '1517849845537-4d257902454a', '1530281700549-e82e7bf110d6', '1552053831-71594a27632d'],
    'VIDEO': ['1534361960057-19889db9621e', '1507146426996-ef05306b995a']
};

const getDogContentImage = (category: string, id: number) => {
    const pool = (STABLE_DOG_IMAGES as any)[category] || STABLE_DOG_IMAGES.BREED;
    const imageId = pool[id % pool.length];
    // For Production: Using source.unsplash.com as fallback + specific ID format for maximum stability
    return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800`;
};

// Generate 50 Breed Info Objects
export const MOCK_BREEDS_DATA: BreedInfo[] = DOG_BREEDS_LIST.map((name, i) => ({
    id: `breed-${i}`,
    name: name,
    englishName: `Breed ${i}`,
    intelligence: (i % 5) + 1,
    shedding: (i % 3) + 1,
    energy: (i % 4) + 2,
    origin: i % 2 === 0 ? 'אירופה' : 'אסיה',
    image: getDogContentImage('BREED', i),
    description: `הגזע ${name} ידוע בזכות אופיו המיוחד והקשר העמוק שלו עם בני אדם. כלב משפחה נהדר ופעיל.`,
    pros: ['נאמן מאוד', 'חכם וקל לאילוף', 'מצוין עם ילדים'],
    cons: ['דורש פעילות רבה', 'נטייה לנשירה']
}));

export const MOCK_ARTICLES: Article[] = [];
export const MOCK_VIDEOS: DogVideo[] = [];

// Populate 150+ Articles
DOG_BREEDS_LIST.forEach((breed, idx) => {
    const cats = ['RESEARCH', 'TRAINING', 'HEALTH', 'NUTRITION', 'KIDS', 'BEHAVIOR'];
    
    MOCK_ARTICLES.push({
        id: `art-b-${idx}`,
        title: `המדריך המלא לגידול ${breed}`,
        excerpt: `כל מה שצריך לדעת על ${breed}: אופי, בריאות וטיפים לאורח חיים בריא.`,
        category: 'TRAINING',
        image: getDogContentImage('BREED', idx),
        readTime: '6 דק׳',
        content: `מאמר מעמיק זה סוקר את כל המאפיינים של גזע ה-${breed}. לפי מחקרים עדכניים...`
    });

    cats.forEach((cat, cIdx) => {
        if (idx < 25) { 
            MOCK_ARTICLES.push({
                id: `art-g-${idx}-${cIdx}`,
                title: `${cat === 'RESEARCH' ? 'מחקר חדש:' : 'טיפ מקצועי:'} ${['איך למנוע חרדה', 'תזונה מאוזנת', 'משחקים בבית', 'התמודדות עם רעשים'][cIdx % 4]}`,
                excerpt: 'מומחי GoDog ריכזו עבורכם את המידע החשוב ביותר לשמירה על רווחת הכלב.',
                category: cat,
                image: getDogContentImage(cat, idx + cIdx),
                readTime: '4 דק׳',
                content: 'תוכן המאמר המלא המבוסס על ידע וטרינרי וניסיון של שנים בשטח...'
            });
        }
    });
});

// Generate 60 Videos
for(let i=1; i<=60; i++) {
    MOCK_VIDEOS.push({
        id: `v${i}`,
        title: `פרק ${i}: ${['אילוף בסיסי', 'טיפול בקיץ', 'מנהיגות בטיול', 'תקשורת עם הכלב'][i % 4]}`,
        thumbnail: getDogContentImage('VIDEO', i),
        duration: `0${(i%5)+3}:20`,
        category: ['TRAINING', 'HEALTH', 'BEHAVIOR'][i % 3]
    });
}

export const MOCK_WALKERS: Walker[] = [
  {
    id: '1', businessId: 'GD-W-0001', name: 'נועם כהן', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    rating: 4.9, city: 'תל אביב', pricePerHour: 50, pricePerNight: 150, services: ['WALKING', 'PENSION'],
    bio: 'אוהב כלבים מושבע, מנוסה עם כלבים גדולים וקטנים כאחד.', isAvailable: true, reviewsCount: 120, experienceYears: 5, isPromoted: true,
    role: 'WALKER',
    marketingProfile: { photos: [], description: 'שירותי טיול VIP', recommendations: [], expertTips: [], promotionStatus: 'PREMIUM', deals: [
        { id: 'd1', title: '30% הנחה לטיול ראשון', description: 'מבצע היכרות לכלבים חדשים בשכונה!', images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'], businessName: 'נועם כהן', businessId: 'GD-W-0001', category: 'WALKING', city: 'תל אביב' }
    ] }
  },
  {
    id: '2', businessId: 'GD-P-0002', name: 'ד"ר רותם וייס', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=400',
    rating: 5.0, city: 'רמת גן', pricePerHour: 0, pricePerSession: 250, services: ['VETERINARY'],
    bio: 'וטרינרית מוסמכת עם 15 שנות ניסיון.', isAvailable: true, reviewsCount: 85, experienceYears: 15, isPromoted: true,
    role: 'PROFESSIONAL',
    marketingProfile: { photos: [], description: 'מרפאה מתקדמת', recommendations: [], expertTips: [], promotionStatus: 'PREMIUM', deals: [] }
  },
  {
    id: '3', businessId: 'GD-S-0003', name: 'החנות של פיצי', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400',
    rating: 5.0, city: 'תל אביב', pricePerHour: 0, services: ['SHOP'],
    bio: 'כל מה שהכלב שלך צריך.', isAvailable: true, reviewsCount: 300, experienceYears: 10, isPromoted: true,
    role: 'STORE_OWNER',
    marketingProfile: { deals: [], promotionStatus: 'PREMIUM', photos: [], description: 'חנות חיות מובחרת', recommendations: [], expertTips: [] }
  }
];

export const MOCK_PRODUCTS: Product[] = [];
