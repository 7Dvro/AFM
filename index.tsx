import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, Globe, ShoppingCart, User, Wheat, MapPin, Phone, Mail, 
  ChevronRight, ChevronLeft, Plus, Trash2, Edit, CheckCircle, Search,
  Facebook, Twitter, Instagram, Linkedin, Factory, Truck, Award,
  Calendar, Briefcase, FileText, Upload, Clock, ArrowRight, Save, Image as ImageIcon
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
  price?: number; 
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
    imageUrl: 'https://placehold.co/400x600/eab308/ffffff?text=Al-Shifa+25kg',
    description_ar: 'دقيق فاخر متعدد الاستخدامات، مثالي للمخبوزات والمعجنات.',
    description_en: 'Premium all-purpose flour, perfect for baking and pastries.',
    active: true
  },
  {
    id: 'p2',
    name_ar: 'دقيق السد',
    name_en: 'Al-Sadd Flour',
    weight: '25kg',
    category: 'flour',
    imageUrl: 'https://placehold.co/400x600/d97706/ffffff?text=Al-Sadd+25kg',
    description_ar: 'دقيق عالي الجودة للمخابز الآلية.',
    description_en: 'High quality flour for automated bakeries.',
    active: true
  },
  {
    id: 'p3',
    name_ar: 'دقيق رأس الثور',
    name_en: 'Ras Al-Thawr Flour',
    weight: '25kg',
    category: 'flour',
    imageUrl: 'https://placehold.co/400x600/b45309/ffffff?text=Ras+Al-Thawr',
    description_ar: 'دقيق قوي يتميز بمرونة عالية للعجين.',
    description_en: 'Strong flour characterized by high dough elasticity.',
    active: true
  },
  {
    id: 'p4',
    name_ar: 'دقيق الريان',
    name_en: 'Al-Rayyan Flour',
    weight: '25kg',
    category: 'flour',
    imageUrl: 'https://placehold.co/400x600/92400e/ffffff?text=Al-Rayyan',
    description_ar: 'دقيق استخراج 72%، بياض ناصع.',
    description_en: '72% extraction flour, pure white.',
    active: true
  },
  {
    id: 'p5',
    name_ar: 'دقيق الجوهرة',
    name_en: 'Al-Jawhara Flour',
    weight: '25kg',
    category: 'flour',
    imageUrl: 'https://placehold.co/400x600/78350f/ffffff?text=Al-Jawhara',
    description_ar: 'الخيار الأول لصناعة البسكويت والكيك.',
    description_en: 'The first choice for biscuits and cake manufacturing.',
    active: true
  },
  {
    id: 'p6',
    name_ar: 'ردة (نخالة)',
    name_en: 'Wheat Bran (Radda)',
    weight: '40kg',
    category: 'bran',
    imageUrl: 'https://placehold.co/400x600/A0522D/ffffff?text=Bran+40kg',
    description_ar: 'نخالة قمح صافية للأعلاف والاستخدامات الأخرى.',
    description_en: 'Pure wheat bran for feed and other uses.',
    active: true
  },
  {
    id: 'p7',
    name_ar: 'دقيق منزلي',
    name_en: 'Household Flour',
    weight: '1kg',
    category: 'flour',
    imageUrl: 'https://placehold.co/400x600/fbbf24/000000?text=1kg+Pack',
    description_ar: 'عبوة منزلية اقتصادية.',
    description_en: 'Economical household pack.',
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
    cart_title: 'سلة الطلبات',
    cart_empty: 'السلة فارغة حالياً',
    checkout: 'إرسال طلب الشراء',
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
    name: 'الاسم',
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
    save: 'حفظ'
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
    cart_title: 'Order Cart',
    cart_empty: 'Cart is currently empty',
    checkout: 'Submit Order Request',
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
    name: 'Name',
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
    save: 'Save'
  }
};

// --- CONTEXT ---

const AppContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  view: View;
  setView: (v: View) => void;
  cart: CartItem[];
  addToCart: (p: Product) => void;
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
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
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
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
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

const ProductList = () => {
  const { lang, products, addToCart } = useContext(AppContext);
  const t = TRANSLATIONS[lang];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
          <span className="text-brand-600 font-bold uppercase tracking-wider text-sm">{t.brand}</span>
          <h3 className="text-4xl font-bold text-stone-900 mt-2">{t.prod_title}</h3>
          <div className="w-24 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 border border-stone-100 overflow-hidden group flex flex-col">
            <div className="h-64 bg-stone-50 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-900/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <img src={p.imageUrl} alt={lang === 'ar' ? p.name_ar : p.name_en} className="max-h-full object-contain group-hover:scale-110 transition duration-500 z-10" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-20">
                {p.weight}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-2">
                 <span className="text-xs text-stone-400 uppercase font-semibold">{p.category}</span>
              </div>
              <h4 className="text-xl font-bold text-stone-800 mb-3 leading-tight">{lang === 'ar' ? p.name_ar : p.name_en}</h4>
              <p className="text-stone-500 text-sm mb-6 line-clamp-2 flex-1">{lang === 'ar' ? p.description_ar : p.description_en}</p>
              <button 
                onClick={() => addToCart(p)}
                className="w-full bg-stone-900 text-white py-3 rounded-xl hover:bg-brand-600 transition flex items-center justify-center gap-2 font-semibold shadow-lg shadow-stone-900/10 group-hover:shadow-brand-600/20"
              >
                <Plus size={18} /> {t.add_to_cart}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CartView = () => {
  const { lang, cart, removeFromCart, clearCart } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    FirebaseService.submitOrder({ cart, date: new Date() });
    setSubmitted(true);
    setTimeout(() => {
      clearCart();
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="bg-green-100 text-green-600 p-6 rounded-full mb-6"><CheckCircle size={64} /></div>
        <h3 className="text-3xl font-bold text-green-800 mb-2">{t.order_success}</h3>
        <p className="text-stone-500">REF: #{Math.floor(Math.random() * 10000)}</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-400">
        <ShoppingCart size={80} className="mb-6 opacity-20" />
        <p className="text-2xl font-bold text-stone-300">{t.cart_empty}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8">{t.cart_title}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 mb-8">
        {cart.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between border-b last:border-0 border-stone-100 py-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-stone-50 rounded-lg p-2 flex items-center justify-center">
                 <img src={item.imageUrl} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-stone-800">{lang === 'ar' ? item.name_ar : item.name_en}</h4>
                <p className="text-sm text-stone-500">{item.weight}</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-stone-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="text-brand-600" /> {t.checkout}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
              <label className="block text-sm font-bold text-stone-600 mb-2">{t.name} *</label>
              <input required type="text" className="border border-stone-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
          </div>
          <div>
              <label className="block text-sm font-bold text-stone-600 mb-2">{t.email} *</label>
              <input required type="email" className="border border-stone-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
          </div>
          <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-600 mb-2">Phone *</label>
              <input required type="tel" className="border border-stone-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
          </div>
        </div>
        <button type="submit" className="bg-brand-600 text-white w-full py-4 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-600/20 text-lg">
          {t.checkout}
        </button>
      </form>
    </div>
  );
};

const AdminPanel = () => {
  const { lang, products, setProducts, news, setNews, events, setEvents, jobs, setJobs } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [tab, setTab] = useState('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({...item});
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, list: any[], setter: any) => {
    if(confirm(t.delete + '?')) {
      setter(list.filter((i: any) => i.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
      // Set defaults for specific types if new
      ...(tab === 'jobs' && !editingItem ? { postedDate: new Date().toISOString().split('T')[0] } : {})
    };

    if (tab === 'products') {
      if (editingItem) setProducts(products.map(p => p.id === newItem.id ? newItem : p));
      else setProducts([...products, newItem]);
    } else if (tab === 'news') {
      if (editingItem) setNews(news.map(n => n.id === newItem.id ? newItem : n));
      else setNews([...news, newItem]);
    } else if (tab === 'events') {
      if (editingItem) setEvents(events.map(ev => ev.id === newItem.id ? newItem : ev));
      else setEvents([...events, newItem]);
    } else if (tab === 'jobs') {
      if (editingItem) setJobs(jobs.map(j => j.id === newItem.id ? newItem : j));
      else setJobs([...jobs, newItem]);
    }

    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-stone-900 text-white rounded-xl p-6 h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-8 px-2 flex items-center gap-2"><Wheat size={20} className="text-brand-500"/> Al-Shifa Admin</h3>
          <nav className="flex flex-col gap-2">
            {['products', 'news', 'events', 'jobs', 'orders', 'users'].map((t) => (
              <button 
                key={t}
                onClick={() => setTab(t)} 
                className={`px-4 py-3 rounded-lg text-start font-medium transition capitalize ${tab === t ? 'bg-brand-600 text-white' : 'hover:bg-stone-800 text-stone-400'}`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 p-8 min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold capitalize text-stone-800">{tab} Management</h2>
            {['products', 'news', 'events', 'jobs'].includes(tab) && (
              <button onClick={handleAdd} className="bg-brand-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-brand-700 font-bold shadow-md transition">
                <Plus size={18} /> {t.add_new}
              </button>
            )}
          </div>

          {/* LISTS */}
          {tab === 'products' && (
            <div className="overflow-x-auto rounded-lg border border-stone-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50">
                  <tr className="border-b border-stone-200 text-stone-500 text-sm uppercase">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Weight</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4 font-bold text-stone-700">{p.name_en}</td>
                      <td className="p-4"><span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold">{p.category}</span></td>
                      <td className="p-4 text-stone-600">{p.weight}</td>
                      <td className="p-4 text-green-600"><CheckCircle size={18} /></td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                        <button onClick={() => handleDelete(p.id, products, setProducts)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'news' && (
             <div className="space-y-4">
               {news.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-stone-50">
                   <div className="flex gap-4 items-center">
                     <img src={item.imageUrl} className="w-16 h-16 rounded object-cover" />
                     <div>
                       <h4 className="font-bold">{item.title_en}</h4>
                       <span className="text-xs text-stone-500">{item.date}</span>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                     <button onClick={() => handleDelete(item.id, news, setNews)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                   </div>
                 </div>
               ))}
             </div>
          )}

          {tab === 'events' && (
             <div className="space-y-4">
               {events.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-stone-50">
                   <div>
                     <h4 className="font-bold">{item.title_en}</h4>
                     <div className="flex gap-4 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={12}/> {item.location_en}</span>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                     <button onClick={() => handleDelete(item.id, events, setEvents)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                   </div>
                 </div>
               ))}
             </div>
          )}
          
          {tab === 'jobs' && (
             <div className="space-y-4">
               {jobs.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-stone-50">
                   <div>
                     <h4 className="font-bold">{item.title_en}</h4>
                     <div className="flex gap-2 text-xs text-stone-500 mt-1">
                        <span className="bg-stone-100 px-2 py-0.5 rounded">{item.department_en}</span>
                        <span className="bg-stone-100 px-2 py-0.5 rounded">{item.type_en}</span>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                     <button onClick={() => handleDelete(item.id, jobs, setJobs)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                   </div>
                 </div>
               ))}
             </div>
          )}

          {tab === 'orders' && <div className="text-center py-20 text-stone-400">No new orders received today.</div>}
        </div>
      </div>

      {/* Dynamic Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? `${t.edit} ${tab}` : `${t.add_new} ${tab}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* PRODUCT FORM */}
          {tab === 'products' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold">Name (AR)</label><input required name="name_ar" defaultValue={editingItem?.name_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                <div><label className="text-sm font-bold">Name (EN)</label><input required name="name_en" defaultValue={editingItem?.name_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold">Category</label><input required name="category" defaultValue={editingItem?.category} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                <div><label className="text-sm font-bold">Weight</label><input required name="weight" defaultValue={editingItem?.weight} onChange={handleChange} className="w-full border p-2 rounded"/></div>
              </div>
               <div><label className="text-sm font-bold">Image URL</label><input required name="imageUrl" defaultValue={editingItem?.imageUrl} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Desc (AR)</label><textarea name="description_ar" defaultValue={editingItem?.description_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Desc (EN)</label><textarea name="description_en" defaultValue={editingItem?.description_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
            </>
          )}

          {/* NEWS FORM */}
          {tab === 'news' && (
             <>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm font-bold">Title (AR)</label><input required name="title_ar" defaultValue={editingItem?.title_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                 <div><label className="text-sm font-bold">Title (EN)</label><input required name="title_en" defaultValue={editingItem?.title_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               </div>
               <div><label className="text-sm font-bold">Date</label><input type="date" required name="date" defaultValue={editingItem?.date} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Image URL</label><input required name="imageUrl" defaultValue={editingItem?.imageUrl} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Summary (AR)</label><textarea name="summary_ar" defaultValue={editingItem?.summary_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Summary (EN)</label><textarea name="summary_en" defaultValue={editingItem?.summary_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
             </>
          )}

          {/* EVENT FORM */}
          {tab === 'events' && (
             <>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm font-bold">Title (AR)</label><input required name="title_ar" defaultValue={editingItem?.title_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                 <div><label className="text-sm font-bold">Title (EN)</label><input required name="title_en" defaultValue={editingItem?.title_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm font-bold">Location (AR)</label><input required name="location_ar" defaultValue={editingItem?.location_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                 <div><label className="text-sm font-bold">Location (EN)</label><input required name="location_en" defaultValue={editingItem?.location_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               </div>
               <div><label className="text-sm font-bold">Date</label><input type="date" required name="date" defaultValue={editingItem?.date} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Image URL</label><input required name="imageUrl" defaultValue={editingItem?.imageUrl} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Desc (AR)</label><textarea name="description_ar" defaultValue={editingItem?.description_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Desc (EN)</label><textarea name="description_en" defaultValue={editingItem?.description_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
             </>
          )}

          {/* JOB FORM */}
          {tab === 'jobs' && (
             <>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm font-bold">Title (AR)</label><input required name="title_ar" defaultValue={editingItem?.title_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                 <div><label className="text-sm font-bold">Title (EN)</label><input required name="title_en" defaultValue={editingItem?.title_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm font-bold">Department (AR)</label><input required name="department_ar" defaultValue={editingItem?.department_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                 <div><label className="text-sm font-bold">Department (EN)</label><input required name="department_en" defaultValue={editingItem?.department_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm font-bold">Location (AR)</label><input required name="location_ar" defaultValue={editingItem?.location_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                 <div><label className="text-sm font-bold">Location (EN)</label><input required name="location_en" defaultValue={editingItem?.location_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-sm font-bold">Type (AR)</label><input required name="type_ar" defaultValue={editingItem?.type_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
                 <div><label className="text-sm font-bold">Type (EN)</label><input required name="type_en" defaultValue={editingItem?.type_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               </div>
               <div><label className="text-sm font-bold">Desc (AR)</label><textarea name="description_ar" defaultValue={editingItem?.description_ar} onChange={handleChange} className="w-full border p-2 rounded"/></div>
               <div><label className="text-sm font-bold">Desc (EN)</label><textarea name="description_en" defaultValue={editingItem?.description_en} onChange={handleChange} className="w-full border p-2 rounded"/></div>
             </>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-stone-600 font-bold hover:bg-stone-100 rounded-lg">{t.cancel}</button>
            <button type="submit" className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 flex justify-center items-center gap-2"><Save size={18}/> {t.save}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const Login = () => {
  const { login, lang } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@alshifa.com') login('admin');
    else alert('Use admin@alshifa.com for demo');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-stone-100">
        <div className="text-center mb-8">
          <div className="bg-brand-50 text-brand-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <User size={40} />
          </div>
          <h2 className="text-3xl font-bold text-stone-800">{t.admin_login}</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-600 mb-2">{t.email}</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" 
              placeholder="admin@alshifa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-600 mb-2">{t.password}</label>
            <input 
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" 
              placeholder="********"
            />
          </div>
          <button className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg">
            {t.login}
          </button>
        </form>
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
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-brand-600 p-2 rounded-lg">
                <Wheat size={24} className="text-white"/>
              </div>
              <span className="text-2xl font-bold">{t.brand}</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-sm">{t.footer_desc}</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition duration-300"><Facebook size={18}/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition duration-300"><Twitter size={18}/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition duration-300"><Instagram size={18}/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition duration-300"><Linkedin size={18}/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="space-y-4">
              <li><button onClick={() => setView('home')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_home}</button></li>
              <li><button onClick={() => setView('products')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_products}</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_about}</button></li>
              <li><button onClick={() => setView('careers')} className="hover:text-brand-500 transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_careers}</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-brand-600 mt-1 shrink-0"/> 
                  <span>Industrial City, Phase 3,<br/>Riyadh, Saudi Arabia</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-brand-600 shrink-0"/> 
                  <span dir="ltr">+966 12 345 6789</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={20} className="text-brand-600 shrink-0"/> 
                  <span>info@alshifa.com</span>
                </li>
              </ul>
          </div>

          {/* Newsletter */}
          <div>
             <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{t.subscribe}</h4>
             <p className="text-xs mb-4">{lang === 'ar' ? 'اشترك في قائمتنا البريدية للحصول على آخر الأخبار والعروض.' : 'Subscribe to our newsletter for latest news and offers.'}</p>
             <div className="flex flex-col gap-2">
               <input type="email" placeholder={t.email} className="bg-stone-800 border-none text-white p-3 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none text-sm" />
               <button className="bg-brand-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-brand-700 transition">{t.subscribe_btn}</button>
             </div>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>{t.copyright} &copy; {new Date().getFullYear()}</p>
          <div className="flex items-center gap-1 bg-stone-900 px-4 py-2 rounded-full border border-stone-800">
            <span>{t.designed_by}</span>
            <a href="#" className="text-brand-500 font-bold hover:text-brand-400 transition ml-1">7Dvro</a>
            <span className="text-stone-600">for IT Solutions</span>
          </div>
        </div>
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
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Load all initial data
    FirebaseService.getProducts().then(setProducts);
    FirebaseService.getNews().then(setNews);
    FirebaseService.getEvents().then(setEvents);
    FirebaseService.getJobs().then(setJobs);
  }, [lang]);

  const addToCart = (p: Product) => {
    setCart([...cart, { ...p, quantity: 1 }]);
    alert(lang === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const clearCart = () => setCart([]);
  const login = (role: string) => {
    setUser({ name: 'Admin User', role, email: 'admin@alshifa.com' });
    setView('admin');
  };
  const logout = () => {
    setUser(null);
    setView('home');
  };

  const contextValue = {
    lang, setLang, view, setView, 
    cart, addToCart, removeFromCart, clearCart, 
    user, login, logout, 
    products, setProducts,
    news, setNews,
    events, setEvents,
    jobs, setJobs
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-brand-500 selection:text-white">
        <Header />
        
        <main className="flex-1">
          {view === 'home' && (
            <>
              <Hero />
              <StatsSection />
              <ProductList />
              
              {/* Features/Impact Section */}
              <div className="bg-stone-50 py-20 border-t border-stone-100">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300">
                    <div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><CheckCircle size={40}/></div>
                    <h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'جودة مضمونة' : 'Quality Guaranteed'}</h3>
                    <p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'نستخدم أفضل أنواع القمح لضمان جودة منتجاتنا وفق أعلى المعايير.' : 'We use the best wheat types to ensure product quality per highest standards.'}</p>
                  </div>
                  <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300">
                    <div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><MapPin size={40}/></div>
                    <h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'تغطية واسعة' : 'Wide Coverage'}</h3>
                    <p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'أسطول توزيع متكامل يغطي جميع أنحاء المملكة لضمان الوصول السريع.' : 'Integrated distribution fleet covering the kingdom for fast delivery.'}</p>
                  </div>
                  <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300">
                    <div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><Phone size={40}/></div>
                    <h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'دعم مستمر' : '24/7 Support'}</h3>
                    <p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'فريق خدمة العملاء جاهز لخدمتكم والإجابة على استفساراتكم.' : 'Customer service team ready to serve you and answer your queries.'}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === 'products' && <ProductList />}
          {view === 'news' && <NewsView />}
          {view === 'events' && <EventsView />}
          {view === 'careers' && <CareersView />}
          {view === 'cart' && <CartView />}
          {view === 'login' && <Login />}
          {view === 'admin' && (user ? <AdminPanel /> : <Login />)}
          
          {view === 'contact' && (
            <div className="container mx-auto px-4 py-16">
               <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-stone-100">
                 <div className="text-center mb-10">
                    <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600"><Mail size={32}/></div>
                    <h2 className="text-3xl font-bold text-stone-800">{TRANSLATIONS[lang].contact_us_title}</h2>
                    <p className="text-stone-500 mt-2">We'd love to hear from you</p>
                 </div>
                 <form className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].name}</label>
                        <input type="text" className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].email}</label>
                        <input type="email" className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].message}</label>
                      <textarea rows={5} className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"></textarea>
                   </div>
                   <button className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg">{TRANSLATIONS[lang].send}</button>
                 </form>
               </div>
            </div>
          )}

          {view === 'about' && (
             <div className="container mx-auto px-4 py-16 max-w-4xl">
               <div className="bg-white p-10 rounded-2xl shadow-lg border border-stone-100">
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-100">
                     <div className="bg-brand-600 text-white p-4 rounded-2xl shadow-lg shadow-brand-600/30"><Wheat size={48}/></div>
                     <div>
                        <h2 className="text-4xl font-bold text-stone-900">{TRANSLATIONS[lang].nav_about}</h2>
                        <span className="text-brand-600 font-bold tracking-widest uppercase text-sm">Since 1985</span>
                     </div>
                  </div>
                  <div className="prose max-w-none text-stone-600 leading-loose text-lg">
                    <p className="mb-6 font-medium text-stone-800">{TRANSLATIONS[lang].footer_desc}</p>
                    <p>{lang === 'ar' ? 'تأسست مطاحن الشفاء برؤية تهدف إلى تعزيز الأمن الغذائي وتقديم منتجات عالية الجودة. نحن نستخدم أحدث التقنيات الألمانية في الطحن والغربلة لضمان استخراج أنقى أنواع الدقيق.' : 'Al-Shifa Mills was founded with a vision to enhance food security and provide high-quality products. We use the latest German technology in milling and sifting to ensure the extraction of the purest flour.'}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                       <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                          <h4 className="font-bold text-stone-900 mb-2">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h4>
                          <p className="text-sm">To be the leading provider of grain products in the Middle East.</p>
                       </div>
                       <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                          <h4 className="font-bold text-stone-900 mb-2">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h4>
                          <p className="text-sm">Delivering healthy, high-quality nutrition to every home.</p>
                       </div>
                    </div>
                  </div>
               </div>
             </div>
          )}
        </main>

        <Footer />
      </div>
    </AppContext.Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);