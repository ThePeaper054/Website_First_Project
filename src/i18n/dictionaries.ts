import type { Locale } from "./locales";

export type TranslationKey =
  | "nav.home"
  | "nav.artwork"
  | "nav.contact"
  | "nav.shopAll"
  | "nav.whatsBest"
  | "nav.accessories"
  | "nav.allAccessories"
  | "nav.homeAria"
  | "nav.primaryAria"
  | "nav.menuAria"
  | "nav.openMenuAria"
  | "nav.closeMenuAria"
  | "shop.title"
  | "shop.category.simpleForMe"
  | "shop.category.imADramaQueen"
  | "shop.category.darknessMyOldFriend"
  | "shop.category.shopForMyLife"
  | "shop.allHint"
  | "shop.filteredHint"
  | "shop.unknownCategory"
  | "shop.loading"
  | "accessories.title"
  | "accessories.hint"
  | "artwork.scrollPrevAria"
  | "artwork.scrollNextAria"
  | "lang.switcherAria";

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  "nav.home": "Home",
  "nav.artwork": "Artwork",
  "nav.contact": "Contact",
  "nav.shopAll": "Shop all",
  "nav.whatsBest": "What's best for me",
  "nav.accessories": "Accessories",
  "nav.allAccessories": "All accessories",
  "nav.homeAria": "Nara Nails home",
  "nav.primaryAria": "Primary",
  "nav.menuAria": "Menu",
  "nav.openMenuAria": "Open menu",
  "nav.closeMenuAria": "Close menu",
  "shop.title": "Shop",
  "shop.category.simpleForMe": "Simple for me",
  "shop.category.imADramaQueen": "Im a drama queen",
  "shop.category.darknessMyOldFriend": "Darkness my old friend",
  "shop.category.shopForMyLife": "Shop for my life",
  "shop.allHint": "All styles",
  "shop.filteredHint": "Filtered by this category",
  "shop.unknownCategory":
    "That category was not found — showing all styles instead",
  "shop.loading": "Loading shop…",
  "accessories.title": "Accessories",
  "accessories.hint": "All accessories",
  "artwork.scrollPrevAria": "Scroll products left",
  "artwork.scrollNextAria": "Scroll products right",
  "lang.switcherAria": "Change language",
};

const he: Dictionary = {
  "nav.home": "בית",
  "nav.artwork": "יצירות",
  "nav.contact": "צור קשר",
  "nav.shopAll": "כל החנות",
  "nav.whatsBest": "מה הכי מתאים לי",
  "nav.accessories": "אקססוריז",
  "nav.allAccessories": "כל האקססוריז",
  "nav.homeAria": "נרה ניילס — דף הבית",
  "nav.primaryAria": "ניווט ראשי",
  "nav.menuAria": "תפריט",
  "nav.openMenuAria": "פתח תפריט",
  "nav.closeMenuAria": "סגור תפריט",
  "shop.title": "חנות",
  "shop.category.simpleForMe": "פשוט בשבילי",
  "shop.category.imADramaQueen": "אני דרמה קווין",
  "shop.category.darknessMyOldFriend": "החושך חברי הוותיק",
  "shop.category.shopForMyLife": "קניות לחיים שלי",
  "shop.allHint": "כל הסגנונות",
  "shop.filteredHint": "מסונן לפי קטגוריה זו",
  "shop.unknownCategory": "הקטגוריה לא נמצאה — מוצגים כל הסגנונות",
  "shop.loading": "טוען את החנות…",
  "accessories.title": "אקססוריז",
  "accessories.hint": "כל האקססוריז",
  "artwork.scrollPrevAria": "גלול מוצרים שמאלה",
  "artwork.scrollNextAria": "גלול מוצרים ימינה",
  "lang.switcherAria": "החלפת שפה",
};

const ar: Dictionary = {
  "nav.home": "الرئيسية",
  "nav.artwork": "أعمال فنية",
  "nav.contact": "اتصل بنا",
  "nav.shopAll": "تسوق الكل",
  "nav.whatsBest": "ما الأنسب لي",
  "nav.accessories": "إكسسوارات",
  "nav.allAccessories": "كل الإكسسوارات",
  "nav.homeAria": "نارا نيلز — الصفحة الرئيسية",
  "nav.primaryAria": "التنقل الرئيسي",
  "nav.menuAria": "القائمة",
  "nav.openMenuAria": "فتح القائمة",
  "nav.closeMenuAria": "إغلاق القائمة",
  "shop.title": "المتجر",
  "shop.category.simpleForMe": "بساطة تناسبني",
  "shop.category.imADramaQueen": "أنا دراما كوين",
  "shop.category.darknessMyOldFriend": "الظلام صديقي القديم",
  "shop.category.shopForMyLife": "تسوق لحياتي",
  "shop.allHint": "كل الأنماط",
  "shop.filteredHint": "مفلتر حسب هذه الفئة",
  "shop.unknownCategory": "لم يتم العثور على الفئة — عرض كل الأنماط",
  "shop.loading": "جاري تحميل المتجر…",
  "accessories.title": "إكسسوارات",
  "accessories.hint": "كل الإكسسوارات",
  "artwork.scrollPrevAria": "تمرير المنتجات إلى اليسار",
  "artwork.scrollNextAria": "تمرير المنتجات إلى اليمين",
  "lang.switcherAria": "تغيير اللغة",
};

const ru: Dictionary = {
  "nav.home": "Главная",
  "nav.artwork": "Работы",
  "nav.contact": "Контакты",
  "nav.shopAll": "Весь магазин",
  "nav.whatsBest": "Что мне подойдёт",
  "nav.accessories": "Аксессуары",
  "nav.allAccessories": "Все аксессуары",
  "nav.homeAria": "Nara Nails — главная",
  "nav.primaryAria": "Основная навигация",
  "nav.menuAria": "Меню",
  "nav.openMenuAria": "Открыть меню",
  "nav.closeMenuAria": "Закрыть меню",
  "shop.title": "Магазин",
  "shop.category.simpleForMe": "Просто для меня",
  "shop.category.imADramaQueen": "Я королева драмы",
  "shop.category.darknessMyOldFriend": "Тьма, старый друг",
  "shop.category.shopForMyLife": "Шопинг для жизни",
  "shop.allHint": "Все стили",
  "shop.filteredHint": "Фильтр по этой категории",
  "shop.unknownCategory": "Категория не найдена — показаны все стили",
  "shop.loading": "Загрузка магазина…",
  "accessories.title": "Аксессуары",
  "accessories.hint": "Все аксессуары",
  "artwork.scrollPrevAria": "Прокрутить товары влево",
  "artwork.scrollNextAria": "Прокрутить товары вправо",
  "lang.switcherAria": "Сменить язык",
};

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  he,
  ar,
  ru,
};
