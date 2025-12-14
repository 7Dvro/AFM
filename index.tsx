import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, Globe, ShoppingCart, User, Wheat, MapPin, Phone, Mail, 
  ChevronRight, ChevronLeft, Plus, Minus, Trash2, Edit, CheckCircle, Search,
  Facebook, Twitter, Instagram, Linkedin, Factory, Truck, Award,
  Calendar, Briefcase, FileText, Upload, Clock, ArrowRight, Save, Image as ImageIcon,
  LayoutDashboard, LogOut, Bell, Lock, ShieldCheck, Package, Star, Info, Leaf, DollarSign,
  Zap, ThumbsUp
} from 'lucide-react';

// --- TYPES & INTERFACES ---

type Language = 'ar' | 'en';
type View = 'home' | 'products' | 'about' | 'contact' | 'admin' | 'login' | 'cart' | 'news' | 'events' | 'careers';

interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  weight: string;
  category: string;
  price: number; // Changed to required for this update
  imageUrl: string;
  description_ar: string;
  description_en: string;
  active: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface NewsItem {
  id: string;
  title_ar: string;
  title_en: string;
  date: string;
  summary_ar: string;
  summary_en: string;
  imageUrl: string;
}

interface EventItem {
  id: string;
  title_ar: string;
  title_en: string;
  date: string;
  location_ar: string;
  location_en: string;
  description_ar: string;
  description_en: string;
  imageUrl: string;
}

interface JobItem {
  id: string;
  title_ar: string;
  title_en: string;
  department_ar: string;
  department_en: string;
  location_ar: string;
  location_en: string;
  type_ar: string;
  type_en: string;
  description_ar: string;
  description_en: string;
  postedDate: string;
}

// --- MOCK DATA (SEEDING) ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name_ar: 'دقيق الشفاء - فاخر',
    name_en: 'Al-Shifa Flour - Premium',
    weight: '25kg',
    category: 'flour',
    price: 45.00,
    imageUrl: 'https://placehold.co/400x600/eab308/ffffff?text=Al-Shifa+25kg',
    description_ar: 'دقيق فاخر متعدد الاستخدامات، مثالي للمخبوزات والمعجنات. يتميز بنقاء عالي ونسبة بروتين متوازنة تضمن أفضل النتائج في الخبز المنزلي والتجاري.',
    description_en: 'Premium all-purpose flour, perfect for baking and pastries. Characterized by high purity and balanced protein ratio ensuring best results for home and commercial baking.',
    active: true
  },
  {
    id: 'p2',
    name_ar: 'دقيق السد',
    name_en: 'Al-Sadd Flour',
    weight: '25kg',
    category: 'flour',
    price: 42.50,
    imageUrl: 'https://placehold.co/400x600/d97706/ffffff?text=Al-Sadd+25kg',
    description_ar: 'دقيق عالي الجودة مصمم خصيصاً للمخابز الآلية والإنتاج الكثيف. يتحمل عمليات العجن القوية ويعطي قواماً متماسكاً للخبز.',
    description_en: 'High quality flour designed specifically for automated bakeries and mass production. Withstands strong kneading processes and gives consistent texture to bread.',
    active: true
  },
  {
    id: 'p3',
    name_ar: 'دقيق رأس الثور',
    name_en: 'Ras Al-Thawr Flour',
    weight: '25kg',
    category: 'flour',
    price: 44.00,
    imageUrl: 'https://placehold.co/400x600/b45309/ffffff?text=Ras+Al-Thawr',
    description_ar: 'دقيق قوي يتميز بمرونة عالية للعجين (Elasticity). الخيار الأمثل للخبز الشعبي والمنتجات التي تتطلب تمدداً عالياً.',
    description_en: 'Strong flour characterized by high dough elasticity. The optimal choice for traditional bread and products requiring high extensibility.',
    active: true
  },
  {
    id: 'p4',
    name_ar: 'دقيق الريان',
    name_en: 'Al-Rayyan Flour',
    weight: '25kg',
    category: 'flour',
    price: 48.00,
    imageUrl: 'https://placehold.co/400x600/92400e/ffffff?text=Al-Rayyan',
    description_ar: 'دقيق استخراج 72%، بياض ناصع ونعومة فائقة. مثالي للحلويات الشرقية والكعك.',
    description_en: '72% extraction flour, pure white and ultra-fine. Perfect for oriental sweets and cakes.',
    active: true
  },
  {
    id: 'p5',
    name_ar: 'دقيق الجوهرة',
    name_en: 'Al-Jawhara Flour',
    weight: '25kg',
    category: 'flour',
    price: 50.00,
    imageUrl: 'https://placehold.co/400x600/78350f/ffffff?text=Al-Jawhara',
    description_ar: 'الخيار الأول لصناعة البسكويت والكيك. نسبة جلوتين منخفضة تضمن هشاشة المنتج النهائي.',
    description_en: 'The first choice for biscuits and cake manufacturing. Low gluten content ensures the crispiness/softness of the final product.',
    active: true
  },
  {
    id: 'p6',
    name_ar: 'ردة (نخالة)',
    name_en: 'Wheat Bran (Radda)',
    weight: '40kg',
    category: 'bran',
    price: 30.00,
    imageUrl: 'https://placehold.co/400x600/A0522D/ffffff?text=Bran+40kg',
    description_ar: 'نخالة قمح صافية غنية بالألياف. تستخدم للأعلاف الحيوانية ولبعض المخبوزات الصحية.',
    description_en: 'Pure wheat bran rich in fiber. Used for animal feed and some healthy baked goods.',
    active: true
  },
  {
    id: 'p7',
    name_ar: 'دقيق منزلي',
    name_en: 'Household Flour',
    weight: '1kg',
    category: 'flour',
    price: 5.50,
    imageUrl: 'https://placehold.co/400x600/fbbf24/000000?text=1kg+Pack',
    description_ar: 'عبوة منزلية اقتصادية سهلة التخزين. نفس جودة دقيق الشفاء الفاخر في عبوة مناسبة للاستخدام اليومي.',
    description_en: 'Economical household pack, easy to store. Same quality as Al-Shifa Premium flour in a package suitable for daily use.',
    active: true
  }
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title_ar: 'افتتاح خط الإنتاج الجديد بطاقة 500 طن',
    title_en: 'Opening of New 500-Ton Production Line',
    date: '2023-11-15',
    summary_ar: 'احتفلت مطاحن الشفاء اليوم بتدشين التوسعة الجديدة للمصنع...',
    summary_en: 'Al-Shifa Mills celebrated today the launch of the new factory expansion...',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'n2',
    title_ar: 'حصول الشركة على شهادة الأيزو 22000',
    title_en: 'Company Receives ISO 22000 Certification',
    date: '2023-10-01',
    summary_ar: 'تأكيداً على التزامنا بأعلى معايير الجودة وسلامة الغذاء...',
    summary_en: 'Confirming our commitment to the highest quality and food safety standards...',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600'
  }
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title_ar: 'المشاركة في معرض جلفود 2024',
    title_en: 'Participation in Gulfood 2024',
    date: '2024-02-19',
    location_ar: 'مركز دبي التجاري العالمي',
    location_en: 'Dubai World Trade Centre',
    description_ar: 'ندعوكم لزيارة جناحنا في أكبر معرض للأغذية والمشروبات في العالم.',
    description_en: 'We invite you to visit our stand at the world\'s largest food and beverage exhibition.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'e2',
    title_ar: 'الملتقى السنوي للموزعين',
    title_en: 'Annual Distributors Meeting',
    date: '2024-01-10',
    location_ar: 'فندق الريتز كارلتون - الرياض',
    location_en: 'Ritz Carlton - Riyadh',
    description_ar: 'لقاء يجمع شركاء النجاح لاستعراض استراتيجيات العام الجديد.',
    description_en: 'A meeting bringing together success partners to review new year strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600'
  }
];

const INITIAL_JOBS: JobItem[] = [
  {
    id: 'j1',
    title_ar: 'مدير مبيعات إقليمي',
    title_en: 'Regional Sales Manager',
    department_ar: 'المبيعات',
    department_en: 'Sales',
    location_ar: 'الرياض',
    location_en: 'Riyadh',
    type_ar: 'دوام كامل',
    type_en: 'Full Time',
    description_ar: 'خبرة لا تقل عن 5 سنوات في مجال السلع الاستهلاكية (FMCG).',
    description_en: 'Minimum 5 years experience in FMCG sector.',
    postedDate: '2023-11-20'
  },
  {
    id: 'j2',
    title_ar: 'مهندس جودة',
    title_en: 'Quality Engineer',
    department_ar: 'الإنتاج',
    department_en: 'Production',
    location_ar: 'المصنع - المدينة الصناعية',
    location_en: 'Factory - Industrial City',
    type_ar: 'دوام كامل',
    type_en: 'Full Time',
    description_ar: 'بكالوريوس هندسة كيميائية أو علوم أغذية، حديث التخرج.',
    description_en: 'Bachelor of Chemical Engineering or Food Science, Fresh Grad.',
    postedDate: '2023-12-01'
  }
];

// --- TRANSLATIONS ---

const TRANSLATIONS = {
  ar: {
    brand: 'مطاحن الشفاء',
    tagline: 'من خيرات الطبيعة إلى مائدتك',
    nav_home: 'الرئيسية',
    nav_products: 'منتجاتنا',
    nav_about: 'من نحن',
    nav_contact: 'اتصل بنا',
    nav_news: 'الأخبار',
    nav_events: 'الفعاليات',
    nav_careers: 'الوظائف',
    nav_admin: 'الإدارة',
    hero_title: 'جودة تثق بها عبر الأجيال',
    hero_cta: 'تصفح المنتجات',
    hero_sub: 'أحدث تقنيات الطحن لإنتاج أفخر أنواع الدقيق والسميد بأعلى معايير الجودة العالمية.',
    prod_title: 'منتجاتنا المميزة',
    add_to_cart: 'أضف للسلة',
    request_order: 'طلب عرض سعر',
    cart_title: 'سلة المشتريات',
    cart_empty: 'السلة فارغة حالياً',
    cart_continue: 'تابع التسوق',
    checkout: 'إتمام الطلب',
    order_summary: 'ملخص الطلب',
    items_count: 'عنصر',
    confirm_request: 'تأكيد طلب عرض السعر',
    secure_request: 'طلب آمن ومشفّر',
    footer_desc: 'مطاحن الشفاء للغلال، شركة رائدة في مجال الأمن الغذائي وصناعة الدقيق. نلتزم بأعلى معايير الجودة والسلامة الغذائية.',
    admin_login: 'دخول المسؤولين',
    admin_dash: 'لوحة التحكم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    login: 'دخول',
    logout: 'خروج',
    products_manage: 'إدارة المنتجات',
    order_success: 'تم إرسال طلبك بنجاح! سيتواصل معك فريق المبيعات قريباً.',
    contact_us_title: 'تواصل معنا',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    message: 'الرسالة',
    send: 'إرسال',
    subscribe: 'اشترك في النشرة البريدية',
    subscribe_btn: 'اشتراك',
    follow_us: 'تابعنا على',
    copyright: 'جميع الحقوق محفوظة لمطاحن الشفاء للغلال',
    designed_by: 'تم التصميم والتطوير بواسطة',
    stats_prod: 'طاقة إنتاجية يومية',
    stats_exp: 'سنوات من الخبرة',
    stats_dist: 'مركز توزيع',
    cert_iso: 'حاصلون على شهادة الأيزو',
    read_more: 'اقرأ المزيد',
    apply_now: 'قدم الآن',
    upload_cv: 'تحميل السيرة الذاتية (PDF/DOC)',
    browse_news: 'آخر الأخبار',
    upcoming_events: 'الفعاليات القادمة',
    join_team: 'انضم لفريقنا',
    job_type: 'نوع الوظيفة',
    job_dept: 'القسم',
    submit_app: 'إرسال الطلب',
    app_success: 'تم استلام طلب التوظيف بنجاح.',
    location: 'الموقع',
    date: 'التاريخ',
    edit: 'تعديل',
    delete: 'حذف',
    add_new: 'إضافة جديد',
    cancel: 'إلغاء',
    save: 'حفظ',
    dashboard_overview: 'نظرة عامة',
    total_products: 'إجمالي المنتجات',
    total_news: 'الأخبار والمقالات',
    total_events: 'الفعاليات',
    total_jobs: 'الوظائف المتاحة',
    image_preview: 'معاينة الصورة',
    saved_success: 'تم الحفظ بنجاح',
    deleted_success: 'تم الحذف بنجاح',
    login_error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    upload_image: 'رفع صورة',
    currency: 'ر.س'
  },
  en: {
    brand: 'Al-Shifa Mills',
    tagline: 'Nature\'s best to your table',
    nav_home: 'Home',
    nav_products: 'Products',
    nav_about: 'About Us',
    nav_contact: 'Contact',
    nav_news: 'News',
    nav_events: 'Events',
    nav_careers: 'Careers',
    nav_admin: 'Admin',
    hero_title: 'Quality You Trust Through Generations',
    hero_cta: 'Browse Products',
    hero_sub: 'State-of-the-art milling technology producing the finest flour with global quality standards.',
    prod_title: 'Our Featured Products',
    add_to_cart: 'Add to Cart',
    request_order: 'Request Quote',
    cart_title: 'Shopping Cart',
    cart_empty: 'Your cart is currently empty',
    cart_continue: 'Continue Shopping',
    checkout: 'Checkout',
    order_summary: 'Order Summary',
    items_count: 'Items',
    confirm_request: 'Confirm Quote Request',
    secure_request: 'Secure & Encrypted Request',
    footer_desc: 'Al-Shifa Flour Mills, a leader in food security and flour manufacturing. Committed to the highest standards of quality and food safety.',
    admin_login: 'Admin Login',
    admin_dash: 'Dashboard',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    products_manage: 'Manage Products',
    order_success: 'Order submitted successfully! Sales team will contact you soon.',
    contact_us_title: 'Contact Us',
    name: 'Full Name',
    phone: 'Phone Number',
    message: 'Message',
    send: 'Send',
    subscribe: 'Subscribe to Newsletter',
    subscribe_btn: 'Subscribe',
    follow_us: 'Follow Us',
    copyright: 'All rights reserved to Al-Shifa Flour Mills',
    designed_by: 'Designed & Developed by',
    stats_prod: 'Daily Production',
    stats_exp: 'Years Experience',
    stats_dist: 'Distribution Centers',
    cert_iso: 'ISO Certified',
    read_more: 'Read More',
    apply_now: 'Apply Now',
    upload_cv: 'Upload CV (PDF/DOC)',
    browse_news: 'Latest News',
    upcoming_events: 'Upcoming Events',
    join_team: 'Join Our Team',
    job_type: 'Job Type',
    job_dept: 'Department',
    submit_app: 'Submit Application',
    app_success: 'Application submitted successfully.',
    location: 'Location',
    date: 'Date',
    edit: 'Edit',
    delete: 'Delete',
    add_new: 'Add New',
    cancel: 'Cancel',
    save: 'Save',
    dashboard_overview: 'Overview',
    total_products: 'Total Products',
    total_news: 'News & Articles',
    total_events: 'Events',
    total_jobs: 'Open Positions',
    image_preview: 'Image Preview',
    saved_success: 'Saved Successfully',
    deleted_success: 'Deleted Successfully',
    login_error: 'Invalid Email or Password',
    upload_image: 'Upload Image',
    currency: 'SAR'
  }
};

// --- CONTEXT ---

const AppContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  view: View;
  setView: (v: View) => void;
  cart: CartItem[];
  addToCart: (p: Product, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  user: any; 
  login: (role: string) => void;
  logout: () => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  news: NewsItem[];
  setNews: (n: NewsItem[]) => void;
  events: EventItem[];
  setEvents: (e: EventItem[]) => void;
  jobs: JobItem[];
  setJobs: (j: JobItem[]) => void;
}>({} as any);

// --- FIREBASE SERVICE (MOCKED) ---
class FirebaseService {
  static async getProducts(): Promise<Product[]> {
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_PRODUCTS), 300));
  }
  static async getNews(): Promise<NewsItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_NEWS), 300));
  }
  static async getEvents(): Promise<EventItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_EVENTS), 300));
  }
  static async getJobs(): Promise<JobItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_JOBS), 300));
  }
  static async submitOrder(orderData: any) {
    console.log("Order submitted:", orderData);
    return true;
  }
  static async submitJobApplication(appData: any) {
    console.log("Job App submitted:", appData);
    return true;
  }
}

// --- COMPONENTS ---

// Generic Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-20">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { lang, setLang, view, setView, cart, user, logout } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [mobileMenu, setMobileMenu] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-brand-600 text-white p-2 rounded-lg">
            <Wheat size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-900 leading-tight">{t.brand}</h1>
            <p className="text-xs text-brand-600 hidden md:block">{t.tagline}</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6 text-stone-600 font-medium text-sm xl:text-base">
          <button onClick={() => setView('home')} className={`hover:text-brand-600 transition ${view === 'home' ? 'text-brand-600 font-bold' : ''}`}>{t.nav_home}</button>
          <button onClick={() => setView('products')} className={`hover:text-brand-600 transition ${view === 'products' ? 'text-brand-600 font-bold' : ''}`}>{t.nav_products}</button>
          <button onClick={() => setView('news')} className={`hover:text-brand-600 transition ${view === 'news' ? 'text-brand-600 font-bold' : ''}`}>{t.nav_news}</button>
          <button onClick={() => setView('events')} className={`hover:text-brand-600 transition ${view === 'events' ? 'text-brand-600 font-bold' : ''}`}>{t.nav_events}</button>
          <button onClick={() => setView('careers')} className={`hover:text-brand-600 transition ${view === 'careers' ? 'text-brand-600 font-bold' : ''}`}>{t.nav_careers}</button>
          <button onClick={() => setView('about')} className={`hover:text-brand-600 transition ${view === 'about' ? 'text-brand-600 font-bold' : ''}`}>{t.nav_about}</button>
          <button onClick={() => setView('contact')} className={`hover:text-brand-600 transition ${view === 'contact' ? 'text-brand-600 font-bold' : ''}`}>{t.nav_contact}</button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 text-sm bg-stone-100 px-3 py-1 rounded-full hover:bg-brand-100 transition"
          >
            <Globe size={16} />
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <button onClick={() => setView('cart')} className="relative p-2 text-stone-600 hover:text-brand-600">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
             <div className="flex items-center gap-2">
               <button onClick={() => setView('admin')} className="text-sm font-bold text-brand-700 bg-brand-100 px-3 py-1 rounded-full">{t.admin_dash}</button>
               <button onClick={logout} className="text-stone-400 hover:text-red-500"><X size={18}/></button>
             </div>
          ) : (
             <button onClick={() => setView('login')} className="text-stone-400 hover:text-brand-600">
               <User size={24} />
             </button>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-stone-600" onClick={() => setMobileMenu(!mobileMenu)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2 z-50 absolute w-full">
          <button onClick={() => { setView('home'); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100">{t.nav_home}</button>
          <button onClick={() => { setView('products'); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100">{t.nav_products}</button>
          <button onClick={() => { setView('news'); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100">{t.nav_news}</button>
          <button onClick={() => { setView('events'); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100">{t.nav_events}</button>
          <button onClick={() => { setView('careers'); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100">{t.nav_careers}</button>
          <button onClick={() => { setView('about'); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100">{t.nav_about}</button>
          <button onClick={() => { setView('contact'); setMobileMenu(false); }} className="text-start py-2">{t.nav_contact}</button>
        </div>
      )}
    </header>
  );
};

const NewsView = () => {
  const { lang, news } = useContext(AppContext);
  const t = TRANSLATIONS[lang];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-stone-900 mt-2">{t.browse_news}</h3>
        <div className="w-24 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {news.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
            <div className="h-64 overflow-hidden relative">
              <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-4 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded shadow">
                {item.date}
              </div>
            </div>
            <div className="p-8">
              <h4 className="text-xl font-bold text-stone-900 mb-3">{lang === 'ar' ? item.title_ar : item.title_en}</h4>
              <p className="text-stone-600 mb-6">{lang === 'ar' ? item.summary_ar : item.summary_en}</p>
              <button className="text-brand-600 font-bold flex items-center gap-2 hover:text-brand-700">
                {t.read_more} {lang === 'ar' ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsView = () => {
  const { lang, events } = useContext(AppContext);
  const t = TRANSLATIONS[lang];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-stone-900 mt-2">{t.upcoming_events}</h3>
        <div className="w-24 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
            <div className="md:w-1/3 relative h-64 md:h-auto">
              <img src={event.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
            </div>
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-brand-600 font-bold mb-3">
                <span className="flex items-center gap-1"><Calendar size={16}/> {event.date}</span>
                <span className="flex items-center gap-1"><MapPin size={16}/> {lang === 'ar' ? event.location_ar : event.location_en}</span>
              </div>
              <h4 className="text-2xl font-bold text-stone-900 mb-4">{lang === 'ar' ? event.title_ar : event.title_en}</h4>
              <p className="text-stone-600 leading-relaxed mb-6">{lang === 'ar' ? event.description_ar : event.description_en}</p>
              <button className="self-start border border-stone-300 px-6 py-2 rounded-lg hover:bg-stone-900 hover:text-white transition text-sm font-bold">
                {t.read_more}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CareersView = () => {
  const { lang, jobs } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [appSent, setAppSent] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setAppSent(true);
      setTimeout(() => {
         setAppSent(false);
         setSelectedJob(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-stone-900 mt-2">{t.join_team}</h3>
        <p className="text-stone-500 mt-4 max-w-2xl mx-auto">
          {lang === 'ar' ? 'نحن نبحث دائماً عن المواهب الطموحة للانضمام إلى عائلتنا والمساهمة في تحقيق رؤيتنا.' : 'We are always looking for ambitious talents to join our family and contribute to achieving our vision.'}
        </p>
        <div className="w-24 h-1 bg-brand-500 mx-auto mt-6 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id} className={`bg-white p-6 rounded-xl border-2 transition cursor-pointer hover:shadow-lg ${selectedJob === job.id ? 'border-brand-500 shadow-md ring-1 ring-brand-100' : 'border-transparent shadow-sm'}`} onClick={() => { setSelectedJob(job.id); setAppSent(false); }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-stone-900">{lang === 'ar' ? job.title_ar : job.title_en}</h4>
                  <span className="text-brand-600 text-sm font-semibold">{lang === 'ar' ? job.department_ar : job.department_en}</span>
                </div>
                <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded text-xs font-bold">
                  {lang === 'ar' ? job.type_ar : job.type_en}
                </span>
              </div>
              <div className="flex items-center gap-4 text-stone-500 text-sm mb-4">
                 <span className="flex items-center gap-1"><MapPin size={14}/> {lang === 'ar' ? job.location_ar : job.location_en}</span>
                 <span className="flex items-center gap-1"><Clock size={14}/> {job.postedDate}</span>
              </div>
              <p className="text-stone-600 text-sm mb-4">{lang === 'ar' ? job.description_ar : job.description_en}</p>
              <button className="text-brand-600 font-bold text-sm flex items-center gap-1 hover:underline">
                 {t.apply_now} <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''}/>
              </button>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="bg-stone-50 p-8 rounded-2xl h-fit border border-stone-100 sticky top-24">
          {!selectedJob ? (
             <div className="text-center text-stone-400 py-12">
               <Briefcase size={48} className="mx-auto mb-4 opacity-30"/>
               <p>{lang === 'ar' ? 'اختر وظيفة للتقديم عليها' : 'Select a job to apply'}</p>
             </div>
          ) : appSent ? (
             <div className="text-center text-green-600 py-12">
               <CheckCircle size={64} className="mx-auto mb-6"/>
               <h4 className="text-xl font-bold">{t.app_success}</h4>
             </div>
          ) : (
             <form onSubmit={handleApply} className="space-y-4 animate-in fade-in">
               <h3 className="text-xl font-bold text-stone-900 mb-6 border-b pb-4">
                 {t.apply_now}: <span className="text-brand-600">{jobs.find(j => j.id === selectedJob)?.[lang === 'ar' ? 'title_ar' : 'title_en']}</span>
               </h3>
               <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">{t.name}</label>
                  <input required type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"/>
               </div>
               <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">{t.email}</label>
                  <input required type="email" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"/>
               </div>
               <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">{t.upload_cv}</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:bg-white transition cursor-pointer group">
                     <Upload size={24} className="mx-auto text-stone-400 group-hover:text-brand-500 mb-2"/>
                     <span className="text-xs text-stone-500">Click to upload file</span>
                     <input type="file" accept=".pdf,.doc,.docx" className="hidden" /> 
                  </div>
               </div>
               <button className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg mt-4">
                 {t.submit_app}
               </button>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const { lang, setView } = useContext(AppContext);
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative bg-brand-900 text-white h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-brand-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover" 
          alt="Wheat field" 
        />
      </div>
      <div className="container mx-auto px-4 relative z-20 flex flex-col items-start gap-8">
        <div className="bg-brand-500/20 backdrop-blur-sm border border-brand-500/30 text-brand-100 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
           <Award size={16} /> Since 1985
        </div>
        <h2 className="text-5xl md:text-7xl font-bold max-w-3xl leading-tight drop-shadow-lg">{t.hero_title}</h2>
        <p className="text-lg md:text-2xl text-stone-100 max-w-2xl leading-relaxed">{t.hero_sub}</p>
        <div className="flex gap-4">
            <button 
              onClick={() => setView('products')}
              className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2 shadow-lg shadow-brand-900/20"
            >
              {t.hero_cta} {lang === 'ar' ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <button 
               onClick={() => setView('contact')}
               className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              {t.nav_contact}
            </button>
        </div>
      </div>
    </div>
  );
};

const StatsSection = () => {
    const { lang } = useContext(AppContext);
    const t = TRANSLATIONS[lang];

    const stats = [
        { icon: Factory, val: '500+', label: lang === 'ar' ? 'طن / يومياً' : 'Tons / Daily', title: t.stats_prod },
        { icon: Award, val: '35+', label: lang === 'ar' ? 'عام' : 'Years', title: t.stats_exp },
        { icon: Truck, val: '20+', label: lang === 'ar' ? 'مدينة' : 'Cities', title: t.stats_dist },
    ];

    return (
        <div className="bg-brand-50 py-16 -mt-10 relative z-30 container mx-auto px-4 rounded-xl shadow-xl border border-brand-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-200 rtl:divide-x-reverse">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center pt-4 md:pt-0">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-brand-600">
                            <stat.icon size={32} />
                        </div>
                        <h3 className="text-4xl font-bold text-brand-900 mb-1">{stat.val}</h3>
                        <p className="text-stone-500 font-medium text-sm mb-1">{stat.label}</p>
                        <p className="text-stone-800 font-bold">{stat.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Internal component for handling individual card state (quantity)
const ProductCard = ({ product, onClick, onAddToCart, lang, t }: any) => {
  const [qty, setQty] = useState(1);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, qty);
    setQty(1); // Reset after adding
  };

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQty(q => q + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQty(q => Math.max(1, q - 1));
  };

  return (
    <div 
      onClick={() => onClick(product)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Area with Studio Background */}
      <div className="h-72 bg-gradient-to-br from-stone-50 to-stone-100 p-8 flex items-center justify-center relative overflow-hidden">
        {/* Subtle decorative circle */}
        <div className="absolute w-48 h-48 bg-white/50 rounded-full blur-3xl -top-10 -right-10 pointer-events-none"></div>
        
        <img 
            src={product.imageUrl} 
            alt={lang === 'ar' ? product.name_ar : product.name_en} 
            className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 z-10" 
        />
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-stone-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm border border-white">
            {product.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-stone-900 leading-tight line-clamp-1 group-hover:text-brand-600 transition-colors">
             {lang === 'ar' ? product.name_ar : product.name_en}
           </h3>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-stone-400 bg-stone-50 px-2 py-0.5 rounded text-xs">{product.weight}</span>
            <div className="flex gap-0.5 text-brand-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor"/>)}
            </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
             <div className="flex flex-col">
                <span className="text-xs text-stone-400 font-medium">Price</span>
                <span className="text-2xl font-black text-brand-600 tracking-tight">{product.price}<span className="text-sm font-bold text-stone-400 ml-0.5">{t.currency}</span></span>
             </div>

             {/* Action Button - Expands on Hover (Desktop) or stays accessible */}
             <div className="flex items-center gap-2 bg-stone-900 p-1 rounded-xl shadow-lg group-hover:bg-brand-600 transition-colors duration-300" onClick={e => e.stopPropagation()}>
                <div className="flex items-center bg-stone-800 rounded-lg group-hover:bg-brand-700 transition-colors">
                    <button onClick={decrement} disabled={qty <= 1} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition disabled:opacity-30"><Minus size={14}/></button>
                    <span className="w-4 text-center text-sm font-bold text-white tabular-nums">{qty}</span>
                    <button onClick={increment} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition"><Plus size={14}/></button>
                </div>
                <button onClick={handleAddToCart} className="w-8 h-8 flex items-center justify-center text-white hover:scale-110 transition active:scale-95" title={t.add_to_cart}>
                    <ShoppingCart size={18} />
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const { lang, products, addToCart } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);

  useEffect(() => {
    // 3D floating animation style
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float3d {
        0% { transform: translateY(0px) rotateY(-5deg); }
        50% { transform: translateY(-1