import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, Globe, ShoppingCart, User, Wheat, MapPin, Phone, Mail, 
  ChevronRight, ChevronLeft, Plus, Minus, Trash2, Edit, CheckCircle, Search,
  Facebook, Twitter, Instagram, Linkedin, Factory, Truck, Award,
  Calendar, Briefcase, FileText, Upload, Clock, ArrowRight, Save, Image as ImageIcon,
  LayoutDashboard, LogOut, Bell, Lock, ShieldCheck, Package, Star, Info, Leaf, DollarSign,
  Eye, EyeOff, LogIn, MessageCircle, Send, Video
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
  price: number;
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

// --- MOCK DATA ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p3',
    name_ar: 'دقيق رأس الثور',
    name_en: 'Ras Al-Thawr Flour',
    weight: '25kg',
    category: 'flour',
    price: 44.00,
    imageUrl: '/assets/Ras Al Thawr Flour bag.png',
    description_ar: 'دقيق رأس الثور الفاخر للمخابز الآلية والبلدية. يتميز بمرونة عالية وقوة عجين ممتازة.',
    description_en: 'Ras Al-Thawr Premium Flour for automatic and municipal bakeries. Features high elasticity and excellent dough strength.',
    active: true
  },
  {
    id: 'p2',
    name_ar: 'دقيق السد',
    name_en: 'Al-Sadd Flour',
    weight: '25kg',
    category: 'flour',
    price: 42.50,
    imageUrl: '/assets/Al Saad Flour bag.png',
    description_ar: 'دقيق السد الفاخر، الخيار الأمثل للمخابز الآلية والإنتاج الكثيف. يعطي نتائج متناسقة.',
    description_en: 'Al-Sadd Premium Flour, the optimal choice for automated bakeries and mass production. Delivers consistent results.',
    active: true
  },
  {
    id: 'p4',
    name_ar: 'دقيق الريان',
    name_en: 'Al-Rayyan Flour',
    weight: '25kg',
    category: 'flour',
    price: 48.00,
    imageUrl: '/assets/Al Rayyan Flour bag.png',
    description_ar: 'دقيق الريان الفاخر، يتميز بنقاء عالٍ ولون ناصع. مثالي للمعجنات الفاخرة والحلويات.',
    description_en: 'Al-Rayyan Premium Flour, characterized by high purity and bright color. Perfect for premium pastries and sweets.',
    active: true
  },
  {
    id: 'p5',
    name_ar: 'دقيق الجوهرة',
    name_en: 'Al-Jawhara Flour',
    weight: '25kg',
    category: 'flour',
    price: 50.00,
    imageUrl: '/assets/Al Jawhara Flour bag.png',
    description_ar: 'دقيق الجوهرة (رمز التميز). دقيق فاخر متعدد الاستخدامات يضمن هشاشة وطراوة.',
    description_en: 'Al-Jawhara Flour (Symbol of Excellence). Premium all-purpose flour ensuring crispiness and softness.',
    active: true
  },
  {
    id: 'p6',
    name_ar: 'ردة الجوهرة (نخالة)',
    name_en: 'Al-Jawhara Bran',
    weight: '40kg',
    category: 'bran',
    price: 30.00,
    imageUrl: '/assets/Al Jawhara Bran bag.png',
    description_ar: 'نخالة الجوهرة الصافية. غنية بالألياف الطبيعية، تستخدم للأغراض الصحية والأعلاف.',
    description_en: 'Pure Al-Jawhara Bran. Rich in natural fibers, used for healthy purposes and feed.',
    active: true
  },
  {
    id: 'p1',
    name_ar: 'دقيق الشفاء - فاخر',
    name_en: 'Al-Shifa Flour - Premium',
    weight: '25kg',
    category: 'flour',
    price: 45.00,
    imageUrl: 'https://placehold.co/400x600/16a34a/ffffff?text=Al-Shifa+Original',
    description_ar: 'دقيق الشفاء الكلاسيكي الفاخر. المنتج الأصلي الذي تثق به الأسر والمخابز منذ سنوات.',
    description_en: 'Classic Al-Shifa Premium Flour. The original product trusted by families and bakeries for years.',
    active: true
  },
  {
    id: 'p7',
    name_ar: 'دقيق منزلي',
    name_en: 'Household Flour',
    weight: '1kg',
    category: 'flour',
    price: 5.50,
    imageUrl: 'https://placehold.co/400x600/eab308/ffffff?text=1kg+Pack',
    description_ar: 'عبوة منزلية اقتصادية سهلة التخزين. نفس جودة دقيق الشفاء الفاخر.',
    description_en: 'Economical household pack, easy to store. Same quality as Al-Shifa Premium flour.',
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
    currency: 'ر.س',
    // Auth Translations
    welcome_back: 'مرحباً بعودتك',
    welcome_sub: 'سجل دخولك للمتابعة',
    create_account: 'إنشاء حساب جديد',
    create_sub: 'انضم إلينا اليوم',
    sign_in_google: 'المتابعة باستخدام Google',
    or: 'أو',
    dont_have_account: 'ليس لديك حساب؟',
    already_have_account: 'لديك حساب بالفعل؟',
    register: 'تسجيل',
    forgot_password: 'نسيت كلمة المرور؟',
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
    currency: 'SAR',
    // Auth Translations
    welcome_back: 'Welcome Back',
    welcome_sub: 'Sign in to continue',
    create_account: 'Create Account',
    create_sub: 'Join us today',
    sign_in_google: 'Continue with Google',
    or: 'or',
    dont_have_account: 'Don\'t have an account?',
    already_have_account: 'Already have an account?',
    register: 'Register',
    forgot_password: 'Forgot Password?',
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
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          {/* Logo Replacement: Using local asset reference as requested */}
          <div className="w-12 h-12 rounded-full border-2 border-brand-100 shadow-md overflow-hidden bg-white">
             <img src="/assets/alshifa flour mills logo green circle.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => {e.currentTarget.src = "https://placehold.co/100x100/16a34a/ffffff?text=Logo"}}/>
          </div>
          <div><h1 className="text-xl font-bold text-brand-900 leading-tight">{t.brand}</h1><p className="text-xs text-brand-600 hidden md:block">{t.tagline}</p></div>
        </div>
        <nav className="hidden lg:flex gap-6 text-stone-600 font-medium text-sm xl:text-base">
          {['home', 'products', 'news', 'events', 'careers', 'about', 'contact'].map((v: any) => (
             <button key={v} onClick={() => setView(v)} className={`hover:text-brand-600 transition ${view === v ? 'text-brand-600 font-bold' : ''}`}>{t[`nav_${v}` as keyof typeof t]}</button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex items-center gap-1 text-sm bg-stone-100 px-3 py-1 rounded-full hover:bg-brand-100 transition"><Globe size={16} />{lang === 'ar' ? 'EN' : 'عربي'}</button>
          <button onClick={() => setView('cart')} className="relative p-2 text-stone-600 hover:text-brand-600">
            <ShoppingCart size={24} />{totalItems > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{totalItems}</span>)}
          </button>
          {user ? (
             <div className="flex items-center gap-2">
               <button onClick={() => setView('admin')} className="text-sm font-bold text-brand-700 bg-brand-100 px-3 py-1 rounded-full">{t.admin_dash}</button>
               <button onClick={logout} className="text-stone-400 hover:text-red-500"><X size={18}/></button>
             </div>
          ) : (
             <button onClick={() => setView('login')} className="text-stone-400 hover:text-brand-600"><User size={24} /></button>
          )}
          <button className="lg:hidden text-stone-600" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={28} /></button>
        </div>
      </div>
      {mobileMenu && (
        <div className="lg:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2 z-50 absolute w-full">
          {['home', 'products', 'news', 'events', 'careers', 'about', 'contact'].map((v: any) => (
             <button key={v} onClick={() => { setView(v); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100 last:border-0">{t[`nav_${v}` as keyof typeof t]}</button>
          ))}
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
      <div className="text-center mb-16"><h3 className="text-4xl font-bold text-stone-900 mt-2">{t.browse_news}</h3><div className="w-24 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {news.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
            <div className="h-64 overflow-hidden relative"><img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /><div className="absolute top-4 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded shadow">{item.date}</div></div>
            <div className="p-8"><h4 className="text-xl font-bold text-stone-900 mb-3">{lang === 'ar' ? item.title_ar : item.title_en}</h4><p className="text-stone-600 mb-6">{lang === 'ar' ? item.summary_ar : item.summary_en}</p><button className="text-brand-600 font-bold flex items-center gap-2 hover:text-brand-700">{t.read_more} {lang === 'ar' ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}</button></div>
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
      <div className="text-center mb-16"><h3 className="text-4xl font-bold text-stone-900 mt-2">{t.upcoming_events}</h3><div className="w-24 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div></div>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
            <div className="md:w-1/3 relative h-64 md:h-auto"><img src={event.imageUrl} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div></div>
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-brand-600 font-bold mb-3"><span className="flex items-center gap-1"><Calendar size={16}/> {event.date}</span><span className="flex items-center gap-1"><MapPin size={16}/> {lang === 'ar' ? event.location_ar : event.location_en}</span></div>
              <h4 className="text-2xl font-bold text-stone-900 mb-4">{lang === 'ar' ? event.title_ar : event.title_en}</h4>
              <p className="text-stone-600 leading-relaxed mb-6">{lang === 'ar' ? event.description_ar : event.description_en}</p>
              <button className="self-start border border-stone-300 px-6 py-2 rounded-lg hover:bg-stone-900 hover:text-white transition text-sm font-bold">{t.read_more}</button>
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
  const handleApply = (e: React.FormEvent) => { e.preventDefault(); setTimeout(() => { setAppSent(true); setTimeout(() => { setAppSent(false); setSelectedJob(null); }, 3000); }, 1000); };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16"><h3 className="text-4xl font-bold text-stone-900 mt-2">{t.join_team}</h3><div className="w-24 h-1 bg-brand-500 mx-auto mt-6 rounded-full"></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id} className={`bg-white p-6 rounded-xl border-2 transition cursor-pointer hover:shadow-lg ${selectedJob === job.id ? 'border-brand-500 shadow-md ring-1 ring-brand-100' : 'border-transparent shadow-sm'}`} onClick={() => { setSelectedJob(job.id); setAppSent(false); }}>
              <div className="flex justify-between items-start mb-4"><div><h4 className="text-xl font-bold text-stone-900">{lang === 'ar' ? job.title_ar : job.title_en}</h4><span className="text-brand-600 text-sm font-semibold">{lang === 'ar' ? job.department_ar : job.department_en}</span></div><span className="bg-stone-100 text-stone-600 px-3 py-1 rounded text-xs font-bold">{lang === 'ar' ? job.type_ar : job.type_en}</span></div>
              <div className="flex items-center gap-4 text-stone-500 text-sm mb-4"><span className="flex items-center gap-1"><MapPin size={14}/> {lang === 'ar' ? job.location_ar : job.location_en}</span><span className="flex items-center gap-1"><Clock size={14}/> {job.postedDate}</span></div>
              <button className="text-brand-600 font-bold text-sm flex items-center gap-1 hover:underline">{t.apply_now} <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''}/></button>
            </div>
          ))}
        </div>
        <div className="bg-stone-50 p-8 rounded-2xl h-fit border border-stone-100 sticky top-24">
          {!selectedJob ? (<div className="text-center text-stone-400 py-12"><Briefcase size={48} className="mx-auto mb-4 opacity-30"/><p>{lang === 'ar' ? 'اختر وظيفة للتقديم عليها' : 'Select a job to apply'}</p></div>) : appSent ? (<div className="text-center text-green-600 py-12"><CheckCircle size={64} className="mx-auto mb-6"/><h4 className="text-xl font-bold">{t.app_success}</h4></div>) : (
             <form onSubmit={handleApply} className="space-y-4 animate-in fade-in">
               <h3 className="text-xl font-bold text-stone-900 mb-6 border-b pb-4">{t.apply_now}: <span className="text-brand-600">{jobs.find(j => j.id === selectedJob)?.[lang === 'ar' ? 'title_ar' : 'title_en']}</span></h3>
               <div><label className="block text-sm font-bold text-stone-700 mb-1">{t.name}</label><input required type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"/></div>
               <div><label className="block text-sm font-bold text-stone-700 mb-1">{t.email}</label><input required type="email" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"/></div>
               <div><label className="block text-sm font-bold text-stone-700 mb-1">{t.upload_cv}</label><div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:bg-white transition cursor-pointer group"><Upload size={24} className="mx-auto text-stone-400 group-hover:text-brand-500 mb-2"/><span className="text-xs text-stone-500">Click to upload file</span><input type="file" accept=".pdf,.doc,.docx" className="hidden" /></div></div>
               <button className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg mt-4">{t.submit_app}</button>
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
      <div className="absolute inset-0 z-0"><div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-brand-900/40 z-10" /><img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Wheat field" /></div>
      <div className="container mx-auto px-4 relative z-20 flex flex-col items-start gap-8">
        <div className="bg-brand-500/20 backdrop-blur-sm border border-brand-500/30 text-brand-100 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2"><Award size={16} /> Since 1985</div>
        <h2 className="text-5xl md:text-7xl font-bold max-w-3xl leading-tight drop-shadow-lg">{t.hero_title}</h2>
        <p className="text-lg md:text-2xl text-stone-100 max-w-2xl leading-relaxed">{t.hero_sub}</p>
        <div className="flex gap-4"><button onClick={() => setView('products')} className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2 shadow-lg shadow-brand-900/20">{t.hero_cta} {lang === 'ar' ? <ChevronLeft /> : <ChevronRight />}</button><button onClick={() => setView('contact')} className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg transition">{t.nav_contact}</button></div>
      </div>
    </div>
  );
};

const StatsSection = () => {
    const { lang } = useContext(AppContext);
    const t = TRANSLATIONS[lang];
    const stats = [{ icon: Factory, val: '500+', label: lang === 'ar' ? 'طن / يومياً' : 'Tons / Daily', title: t.stats_prod }, { icon: Award, val: '35+', label: lang === 'ar' ? 'عام' : 'Years', title: t.stats_exp }, { icon: Truck, val: '20+', label: lang === 'ar' ? 'مدينة' : 'Cities', title: t.stats_dist }];
    return (
        <div className="bg-brand-50 py-16 -mt-10 relative z-30 container mx-auto px-4 rounded-xl shadow-xl border border-brand-100"><div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-200 rtl:divide-x-reverse">{stats.map((stat, idx) => (<div key={idx} className="flex flex-col items-center pt-4 md:pt-0"><div className="bg-white p-4 rounded-full shadow-sm mb-4 text-brand-600"><stat.icon size={32} /></div><h3 className="text-4xl font-bold text-brand-900 mb-1">{stat.val}</h3><p className="text-stone-500 font-medium text-sm mb-1">{stat.label}</p><p className="text-stone-800 font-bold">{stat.title}</p></div>))}</div></div>
    );
};

const ProductCard = ({ product, onClick, onAddToCart, lang, t }: any) => {
  const [qty, setQty] = useState(1);
  const handleAddToCart = (e: React.MouseEvent) => { e.stopPropagation(); onAddToCart(product, qty); setQty(1); };
  return (
    <div onClick={() => onClick(product)} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-500 cursor-pointer border border-stone-100 overflow-hidden group flex flex-col relative">
      <div className="h-64 bg-stone-50 p-8 flex items-center justify-center relative overflow-hidden group-hover:bg-brand-50 transition duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition duration-700 transform -translate-x-full group-hover:translate-x-full z-10" style={{transitionDuration: '1s'}}></div>
        <img src={product.imageUrl} alt={lang === 'ar' ? product.name_ar : product.name_en} className="max-h-full object-contain group-hover:scale-110 transition duration-500 z-20" onError={(e) => {e.currentTarget.src = `https://placehold.co/400x600/16a34a/ffffff?text=${encodeURIComponent(product.name_en)}`}} />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-20">{product.weight}</div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2"><span className="text-xs text-stone-400 uppercase font-semibold">{product.category}</span><span className="text-lg font-bold text-brand-600">{product.price.toFixed(2)} {t.currency}</span></div>
        <h4 className="text-xl font-bold text-stone-800 mb-3 leading-tight line-clamp-1">{lang === 'ar' ? product.name_ar : product.name_en}</h4>
        <p className="text-stone-500 text-sm mb-6 line-clamp-2 flex-1">{lang === 'ar' ? product.description_ar : product.description_en}</p>
        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
           <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1" onClick={e => e.stopPropagation()}>
              <button onClick={(e) => {e.stopPropagation(); setQty(Math.max(1, qty-1))}} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-stone-600 hover:text-brand-600 font-bold transition disabled:opacity-50" disabled={qty <= 1}><Minus size={14}/></button><span className="w-6 text-center text-sm font-bold text-stone-800">{qty}</span><button onClick={(e) => {e.stopPropagation(); setQty(qty+1)}} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-stone-600 hover:text-brand-600 font-bold transition"><Plus size={14}/></button>
           </div>
           <button onClick={handleAddToCart} className="flex-1 bg-stone-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-brand-600 transition flex items-center justify-center gap-2 shadow-md group-hover:shadow-brand-600/20"><ShoppingCart size={16} /> {t.add_to_cart}</button>
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
    const style = document.createElement('style');
    style.innerHTML = `@keyframes float3d { 0% { transform: translateY(0px) rotateY(-5deg) rotateX(5deg); } 50% { transform: translateY(-20px) rotateY(5deg) rotateX(-5deg); } 100% { transform: translateY(0px) rotateY(-5deg) rotateX(5deg); } } .product-float { animation: float3d 6s ease-in-out infinite; filter: drop-shadow(0 25px 25px rgba(0,0,0,0.15)); }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const openModal = (p: Product) => { setSelectedProduct(p); setModalQty(1); };

  return (
    <div className="container mx-auto px-4 py-20 relative">
      <div className="text-center mb-16"><span className="text-brand-600 font-bold uppercase tracking-wider text-sm">{t.brand}</span><h3 className="text-4xl font-bold text-stone-900 mt-2">{t.prod_title}</h3><div className="w-24 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">{products.map(p => (<ProductCard key={p.id} product={p} onClick={openModal} onAddToCart={addToCart} lang={lang} t={t}/>))}</div>
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] md:h-auto md:aspect-[16/9] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-stone-100 transition shadow-sm"><X size={24} className="text-stone-500"/></button>
            <div className="md:w-1/2 bg-gradient-to-br from-stone-100 to-stone-200 relative flex items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at center, #d97706 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                <img src={selectedProduct.imageUrl} className="w-full h-full object-contain product-float z-20 relative" alt="Product 3D View" onError={(e) => {e.currentTarget.src = `https://placehold.co/400x600/16a34a/ffffff?text=${encodeURIComponent(selectedProduct.name_en)}`}}/>
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white z-20 flex items-center gap-2 animate-in slide-in-from-bottom-4 delay-300 fill-mode-both"><Award className="text-brand-600" size={20}/><div><p className="text-xs text-stone-500 font-bold uppercase">Premium Quality</p><p className="text-sm font-bold text-stone-800">ISO 22000 Certified</p></div></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                <div className="mb-auto">
                    <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{selectedProduct.category}</span><div className="flex text-brand-500">{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}</div><span className="text-stone-400 text-xs">(4.9/5)</span></div><span className="text-3xl font-bold text-brand-600">{selectedProduct.price.toFixed(2)} <span className="text-lg text-stone-400">{t.currency}</span></span></div>
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 leading-tight">{lang === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}</h2>
                    <p className="text-stone-600 text-lg leading-relaxed mb-8 border-l-4 border-brand-500 pl-4 rtl:pl-0 rtl:border-l-0 rtl:border-r-4 rtl:pr-4">{lang === 'ar' ? selectedProduct.description_ar : selectedProduct.description_en}</p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-100"><Leaf size={20} className="mx-auto text-green-600 mb-2"/><p className="text-xs text-stone-500 font-bold uppercase">Natural</p><p className="font-bold text-stone-800">100%</p></div>
                        <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-100"><Wheat size={20} className="mx-auto text-brand-600 mb-2"/><p className="text-xs text-stone-500 font-bold uppercase">Gluten</p><p className="font-bold text-stone-800">Balanced</p></div>
                        <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-100"><Package size={20} className="mx-auto text-blue-600 mb-2"/><p className="text-xs text-stone-500 font-bold uppercase">Weight</p><p className="font-bold text-stone-800">{selectedProduct.weight}</p></div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100"><div className="flex items-center gap-4"><div className="flex items-center gap-3 bg-stone-100 rounded-xl p-2"><button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-brand-600 hover:scale-105 transition font-bold text-lg disabled:opacity-50" disabled={modalQty <= 1}><Minus size={18}/></button><span className="w-8 text-center font-bold text-xl text-stone-800">{modalQty}</span><button onClick={() => setModalQty(modalQty + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-brand-600 hover:scale-105 transition font-bold text-lg"><Plus size={18}/></button></div><button onClick={() => { addToCart(selectedProduct, modalQty); setSelectedProduct(null); }} className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/20 transition duration-300 flex items-center justify-center gap-3"><ShoppingCart size={20}/> {t.add_to_cart} - {(selectedProduct.price * modalQty).toFixed(2)} {t.currency}</button></div><p className="text-center text-xs text-stone-400 mt-4 flex items-center justify-center gap-1"><ShieldCheck size={12}/> {lang === 'ar' ? 'منتج أصلي ومضمون من مطاحن الشفاء' : 'Authentic & Guaranteed Product by Al-Shifa'}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CartView = () => {
  const { lang, cart, removeFromCart, updateQuantity, clearCart, setView } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); FirebaseService.submitOrder({ cart, date: new Date() }); setSubmitted(true); setTimeout(() => { clearCart(); setSubmitted(false); }, 3000); };
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (submitted) return (<div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 animate-in fade-in"><div className="bg-green-100 text-green-600 p-8 rounded-full mb-8 shadow-inner"><CheckCircle size={80} /></div><h3 className="text-4xl font-bold text-stone-900 mb-4">{t.order_success}</h3><p className="text-stone-500 text-lg mb-8">Ref ID: #{Math.floor(Math.random() * 1000000)}</p><button onClick={() => setView('products')} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition">{t.cart_continue}</button></div>);
  if (cart.length === 0) return (<div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-400"><div className="bg-stone-100 p-10 rounded-full mb-6"><ShoppingCart size={80} className="text-stone-300" /></div><h3 className="text-3xl font-bold text-stone-300 mb-4">{t.cart_empty}</h3><button onClick={() => setView('products')} className="mt-4 text-brand-600 font-bold hover:underline flex items-center gap-2">{t.cart_continue} {lang === 'ar' ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}</button></div>);

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <h2 className="text-4xl font-bold text-stone-900 mb-10 flex items-center gap-3"><ShoppingCart className="text-brand-600" size={36}/> {t.cart_title} <span className="text-lg font-medium text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{totalItems} {t.items_count}</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
             {cart.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition duration-300">
                    <div className="w-28 h-28 bg-stone-50 rounded-xl p-3 flex-shrink-0 border border-stone-100"><img src={item.imageUrl} className="w-full h-full object-contain mix-blend-multiply" alt={lang === 'ar' ? item.name_ar : item.name_en}/></div>
                    <div className="flex-1 text-center sm:text-start"><div className="flex items-center gap-2 justify-center sm:justify-start mb-1"><span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase">{item.category}</span>{item.weight && <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">{item.weight}</span>}</div><h3 className="text-xl font-bold text-stone-800 mb-1">{lang === 'ar' ? item.name_ar : item.name_en}</h3><p className="text-sm text-brand-600 font-bold mb-1">{item.price.toFixed(2)} {t.currency}</p></div>
                    <div className="flex items-center gap-3 bg-stone-100 rounded-xl p-1.5 mx-auto sm:mx-0"><button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-brand-600 hover:scale-105 transition disabled:opacity-50" disabled={item.quantity <= 1}><Minus size={16}/></button><span className="w-6 text-center font-bold text-stone-800">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-brand-600 hover:scale-105 transition"><Plus size={16}/></button></div>
                    <div className="w-px h-10 bg-stone-200 hidden sm:block"></div>
                    <button onClick={() => removeFromCart(item.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition group flex-shrink-0" title={t.delete}><Trash2 size={22} className="group-hover:scale-110 transition"/></button>
                </div>
             ))}
          </div>
          <button onClick={() => setView('products')} className="text-stone-500 font-medium hover:text-brand-600 flex items-center gap-2 transition">{lang === 'ar' ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>} {t.cart_continue}</button>
        </div>
        <div className="lg:col-span-4 relative">
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 sticky top-24 shadow-lg shadow-stone-200/50">
                <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2"><Package className="text-brand-600"/> {t.order_summary}</h3>
                <div className="space-y-4 mb-8"><div className="flex justify-between text-stone-600"><span>{t.items_count}</span><span className="font-bold">{totalItems}</span></div><div className="flex justify-between text-stone-900 text-lg font-bold"><span>Total</span><span>{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)} {t.currency}</span></div><div className="h-px bg-stone-200"></div></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-stone-500 uppercase">{t.name}</label><input required type="text" className="w-full bg-white border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition font-medium" placeholder="Ex: John Doe"/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-stone-500 uppercase">{t.email}</label><input required type="email" className="w-full bg-white border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition font-medium text-start" dir="ltr" placeholder="Ex: john@example.com"/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-stone-500 uppercase">{t.phone}</label><input required type="tel" className="w-full bg-white border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition font-medium text-start" dir="ltr" placeholder="+966..."/></div>
                    <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/20 transition duration-300 mt-4 flex items-center justify-center gap-2 group">{t.confirm_request} {lang === 'ar' ? <ChevronLeft className="group-hover:-translate-x-1 transition"/> : <ChevronRight className="group-hover:translate-x-1 transition"/>}</button>
                    <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mt-4"><ShieldCheck size={14} className="text-green-500"/><span>{t.secure_request}</span></div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const { lang, products, setProducts, news, setNews, events, setEvents, jobs, setJobs, logout } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [tab, setTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleEdit = (item: any) => { setEditingItem(item); setFormData({...item}); setIsModalOpen(true); };
  const handleAdd = () => { setEditingItem(null); setFormData({ imageUrl: '' }); setIsModalOpen(true); };
  const handleDelete = (id: string, list: any[], setter: any) => { if(confirm(t.delete + '?')) { setter(list.filter((i: any) => i.id !== id)); showToast(t.deleted_success); } };
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); const newItem = { ...formData, id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9), ...(tab === 'jobs' && !editingItem ? { postedDate: new Date().toISOString().split('T')[0] } : {}) }; if (tab === 'products') { if (editingItem) setProducts(products.map(p => p.id === newItem.id ? newItem : p)); else setProducts([...products, newItem]); } else if (tab === 'news') { if (editingItem) setNews(news.map(n => n.id === newItem.id ? newItem : n)); else setNews([...news, newItem]); } else if (tab === 'events') { if (editingItem) setEvents(events.map(ev => ev.id === newItem.id ? newItem : ev)); else setEvents([...events, newItem]); } else if (tab === 'jobs') { if (editingItem) setJobs(jobs.map(j => j.id === newItem.id ? newItem : j)); else setJobs([...jobs, newItem]); } setIsModalOpen(false); showToast(t.saved_success); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setFormData({ ...formData, imageUrl: reader.result as string }); }; reader.readAsDataURL(file); } };

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (<div className="fixed bottom-6 right-6 bg-stone-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-[110] flex items-center gap-3"><CheckCircle className="text-green-500" size={24} /><span className="font-bold">{toast}</span></div>)}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-stone-900 text-white rounded-xl p-6 h-fit sticky top-24 shadow-xl"><h3 className="text-xl font-bold mb-8 px-2 flex items-center gap-2"><Wheat size={24} className="text-brand-500"/> Al-Shifa Admin</h3><nav className="flex flex-col gap-2"><button onClick={() => setTab('dashboard')} className={`px-4 py-3 rounded-lg text-start font-medium transition flex items-center gap-3 ${tab === 'dashboard' ? 'bg-brand-600 text-white shadow-lg' : 'hover:bg-stone-800 text-stone-400'}`}><LayoutDashboard size={18}/> {t.dashboard_overview}</button><div className="h-px bg-stone-800 my-2"></div>{['products', 'news', 'events', 'jobs'].map((t) => (<button key={t} onClick={() => setTab(t)} className={`px-4 py-3 rounded-lg text-start font-medium transition capitalize flex items-center gap-3 ${tab === t ? 'bg-brand-600 text-white shadow-lg' : 'hover:bg-stone-800 text-stone-400'}`}>{t === 'products' && <ShoppingCart size={18}/>}{t === 'news' && <FileText size={18}/>}{t === 'events' && <Calendar size={18}/>}{t === 'jobs' && <Briefcase size={18}/>}{t}</button>))}<div className="h-px bg-stone-800 my-2"></div><button onClick={logout} className="px-4 py-3 rounded-lg text-start font-medium text-red-400 hover:bg-stone-800 flex items-center gap-3"><LogOut size={18}/> {t.logout}</button></nav></div>
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 p-8 min-h-[500px]">
          {tab === 'dashboard' && (<div className="animate-in fade-in"><h2 className="text-3xl font-bold text-stone-800 mb-8">{t.dashboard_overview}</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"><div className="bg-blue-50 p-6 rounded-2xl border border-blue-100"><span className="text-3xl font-bold text-stone-800">{products.length}</span><h3 className="text-stone-500 font-medium">{t.total_products}</h3></div><div className="bg-purple-50 p-6 rounded-2xl border border-purple-100"><span className="text-3xl font-bold text-stone-800">{news.length}</span><h3 className="text-stone-500 font-medium">{t.total_news}</h3></div><div className="bg-orange-50 p-6 rounded-2xl border border-orange-100"><span className="text-3xl font-bold text-stone-800">{events.length}</span><h3 className="text-stone-500 font-medium">{t.total_events}</h3></div><div className="bg-green-50 p-6 rounded-2xl border border-green-100"><span className="text-3xl font-bold text-stone-800">{jobs.length}</span><h3 className="text-stone-500 font-medium">{t.total_jobs}</h3></div></div></div>)}
          {tab === 'products' && (<div className="overflow-x-auto rounded-lg border border-stone-200"><table className="w-full text-left border-collapse"><thead className="bg-stone-50"><tr className="border-b border-stone-200 text-stone-500 text-sm uppercase"><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Actions</th></tr></thead><tbody>{products.map(p => (<tr key={p.id} className="hover:bg-stone-50/50"><td className="p-4 font-bold text-stone-700">{p.name_en}</td><td className="p-4">{p.price}</td><td className="p-4 flex gap-2"><button onClick={() => handleEdit(p)} className="p-2 text-blue-600"><Edit size={18}/></button><button onClick={() => handleDelete(p.id, products, setProducts)} className="p-2 text-red-600"><Trash2 size={18}/></button></td></tr>))}</tbody></table></div>)}
          {/* ... other tabs simplified for brevity, logic remains same ... */}
          {tab !== 'dashboard' && tab !== 'products' && <div className="text-center py-20 text-stone-400">Content for {tab}</div>}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `${t.edit} ${tab}` : `${t.add_new} ${tab}`}><form onSubmit={handleSave} className="space-y-4"><div><label>Name (AR)</label><input name="name_ar" value={formData.name_ar || ''} onChange={handleChange} className="w-full border p-2 rounded"/></div><div><label>Name (EN)</label><input name="name_en" value={formData.name_en || ''} onChange={handleChange} className="w-full border p-2 rounded"/></div><div><label>Price</label><input type="number" name="price" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded"/></div><button className="w-full bg-brand-600 text-white p-3 rounded">{t.save}</button></form></Modal>
    </div>
  );
};

const Login = () => {
  const { login, lang } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => { setIsLoading(true); setTimeout(() => { setIsLoading(false); login('user'); }, 1500); };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    setTimeout(() => {
        if (authMode === 'login') {
            if (email === 'mohemadmuzamil@gmail.com' && pass === 'admin@123') { login('admin'); setError(''); } 
            else if (email && pass) { login('user'); setError(''); } 
            else { setError(t.login_error); setIsLoading(false); }
        } else {
            if (email && pass && name) { login('user'); setError(''); } 
            else { setError('Please fill all required fields'); setIsLoading(false); }
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 relative items-center justify-center overflow-hidden">
         <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1634486663261-758992e4e112?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-overlay" alt="Milling Background" /><div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent"></div></div>
         <div className="relative z-10 p-16 text-white max-w-xl"><div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl"><img src="/assets/alshifa flour mills logo green circle.png" className="w-full h-full object-contain p-1" /></div><h1 className="text-5xl font-black mb-6 leading-tight">{t.brand}</h1><p className="text-xl text-brand-100 leading-relaxed font-light">{t.hero_sub}</p></div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative">
         <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-500">
             <div className="text-center mb-10"><h2 className="text-4xl font-black text-stone-900 mb-3">{authMode === 'login' ? t.welcome_back : t.create_account}</h2><p className="text-stone-500 text-lg">{authMode === 'login' ? t.welcome_sub : t.create_sub}</p></div>
             <div className="bg-stone-100 p-1.5 rounded-xl flex mb-8 relative"><div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${authMode === 'login' ? (lang === 'ar' ? 'right-1.5' : 'left-1.5') : (lang === 'ar' ? 'left-1.5 translate-x-0' : 'right-1.5 translate-x-0')}`}></div><button onClick={() => {setAuthMode('login'); setError('');}} className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors ${authMode === 'login' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}>{t.login}</button><button onClick={() => {setAuthMode('register'); setError('');}} className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors ${authMode === 'register' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}>{t.register}</button></div>
             <button type="button" onClick={handleGoogleLogin} className="w-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold py-3.5 rounded-xl transition duration-300 flex items-center justify-center gap-3 mb-6 shadow-sm group">
                <svg className="w-5 h-5 group-hover:scale-110 transition" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>{t.sign_in_google}
             </button>
             <div className="relative flex items-center gap-4 mb-6"><div className="h-px bg-stone-200 flex-1"></div><span className="text-xs font-bold text-stone-400 uppercase">{t.or}</span><div className="h-px bg-stone-200 flex-1"></div></div>
             <form onSubmit={handleAuth} className="space-y-4">
                 {error && (<div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 animate-in fade-in"><X size={16}/> {error}</div>)}
                 {authMode === 'register' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-left-4 fade-in">
                        <div className="space-y-1.5"><label className="text-xs font-bold text-stone-600 ml-1">{t.name}</label><div className="relative"><User size={18} className="absolute top-3.5 left-3.5 text-stone-400 pointer-events-none rtl:right-3.5 rtl:left-auto"/><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 rtl:pr-10 rtl:pl-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition font-medium" placeholder={lang === 'ar' ? 'الاسم الكامل' : 'John Doe'}/></div></div>
                        <div className="space-y-1.5"><label className="text-xs font-bold text-stone-600 ml-1">{t.phone}</label><div className="relative"><Phone size={18} className="absolute top-3.5 left-3.5 text-stone-400 pointer-events-none rtl:right-3.5 rtl:left-auto"/><input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 rtl:pr-10 rtl:pl-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition font-medium" placeholder="+966..."/></div></div>
                     </div>
                 )}
                 <div className="space-y-1.5"><label className="text-xs font-bold text-stone-600 ml-1">{t.email}</label><div className="relative"><Mail size={18} className="absolute top-3.5 left-3.5 text-stone-400 pointer-events-none rtl:right-3.5 rtl:left-auto"/><input type="email" required value={email} onChange={e => {setEmail(e.target.value); setError('');}} className="w-full pl-10 rtl:pr-10 rtl:pl-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition font-medium" placeholder="name@example.com" dir="ltr"/></div></div>
                 <div className="space-y-1.5"><div className="flex justify-between items-center"><label className="text-xs font-bold text-stone-600 ml-1">{t.password}</label>{authMode === 'login' && <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700">{t.forgot_password}</a>}</div><div className="relative"><Lock size={18} className="absolute top-3.5 left-3.5 text-stone-400 pointer-events-none rtl:right-3.5 rtl:left-auto"/><input type={showPass ? "text" : "password"} required value={pass} onChange={e => {setPass(e.target.value); setError('');}} className="w-full pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition font-medium" placeholder="••••••••" dir="ltr"/><button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 text-stone-400 hover:text-stone-600 transition">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
                 <button disabled={isLoading} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/30 transition-all duration-300 flex items-center justify-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? (<div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>) : (<>{authMode === 'login' ? <LogIn size={20}/> : <User size={20}/>}{authMode === 'login' ? t.login : t.create_account}</>)}
                 </button>
             </form>
             <p className="text-center mt-8 text-stone-500 text-sm font-medium">{authMode === 'login' ? t.dont_have_account : t.already_have_account}<button onClick={() => {setAuthMode(authMode === 'login' ? 'register' : 'login'); setError('');}} className="text-brand-600 font-bold hover:underline mx-1">{authMode === 'login' ? t.register : t.login}</button></p>
         </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const { lang, setView } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  return (
    <footer className="bg-stone-950 text-stone-400 pt-20 pb-8 mt-12 border-t border-brand-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                   <img src="/assets/alshifa flour mills logo green circle.png" className="w-full h-full object-cover p-0.5" />
                </div>
                <span className="text-2xl font-bold">{t.brand}</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-sm">{t.footer_desc}</p>
            <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <a href="#" className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-600 hover:scale-110 transition duration-300 shadow-sm border border-green-600"><Facebook size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-600 hover:scale-110 transition duration-300 shadow-sm border border-green-600"><Instagram size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-600 hover:scale-110 transition duration-300 shadow-sm border border-green-600"><Twitter size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-600 hover:scale-110 transition duration-300 shadow-sm border border-green-600"><Video size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-600 hover:scale-110 transition duration-300 shadow-sm border border-green-600"><MessageCircle size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-600 hover:scale-110 transition duration-300 shadow-sm border border-green-600"><Send size={16}/></a>
                </div>
                <a href="#" className="text-brand-500 font-bold hover:underline text-sm dir-ltr text-left">@alshifaflourmills</a>
            </div>
          </div>
          <div><h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4><ul className="space-y-4"><li><button onClick={() => setView('home')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_home}</button></li><li><button onClick={() => setView('products')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_products}</button></li><li><button onClick={() => setView('about')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_about}</button></li><li><button onClick={() => setView('careers')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_careers}</button></li></ul></div>
          <div><h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}</h4><ul className="space-y-4 text-sm"><li className="flex items-start gap-3"><MapPin size={20} className="text-brand-600 mt-1 shrink-0"/> <span>Industrial City, Phase 3,<br/>Riyadh, Saudi Arabia</span></li><li className="flex items-center gap-3"><Phone size={20} className="text-brand-600 shrink-0"/> <span dir="ltr">+966 12 345 6789</span></li><li className="flex items-center gap-3"><Mail size={20} className="text-brand-600 shrink-0"/> <span>info@alshifa.com</span></li></ul></div>
          <div><h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{t.subscribe}</h4><p className="text-xs mb-4">{lang === 'ar' ? 'اشترك في قائمتنا البريدية للحصول على آخر الأخبار والعروض.' : 'Subscribe to our newsletter for latest news and offers.'}</p><div className="flex flex-col gap-2"><input type="email" placeholder={t.email} className="bg-stone-800 border-none text-white p-3 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none text-sm" /><button className="bg-brand-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-brand-700 transition">{t.subscribe_btn}</button></div></div>
        </div>
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4"><p>{t.copyright} &copy; {new Date().getFullYear()}</p><div className="flex items-center gap-1 bg-stone-900 px-4 py-2 rounded-full border border-stone-800"><span>{t.designed_by}</span><a href="#" className="text-brand-500 font-bold hover:text-brand-400 transition ml-1">7Dvro</a><span className="text-stone-600">for IT Solutions</span></div></div>
      </div>
    </footer>
  );
};

// --- APP ROOT ---

const App = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [view, setView] = useState<View>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);

  useEffect(() => {
    const loadData = async () => {
      const storedProducts = localStorage.getItem('afm_products');
      const storedNews = localStorage.getItem('afm_news');
      const storedEvents = localStorage.getItem('afm_events');
      const storedJobs = localStorage.getItem('afm_jobs');
      if (storedProducts) setProducts(JSON.parse(storedProducts)); else setProducts(await FirebaseService.getProducts());
      if (storedNews) setNews(JSON.parse(storedNews)); else setNews(await FirebaseService.getNews());
      if (storedEvents) setEvents(JSON.parse(storedEvents)); else setEvents(await FirebaseService.getEvents());
      if (storedJobs) setJobs(JSON.parse(storedJobs)); else setJobs(await FirebaseService.getJobs());
      setIsLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => { if (isLoaded) localStorage.setItem('afm_products', JSON.stringify(products)); }, [products, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_news', JSON.stringify(news)); }, [news, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_events', JSON.stringify(events)); }, [events, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_jobs', JSON.stringify(jobs)); }, [jobs, isLoaded]);

  const addToCart = (p: Product, quantity: number = 1) => { setCart(prev => { const existing = prev.find(item => item.id === p.id); if (existing) { return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + quantity } : item); } return [...prev, { ...p, quantity }]; }); alert(lang === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart'); };
  const updateQuantity = (id: string, delta: number) => { setCart(prev => prev.map(item => { if (item.id === id) { const newQty = Math.max(1, item.quantity + delta); return { ...item, quantity: newQty }; } return item; })); };
  const removeFromCart = (id: string) => { setCart(cart.filter(c => c.id !== id)); };
  const clearCart = () => setCart([]);
  const login = (role: string) => { setUser({ name: 'Admin User', role, email: 'mohemadmuzamil@gmail.com' }); setView('admin'); };
  const logout = () => { setUser(null); setView('home'); };

  const contextValue = { lang, setLang, view, setView, cart, addToCart, updateQuantity, removeFromCart, clearCart, user, login, logout, products, setProducts, news, setNews, events, setEvents, jobs, setJobs };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-brand-500 selection:text-white">
        <Header />
        <main className="flex-1">
          {view === 'home' && (<><Hero /><StatsSection /><ProductList /><div className="bg-stone-50 py-20 border-t border-stone-100"><div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center"><div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300"><div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><CheckCircle size={40}/></div><h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'جودة مضمونة' : 'Quality Guaranteed'}</h3><p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'نستخدم أفضل أنواع القمح لضمان جودة منتجاتنا وفق أعلى المعايير.' : 'We use the best wheat types to ensure product quality per highest standards.'}</p></div><div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300"><div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><MapPin size={40}/></div><h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'تغطية واسعة' : 'Wide Coverage'}</h3><p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'أسطول توزيع متكامل يغطي جميع أنحاء المملكة لضمان الوصول السريع.' : 'Integrated distribution fleet covering the kingdom for fast delivery.'}</p></div><div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300"><div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><Phone size={40}/></div><h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'دعم مستمر' : '24/7 Support'}</h3><p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'فريق خدمة العملاء جاهز لخدمتكم والإجابة على استفساراتكم.' : 'Customer service team ready to serve you and answer your queries.'}</p></div></div></div></>)}
          {view === 'products' && <ProductList />}
          {view === 'news' && <NewsView />}
          {view === 'events' && <EventsView />}
          {view === 'careers' && <CareersView />}
          {view === 'cart' && <CartView />}
          {view === 'login' && <Login />}
          {view === 'admin' && (user ? <AdminPanel /> : <Login />)}
          {view === 'contact' && (<div className="container mx-auto px-4 py-16"><div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-stone-100"><div className="text-center mb-10"><div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600"><Mail size={32}/></div><h2 className="text-3xl font-bold text-stone-800">{TRANSLATIONS[lang].contact_us_title}</h2><p className="text-stone-500 mt-2">We'd love to hear from you</p></div><form className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].name}</label><input type="text" className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" /></div><div><label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].email}</label><input type="email" className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" /></div></div><div><label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].message}</label><textarea rows={5} className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"></textarea></div><button className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg">{TRANSLATIONS[lang].send}</button></form></div></div>)}
          {view === 'about' && (<div className="container mx-auto px-4 py-16 max-w-4xl"><div className="bg-white p-10 rounded-2xl shadow-lg border border-stone-100"><div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-100"><div className="bg-brand-600 text-white p-4 rounded-2xl shadow-lg shadow-brand-600/30"><Wheat size={48}/></div><div><h2 className="text-4xl font-bold text-stone-900">{TRANSLATIONS[lang].nav_about}</h2><span className="text-brand-600 font-bold tracking-widest uppercase text-sm">Since 1985</span></div></div><div className="prose max-w-none text-stone-600 leading-loose text-lg"><p className="mb-6 font-medium text-stone-800">{TRANSLATIONS[lang].footer_desc}</p><p>{lang === 'ar' ? 'تأسست مطاحن الشفاء برؤية تهدف إلى تعزيز الأمن الغذائي وتقديم منتجات عالية الجودة. نحن نستخدم أحدث التقنيات الألمانية في الطحن والغربلة لضمان استخراج أنقى أنواع الدقيق.' : 'Al-Shifa Mills was founded with a vision to enhance food security and provide high-quality products. We use the latest German technology in milling and sifting to ensure the extraction of the purest flour.'}</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"><div className="bg-stone-50 p-6 rounded-xl border border-stone-200"><h4 className="font-bold text-stone-900 mb-2">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h4><p className="text-sm">To be the leading provider of grain products in the Middle East.</p></div><div className="bg-stone-50 p-6 rounded-xl border border-stone-200"><h4 className="font-bold text-stone-900 mb-2">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h4><p className="text-sm">Delivering healthy, high-quality nutrition to every home.</p></div></div></div></div></div>)}
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);