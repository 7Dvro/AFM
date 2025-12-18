
import React, { useState, useEffect, createContext, useContext, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, Globe, ShoppingCart, User, Wheat, MapPin, Phone, Mail, 
  ChevronRight, ChevronLeft, Plus, Minus, Trash2, Edit, CheckCircle, Search,
  Facebook, Twitter, Instagram, Linkedin, Factory, Truck, Award,
  Calendar, Briefcase, FileText, Upload, Clock, ArrowRight, Save, Image as ImageIcon,
  LayoutDashboard, LogOut, Bell, Lock, ShieldCheck, Package, Star, Info, Leaf, DollarSign,
  Eye, EyeOff, LogIn, MessageCircle, Send, Video, Palette, Ban, History, FileBox, Settings, ToggleLeft, ToggleRight, Users, Download, ChevronDown, Activity, Map, PieChart, TrendingUp, AlertCircle, Share2, Bookmark, UserCircle, Link as LinkIcon, Check
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

interface Order {
    id: string;
    items: CartItem[];
    total: number;
    customerName: string;
    customerEmail: string;
    date: string;
    status: 'pending' | 'completed';
    location: string; // For map visualization
}

interface NewsItem {
  id: string;
  title_ar: string;
  title_en: string;
  date: string;
  summary_ar: string;
  summary_en: string;
  content_ar: string; 
  content_en: string; 
  author: string;     
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

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  cvUrl: string; 
  date: string;
  status: 'new' | 'reviewed';
  downloaded: boolean;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'banned';
    joinDate: string;
    ordersCount: number;
    phone: string;
    savedNewsIds: string[];
    savedEventIds: string[];
}

interface MessageItem {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
    status: 'new' | 'read';
}

interface PageSettings {
    [key: string]: boolean;
}

interface NotificationItem {
    id: string;
    type: 'order' | 'comment' | 'job' | 'system';
    message: string;
    time: string;
    read: boolean;
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
    content_ar: 'احتفلت مطاحن الشفاء اليوم بتدشين التوسعة الجديدة للمصنع والتي ستسهم في رفع الطاقة الإنتاجية بمقدار 500 طن يومياً. يأتي هذا المشروع ضمن خطة الشركة الاستراتيجية لتلبية الطلب المتزايد في السوق المحلي والإقليمي. وقد حضر الحفل عدد من المسؤولين ورجال الأعمال، حيث تم استعراض التقنيات الحديثة المستخدمة في خط الإنتاج الجديد والتي تعتمد على الأتمتة الكاملة لضمان أعلى معايير الجودة والسلامة الغذائية.',
    content_en: 'Al-Shifa Mills celebrated today the launch of the new factory expansion, which will contribute to increasing production capacity by 500 tons per day. This project comes within the company\'s strategic plan to meet the growing demand in the local and regional market. The ceremony was attended by a number of officials and businessmen, where the modern technologies used in the new production line were reviewed, which rely on full automation to ensure the highest standards of quality and food safety.',
    author: 'Admin',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'n2',
    title_ar: 'حصول الشركة على شهادة الأيزو 22000',
    title_en: 'Company Receives ISO 22000 Certification',
    date: '2023-10-01',
    summary_ar: 'تأكيداً على التزامنا بأعلى معايير الجودة وسلامة الغذاء...',
    summary_en: 'Confirming our commitment to the highest quality and food safety standards...',
    content_ar: 'في إنجاز جديد يضاف لسجل الشركة الحافل، حصلت مطاحن الشفاء على شهادة الأيزو 22000 لنظام إدارة سلامة الغذاء. يعكس هذا الإنجاز التزامنا الصارم بتطبيق المعايير الدولية في جميع مراحل الإنتاج، من استلام الحبوب وحتى تعبئة المنتج النهائي وتوزيعه. نعد عملاءنا بالاستمرار في تقديم منتجات صحية وآمنة وعالية الجودة.',
    content_en: 'In a new achievement added to the company\'s track record, Al-Shifa Mills received the ISO 22000 certification for Food Safety Management System. This achievement reflects our strict commitment to implementing international standards at all stages of production, from receiving grains to packaging and distributing the final product. We promise our customers to continue providing healthy, safe, and high-quality products.',
    author: 'Quality Team',
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
  },
  {
    id: 'e3',
    title_ar: 'ورشة عمل خبز الدقيق الفاخر',
    title_en: 'Premium Flour Baking Workshop',
    date: '2024-03-05',
    location_ar: 'أكاديمية الشفاء - جدة',
    location_en: 'Al-Shifa Academy - Jeddah',
    description_ar: 'انضم إلينا لتعلم أسرار الخبز باستخدام أفضل أنواع الدقيق.',
    description_en: 'Join us to learn the secrets of baking using the finest flour types.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600'
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

const INITIAL_USERS: UserProfile[] = [
    { id: 'u1', name: 'Admin User', email: 'mohemadmuzamil@gmail.com', role: 'admin', status: 'active', joinDate: '2023-01-01', ordersCount: 0, phone: '+966500000000', savedNewsIds: [], savedEventIds: [] },
    { id: 'u2', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinDate: '2024-03-15', ordersCount: 5, phone: '+966511111111', savedNewsIds: [], savedEventIds: [] },
    { id: 'u3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'banned', joinDate: '2024-04-10', ordersCount: 1, phone: '+966522222222', savedNewsIds: [], savedEventIds: [] },
];

const INITIAL_MESSAGES: MessageItem[] = [
    { id: 'm1', name: 'Ahmed Ali', email: 'ahmed@test.com', message: 'I need a quote for 50 tons of flour.', date: '2024-05-20', status: 'new' },
];

const INITIAL_ORDERS: Order[] = [
    {
        id: 'ord-123',
        items: [{...INITIAL_PRODUCTS[0], quantity: 10}],
        total: 440,
        customerName: 'Baker One',
        customerEmail: 'baker@test.com',
        date: '2024-05-15',
        status: 'completed',
        location: 'Riyadh'
    },
    {
        id: 'ord-124',
        items: [{...INITIAL_PRODUCTS[3], quantity: 5}],
        total: 250,
        customerName: 'Home User',
        customerEmail: 'home@test.com',
        date: '2024-05-18',
        status: 'completed',
        location: 'Jeddah'
    }
];

const INITIAL_PAGE_SETTINGS: PageSettings = {
    home: true,
    products: true,
    about: true,
    contact: true,
    news: true,
    events: true,
    careers: true
};

// --- THEME DATA (9 Calming, Professional Themes) ---
const THEMES = {
  // 1. Nature Green (Default) - Fresh & Organic
  green: {
    '--brand-50': '240 253 244',
    '--brand-100': '220 252 231',
    '--brand-200': '187 247 208',
    '--brand-300': '134 239 172',
    '--brand-400': '74 222 128',
    '--brand-500': '34 197 94',
    '--brand-600': '22 163 74',
    '--brand-700': '21 128 61',
    '--brand-800': '22 101 52',
    '--brand-900': '20 83 45',
    '--brand-950': '5 46 22',
  },
  // 2. Wheat Gold - Warm & Rich (Matches the flour bags)
  gold: {
    '--brand-50': '255 251 235',
    '--brand-100': '254 243 199',
    '--brand-200': '253 230 138',
    '--brand-300': '252 211 77',
    '--brand-400': '251 191 36',
    '--brand-500': '245 158 11',
    '--brand-600': '217 119 6', 
    '--brand-700': '180 83 9',
    '--brand-800': '146 64 14',
    '--brand-900': '120 53 15',
    '--brand-950': '69 26 3',
  },
  // 3. Corporate Blue - Trustworthy & Calm
  blue: {
    '--brand-50': '239 246 255',
    '--brand-100': '219 234 254',
    '--brand-200': '191 219 254',
    '--brand-300': '147 197 253',
    '--brand-400': '96 165 250',
    '--brand-500': '59 130 246',
    '--brand-600': '37 99 235',
    '--brand-700': '29 78 216',
    '--brand-800': '30 64 175',
    '--brand-900': '30 58 138',
    '--brand-950': '23 37 84',
  },
  // 4. Earthy Stone - Neutral & Grounded
  stone: {
    '--brand-50': '250 250 249',
    '--brand-100': '245 245 244',
    '--brand-200': '231 229 228',
    '--brand-300': '214 211 209',
    '--brand-400': '168 162 158',
    '--brand-500': '120 113 108',
    '--brand-600': '87 83 78',
    '--brand-700': '68 64 60',
    '--brand-800': '41 37 36',
    '--brand-900': '28 25 23',
    '--brand-950': '12 10 9',
  },
  // 5. Deep Teal - Modern & Clean
  teal: {
    '--brand-50': '240 253 250',
    '--brand-100': '204 251 241',
    '--brand-200': '153 246 228',
    '--brand-300': '94 234 212',
    '--brand-400': '45 212 191',
    '--brand-500': '20 184 166',
    '--brand-600': '13 148 136',
    '--brand-700': '15 118 110',
    '--brand-800': '17 94 89',
    '--brand-900': '19 78 74',
    '--brand-950': '4 47 46',
  },
  // 6. Royal Indigo - Premium & Deep
  indigo: {
    '--brand-50': '238 242 255',
    '--brand-100': '224 231 255',
    '--brand-200': '199 210 254',
    '--brand-300': '165 180 252',
    '--brand-400': '129 140 248',
    '--brand-500': '99 102 241',
    '--brand-600': '79 70 229',
    '--brand-700': '67 56 202',
    '--brand-800': '55 48 163',
    '--brand-900': '49 46 129',
    '--brand-950': '30 27 75',
  },
  // 7. Muted Clay/Terra - Warm & Rustic
  clay: {
    '--brand-50': '255 241 242',
    '--brand-100': '255 228 230',
    '--brand-200': '254 205 211',
    '--brand-300': '253 164 175',
    '--brand-400': '251 113 133',
    '--brand-500': '244 63 94',
    '--brand-600': '225 29 72',
    '--brand-700': '190 18 60',
    '--brand-800': '159 18 57',
    '--brand-900': '136 19 55',
    '--brand-950': '76 5 25',
  },
  // 8. Slate - Minimalist Corporate
  slate: {
    '--brand-50': '248 250 252',
    '--brand-100': '241 245 249',
    '--brand-200': '226 232 240',
    '--brand-300': '203 213 225',
    '--brand-400': '148 163 184',
    '--brand-500': '100 116 139',
    '--brand-600': '71 85 105',
    '--brand-700': '51 65 85',
    '--brand-800': '30 41 59',
    '--brand-900': '15 23 42',
    '--brand-950': '2 6 23',
  },
  // 9. Bronze/Coffee - Agricultural & Strong
  bronze: {
    '--brand-50': '255 252 232',
    '--brand-100': '254 249 195',
    '--brand-200': '254 240 138',
    '--brand-300': '253 224 71',
    '--brand-400': '250 204 21',
    '--brand-500': '234 179 8',
    '--brand-600': '202 138 4',
    '--brand-700': '161 98 7',
    '--brand-800': '133 77 14',
    '--brand-900': '113 63 18',
    '--brand-950': '66 32 6',
  }
};

type ThemeName = keyof typeof THEMES;

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
    choose_theme: 'اختر المظهر',
    users_manage: 'إدارة المستخدمين',
    pages_manage: 'إدارة الصفحات',
    messages_manage: 'الرسائل والشكاوى',
    active: 'نشط',
    banned: 'محظور',
    role: 'الدور',
    join_date: 'تاريخ الانضمام',
    actions: 'إجراءات',
    ban: 'حظر',
    unban: 'فك الحظر',
    history: 'سجل الطلبات',
    no_orders: 'لا توجد طلبات سابقة',
    page_name: 'اسم الصفحة',
    visibility: 'الحالة',
    visible: 'ظاهر',
    hidden: 'مخفي',
    status: 'الحالة',
    mark_read: 'تحديد كمقروء',
    new: 'جديد',
    read: 'مقروء',
    from: 'من',
    or_url: 'أو رابط صورة',
    view_applications: 'عرض الطلبات',
    no_applications: 'لا توجد طلبات مقدمة لهذه الوظيفة حتى الآن.',
    download_cv: 'تحميل السيرة الذاتية',
    applicant_name: 'اسم المتقدم',
    application_date: 'تاريخ التقديم',
    back_to_jobs: 'العودة للوظائف',
    cv_uploaded: 'تم إرفاق السيرة الذاتية',
    cv_downloaded_badge: 'تم التحميل',
    analytics_report: 'تقرير المبيعات والتحليلات',
    live_visitors: 'زيارات الصفحة',
    live_map: 'خريطة الطلبات الحديثة',
    top_selling: 'المنتجات الأكثر مبيعاً',
    sales_distribution: 'توزيع المبيعات (أفراد/مخابز)',
    notifications: 'الإشعارات',
    no_notifications: 'لا توجد إشعارات جديدة',
    share: 'مشاركة',
    search_placeholder: 'ابحث عن أخبار...',
    search_events_placeholder: 'ابحث عن فعاليات...',
    search: 'بحث',
    save_to_profile: 'حفظ في الملف الشخصي',
    saved_to_profile: 'تم الحفظ في الملف الشخصي',
    share_success: 'تم نسخ الرابط بنجاح',
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
    choose_theme: 'Choose Theme',
    users_manage: 'Manage Users',
    pages_manage: 'Manage Pages',
    messages_manage: 'Messages & Complaints',
    active: 'Active',
    banned: 'Banned',
    role: 'Role',
    join_date: 'Join Date',
    actions: 'Actions',
    ban: 'Ban',
    unban: 'Unban',
    history: 'Order History',
    no_orders: 'No previous orders',
    page_name: 'Page Name',
    visibility: 'Visibility',
    visible: 'Visible',
    hidden: 'Hidden',
    status: 'Status',
    mark_read: 'Mark Read',
    new: 'New',
    read: 'Read',
    from: 'From',
    or_url: 'Or Image URL',
    view_applications: 'View Applications',
    no_applications: 'No applications for this job yet.',
    download_cv: 'Download CV',
    applicant_name: 'Applicant Name',
    application_date: 'Applied Date',
    back_to_jobs: 'Back to Jobs',
    cv_uploaded: 'CV Attached',
    cv_downloaded_badge: 'Downloaded',
    analytics_report: 'Sales & Analytics Report',
    live_visitors: 'Page Views',
    live_map: 'Recent Orders Map',
    top_selling: 'Top Selling Products',
    sales_distribution: 'Sales Distribution',
    notifications: 'Notifications',
    no_notifications: 'No new notifications',
    share: 'Share',
    search_placeholder: 'Search news...',
    search_events_placeholder: 'Search events...',
    search: 'Search',
    save_to_profile: 'Save to Profile',
    saved_to_profile: 'Saved to Profile',
    share_success: 'Link copied to clipboard',
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
  setTheme: (t: ThemeName) => void;
  // Admin Features
  usersList: UserProfile[];
  setUsersList: (u: UserProfile[]) => void;
  messages: MessageItem[];
  setMessages: (m: MessageItem[]) => void;
  pageSettings: PageSettings;
  setPageSettings: (p: PageSettings) => void;
  // Job Applications
  jobApplications: JobApplication[];
  addJobApplication: (app: JobApplication) => void;
  markCVDownloaded: (appId: string) => void;
  // Notifications
  notifications: NotificationItem[];
  addNotification: (note: NotificationItem) => void;
  clearNotifications: () => void;
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  pageViews: number;
  // User Actions
  toggleSavedNews: (id: string) => void;
  toggleSavedEvent: (id: string) => void;
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in-95 duration-200">
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
  const { lang, setLang, view, setView, cart, user, logout, setTheme, pageSettings } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to get color preview from THEMES
  const getColorPreview = (themeName: ThemeName) => `rgb(${THEMES[themeName]['--brand-600']})`;

  // Filter visible nav items based on admin settings
  const navItems = ['home', 'products', 'news', 'events', 'careers', 'about', 'contact'].filter(item => pageSettings[item as keyof PageSettings] !== false);

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
          {navItems.map((v: any) => (
             <button key={v} onClick={() => setView(v)} className={`hover:text-brand-600 transition ${view === v ? 'text-brand-600 font-bold' : ''}`}>{t[`nav_${v}` as keyof typeof t]}</button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowThemeMenu(!showThemeMenu)} className="flex items-center gap-1 text-sm bg-stone-100 px-2 py-2 rounded-full hover:bg-brand-100 transition text-stone-600 hover:text-brand-600">
                <Palette size={20} />
            </button>
            {showThemeMenu && (
                <div className="absolute top-full mt-2 right-0 rtl:left-0 rtl:right-auto bg-white border border-stone-100 shadow-xl rounded-xl p-4 w-52 z-50 animate-in fade-in zoom-in-95">
                    <h4 className="text-xs font-bold text-stone-400 mb-3 uppercase text-center">{t.choose_theme}</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {(Object.keys(THEMES) as ThemeName[]).map((themeName) => (
                            <button 
                              key={themeName} 
                              onClick={() => { setTheme(themeName); setShowThemeMenu(false); }} 
                              className="w-10 h-10 rounded-full ring-2 ring-transparent hover:ring-2 hover:ring-offset-2 hover:scale-110 transition shadow-sm"
                              style={{ backgroundColor: getColorPreview(themeName), borderColor: getColorPreview(themeName), boxShadow: `0 0 0 1px ${getColorPreview(themeName)}` }}
                              title={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                            ></button>
                        ))}
                    </div>
                </div>
            )}
          </div>
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
          {navItems.map((v: any) => (
             <button key={v} onClick={() => { setView(v); setMobileMenu(false); }} className="text-start py-2 border-b border-stone-100 last:border-0">{t[`nav_${v}` as keyof typeof t]}</button>
          ))}
        </div>
      )}
    </header>
  );
};

const NewsView = () => {
  const { lang, news, user, toggleSavedNews, setView } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const openNews = (item: NewsItem) => setSelectedNews(item);
  const closeNews = () => setSelectedNews(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleShare = async (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const title = lang === 'ar' ? item.title_ar : item.title_en;
    const url = window.location.href; // In a real app, this would be a specific slug
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text: lang === 'ar' ? item.summary_ar : item.summary_en, url });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast(t.share_success);
    }
  };

  const handleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
        setView('login');
        return;
    }
    toggleSavedNews(id);
    const isSaved = user.savedNewsIds?.includes(id);
    showToast(isSaved ? 'Removed from saved' : t.saved_to_profile);
  };

  const filteredNews = news.filter(item => {
    const term = searchTerm.toLowerCase();
    const title = (lang === 'ar' ? item.title_ar : item.title_en).toLowerCase();
    const summary = (lang === 'ar' ? item.summary_ar : item.summary_en).toLowerCase();
    return title.includes(term) || summary.includes(term);
  });

  return (
    <div className="min-h-screen bg-stone-50/50">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 rtl:left-4 rtl:right-auto z-[150] bg-stone-900 text-white px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <Check size={18} className="text-green-500" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Hero Header with Integrated Search */}
      <div className="bg-stone-900 text-white py-24 relative overflow-visible">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)'}}></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">Insights & Updates</span>
              <h1 className="text-4xl md:text-5xl font-black mb-6">{t.browse_news}</h1>
              <p className="text-stone-400 max-w-2xl mx-auto text-lg mb-12">Stay updated with the latest from Al-Shifa Mills, industry trends, and company announcements.</p>
              
              {/* Floating Search Bar */}
              <div className="max-w-2xl mx-auto relative transform translate-y-8 z-20">
                <div className="bg-white rounded-full shadow-2xl p-2 flex items-center border border-stone-100">
                    <div className="pl-4 rtl:pr-4 rtl:pl-0 text-stone-400">
                        <Search size={24} />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.search_placeholder}
                        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-stone-800 text-lg font-medium placeholder:text-stone-300 w-full"
                    />
                    <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-bold transition duration-300 shadow-lg shadow-brand-600/20">
                        {t.search}
                    </button>
                </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {filteredNews.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <Search size={64} className="mx-auto mb-4 text-stone-300"/>
                <p className="text-xl font-bold text-stone-400">No results found for "{searchTerm}"</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => {
                const isSaved = user?.savedNewsIds?.includes(item.id);
                return (
                    <div key={item.id} onClick={() => openNews(item)} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden border border-stone-100 flex flex-col h-full relative">
                    <div className="relative h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition duration-300"></div>
                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={lang === 'ar' ? item.title_ar : item.title_en} />
                        
                        {/* Bookmark Button on Card */}
                        <button 
                            onClick={(e) => handleSave(item.id, e)}
                            className={`absolute top-4 left-4 z-30 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${isSaved ? 'bg-brand-600 text-white' : 'bg-white/90 text-stone-400 hover:text-brand-600'}`}
                            title={t.save_to_profile}
                        >
                            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                        </button>

                        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur text-stone-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                            <Calendar size={12} className="text-brand-600"/>
                            {item.date}
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-stone-900 mb-3 line-clamp-2 leading-tight group-hover:text-brand-600 transition">{lang === 'ar' ? item.title_ar : item.title_en}</h3>
                        <p className="text-stone-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{lang === 'ar' ? item.summary_ar : item.summary_en}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
                                <UserCircle size={16}/> {item.author || 'Admin'}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={(e) => handleShare(item, e)}
                                    className="text-stone-400 hover:text-brand-600 transition p-1"
                                    title={t.share}
                                >
                                    <Share2 size={18} />
                                </button>
                                <span className="text-brand-600 text-sm font-bold flex items-center gap-1 group-hover:underline">
                                    {t.read_more} {lang === 'ar' ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
                                </span>
                            </div>
                        </div>
                    </div>
                    </div>
                );
            })}
            </div>
        )}
      </div>

      {/* Professional News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{zIndex: 9999}}>
            <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity duration-300" onClick={closeNews}></div>
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl relative z-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-300 flex flex-col">
                
                {/* Close Button */}
                <button onClick={closeNews} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto z-50 p-2 bg-white/50 backdrop-blur hover:bg-white text-stone-800 rounded-full transition shadow-sm border border-stone-200">
                    <X size={24}/>
                </button>

                {/* Article Header Image */}
                <div className="relative h-64 sm:h-96 flex-shrink-0">
                    <img src={selectedNews.imageUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="flex items-center gap-4 mb-4 text-sm font-medium text-white/80">
                            <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold">News</span>
                            <span className="flex items-center gap-1"><Calendar size={14}/> {selectedNews.date}</span>
                            <span className="flex items-center gap-1"><UserCircle size={14}/> {selectedNews.author || 'Admin'}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-2">{lang === 'ar' ? selectedNews.title_ar : selectedNews.title_en}</h2>
                    </div>
                </div>

                {/* Article Content */}
                <div className="p-8 sm:p-12">
                    <div className="prose prose-lg max-w-none prose-stone prose-headings:font-bold prose-a:text-brand-600 hover:prose-a:text-brand-500">
                        {/* Render content paragraphs */}
                        {(lang === 'ar' ? (selectedNews.content_ar || selectedNews.summary_ar) : (selectedNews.content_en || selectedNews.summary_en))
                            .split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4 text-stone-600 leading-loose">{paragraph}</p>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">{t.share}:</span>
                            <div className="flex gap-2">
                                <button onClick={(e) => handleShare(selectedNews, e)} className="w-10 h-10 rounded-full bg-stone-100 hover:bg-[#1DA1F2] hover:text-white text-stone-500 flex items-center justify-center transition"><Twitter size={18}/></button>
                                <button onClick={(e) => handleShare(selectedNews, e)} className="w-10 h-10 rounded-full bg-stone-100 hover:bg-[#4267B2] hover:text-white text-stone-500 flex items-center justify-center transition"><Facebook size={18}/></button>
                                <button onClick={(e) => handleShare(selectedNews, e)} className="w-10 h-10 rounded-full bg-stone-100 hover:bg-[#0077b5] hover:text-white text-stone-500 flex items-center justify-center transition"><Linkedin size={18}/></button>
                                <button onClick={(e) => handleShare(selectedNews, e)} className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-800 hover:text-white text-stone-500 flex items-center justify-center transition" title="Copy Link"><LinkIcon size={18}/></button>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => handleSave(selectedNews.id, e)}
                            className={`flex items-center gap-2 font-bold transition text-sm px-6 py-3 rounded-xl border ${user?.savedNewsIds?.includes(selectedNews.id) ? 'bg-brand-600 text-white border-brand-600' : 'text-stone-500 hover:text-brand-600 border-stone-200 hover:border-brand-200'}`}
                        >
                            <Bookmark size={18} fill={user?.savedNewsIds?.includes(selectedNews.id) ? "currentColor" : "none"}/> 
                            {user?.savedNewsIds?.includes(selectedNews.id) ? t.saved_to_profile : t.save_to_profile}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const EventsView = () => {
  const { lang, events, user, toggleSavedEvent, setView } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleShare = async (item: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const title = lang === 'ar' ? item.title_ar : item.title_en;
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text: lang === 'ar' ? item.description_ar : item.description_en, url });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast(t.share_success);
    }
  };

  const handleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
        setView('login');
        return;
    }
    toggleSavedEvent(id);
    const isSaved = user.savedEventIds?.includes(id);
    showToast(isSaved ? 'Removed from saved' : t.saved_to_profile);
  };

  const filteredEvents = events.filter(item => {
    const term = searchTerm.toLowerCase();
    const title = (lang === 'ar' ? item.title_ar : item.title_en).toLowerCase();
    const location = (lang === 'ar' ? item.location_ar : item.location_en).toLowerCase();
    return title.includes(term) || location.includes(term);
  });

  return (
    <div className="min-h-screen bg-stone-50/50">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 rtl:left-4 rtl:right-auto z-[150] bg-stone-900 text-white px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <Check size={18} className="text-green-500" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Hero Header with Integrated Search */}
      <div className="bg-brand-900 text-white py-24 relative overflow-visible">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/pinstripe-light.png)'}}></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-brand-200 text-xs font-bold uppercase tracking-widest mb-4">Engage & Participate</span>
              <h1 className="text-4xl md:text-5xl font-black mb-6">{t.upcoming_events}</h1>
              <p className="text-brand-100/70 max-w-2xl mx-auto text-lg mb-12">Discover workshops, exhibitions, and corporate gatherings organized by Al-Shifa Mills.</p>
              
              {/* Floating Search Bar */}
              <div className="max-w-2xl mx-auto relative transform translate-y-8 z-20">
                <div className="bg-white rounded-full shadow-2xl p-2 flex items-center border border-stone-100">
                    <div className="pl-4 rtl:pr-4 rtl:pl-0 text-stone-400">
                        <Search size={24} />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.search_events_placeholder}
                        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-stone-800 text-lg font-medium placeholder:text-stone-300 w-full"
                    />
                    <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-bold transition duration-300 shadow-lg shadow-brand-600/20">
                        {t.search}
                    </button>
                </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16">
        {filteredEvents.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <Search size={64} className="mx-auto mb-4 text-stone-300"/>
                <p className="text-xl font-bold text-stone-400">No events found for "{searchTerm}"</p>
            </div>
        ) : (
            <div className="flex flex-col gap-10 max-w-5xl mx-auto">
            {filteredEvents.map(event => {
                const isSaved = user?.savedEventIds?.includes(event.id);
                return (
                    <div key={event.id} className="group bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                        <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                            <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                            
                            {/* Actions overlay on image for mobile */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <button 
                                    onClick={(e) => handleSave(event.id, e)}
                                    className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition duration-300 ${isSaved ? 'bg-brand-600 text-white' : 'bg-white/90 text-stone-500 hover:text-brand-600'}`}
                                >
                                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                                <button 
                                    onClick={(e) => handleShare(event, e)}
                                    className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-500 hover:text-brand-600 shadow-lg transition duration-300"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold mb-6">
                                <span className="flex items-center gap-1.5 text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-100">
                                    <Calendar size={16}/> {event.date}
                                </span>
                                <span className="flex items-center gap-1.5 text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
                                    <MapPin size={16}/> {lang === 'ar' ? event.location_ar : event.location_en}
                                </span>
                            </div>
                            <h4 className="text-3xl font-black text-stone-900 mb-4 group-hover:text-brand-600 transition leading-tight">{lang === 'ar' ? event.title_ar : event.title_en}</h4>
                            <p className="text-stone-500 leading-loose mb-8 text-lg">{lang === 'ar' ? event.description_ar : event.description_en}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <button className="bg-stone-900 text-white px-8 py-3 rounded-xl hover:bg-brand-600 transition text-sm font-bold shadow-lg shadow-stone-900/10">
                                    {t.read_more}
                                </button>
                                <div className="hidden md:flex items-center gap-2">
                                    <button 
                                        onClick={(e) => handleSave(event.id, e)}
                                        className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition ${isSaved ? 'text-brand-600 bg-brand-50' : 'text-stone-400 hover:text-brand-600 hover:bg-stone-50'}`}
                                    >
                                        <Bookmark size={18} fill={isSaved ? "currentColor" : "none"}/>
                                        {isSaved ? t.saved_to_profile : t.save_to_profile}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};

const CareersView = () => {
  const { lang, jobs, addJobApplication, addNotification } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [appSent, setAppSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', cvUrl: '' });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, cvUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleApply = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!selectedJob) return;
    
    const job = jobs.find(j => j.id === selectedJob);
    const newApp: JobApplication = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: selectedJob,
        jobTitle: lang === 'ar' ? job?.title_ar || '' : job?.title_en || '',
        applicantName: formData.name,
        applicantEmail: formData.email,
        cvUrl: formData.cvUrl,
        date: new Date().toISOString().split('T')[0],
        status: 'new',
        downloaded: false
    };

    addJobApplication(newApp);
    addNotification({
        id: Date.now().toString(),
        type: 'job',
        message: lang === 'ar' ? `طلب توظيف جديد من: ${formData.name}` : `New Job App from: ${formData.name}`,
        time: 'Just now',
        read: false
    });

    setAppSent(true); 
    
    setTimeout(() => { 
        setAppSent(false); 
        setSelectedJob(null); 
        setFormData({ name: '', email: '', cvUrl: '' });
        setFileName('');
    }, 3000); 
  };

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
        <div className="bg-stone-50 p-8 rounded-2xl h-fit border border-stone-100 sticky top-24 shadow-lg">
          {!selectedJob ? (<div className="text-center text-stone-400 py-12"><Briefcase size={48} className="mx-auto mb-4 opacity-30"/><p>{lang === 'ar' ? 'اختر وظيفة للتقديم عليها' : 'Select a job to apply'}</p></div>) : appSent ? (<div className="text-center text-green-600 py-12 animate-in fade-in zoom-in"><CheckCircle size={64} className="mx-auto mb-6"/><h4 className="text-xl font-bold">{t.app_success}</h4></div>) : (
             <form onSubmit={handleApply} className="space-y-4 animate-in fade-in">
               <h3 className="text-xl font-bold text-stone-900 mb-6 border-b pb-4 flex items-center gap-2"><Briefcase size={20} className="text-brand-600"/> {t.apply_now}: <span className="text-brand-600">{jobs.find(j => j.id === selectedJob)?.[lang === 'ar' ? 'title_ar' : 'title_en']}</span></h3>
               <div><label className="block text-sm font-bold text-stone-700 mb-1">{t.name}</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"/></div>
               <div><label className="block text-sm font-bold text-stone-700 mb-1">{t.email}</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"/></div>
               <div>
                   <label className="block text-sm font-bold text-stone-700 mb-1">{t.upload_cv}</label>
                   <div className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer group relative ${formData.cvUrl ? 'border-green-500 bg-green-50' : 'border-stone-300 hover:bg-white'}`}>
                       <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="absolute inset-0 opacity-0 cursor-pointer" />
                       {formData.cvUrl ? (
                           <div className="text-green-600 flex flex-col items-center gap-2">
                               <CheckCircle size={28}/>
                               <span className="font-bold text-sm">{fileName}</span>
                               <span className="text-xs">{t.cv_uploaded}</span>
                           </div>
                       ) : (
                           <div className="flex flex-col items-center">
                               <Upload size={24} className="mx-auto text-stone-400 group-hover:text-brand-500 mb-2"/>
                               <span className="text-xs text-stone-500 font-medium">Click to upload file</span>
                           </div>
                       )}
                   </div>
               </div>
               <button className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!formData.cvUrl}>{t.submit_app}</button>
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
        <div className="flex justify-between items-start mb-2"><span className="text-xs text-stone-400 uppercase font-semibold">{product.category}</span><span className="text-lg font-bold text-brand-600">{Number(product.price).toFixed(2)} {t.currency}</span></div>
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
                    <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{selectedProduct.category}</span><div className="flex text-brand-500">{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}</div><span className="text-stone-400 text-xs">(4.9/5)</span></div><span className="text-3xl font-bold text-brand-600">{Number(selectedProduct.price).toFixed(2)} <span className="text-lg text-stone-400">{t.currency}</span></span></div>
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 leading-tight">{lang === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}</h2>
                    <p className="text-stone-600 text-lg leading-relaxed mb-8 border-l-4 border-brand-500 pl-4 rtl:pl-0 rtl:border-l-0 rtl:border-r-4 rtl:pr-4">{lang === 'ar' ? selectedProduct.description_ar : selectedProduct.description_en}</p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-100"><Leaf size={20} className="mx-auto text-green-600 mb-2"/><p className="text-xs text-stone-500 font-bold uppercase">Natural</p><p className="font-bold text-stone-800">100%</p></div>
                        <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-100"><Wheat size={20} className="mx-auto text-brand-600 mb-2"/><p className="text-xs text-stone-500 font-bold uppercase">Gluten</p><p className="font-bold text-stone-800">Balanced</p></div>
                        <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-100"><Package size={20} className="mx-auto text-blue-600 mb-2"/><p className="text-xs text-stone-500 font-bold uppercase">Weight</p><p className="font-bold text-stone-800">{selectedProduct.weight}</p></div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100"><div className="flex items-center gap-4"><div className="flex items-center gap-3 bg-stone-100 rounded-xl p-2"><button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-brand-600 hover:scale-105 transition font-bold text-lg disabled:opacity-50" disabled={modalQty <= 1}><Minus size={18}/></button><span className="w-8 text-center font-bold text-xl text-stone-800">{modalQty}</span><button onClick={() => setModalQty(modalQty + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-stone-600 hover:text-brand-600 hover:scale-105 transition font-bold text-lg"><Plus size={18}/></button></div><button onClick={() => { addToCart(selectedProduct, modalQty); setSelectedProduct(null); }} className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/20 transition duration-300 flex items-center justify-center gap-3"><ShoppingCart size={20}/> {t.add_to_cart} - {(Number(selectedProduct.price) * modalQty).toFixed(2)} {t.currency}</button></div><p className="text-center text-xs text-stone-400 mt-4 flex items-center justify-center gap-1"><ShieldCheck size={12}/> {lang === 'ar' ? 'منتج أصلي ومضمون من مطاحن الشفاء' : 'Authentic & Guaranteed Product by Al-Shifa'}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CartView = () => {
  const { lang, cart, removeFromCart, updateQuantity, clearCart, setView, addOrder, addNotification } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [submitted, setSubmitted] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => { 
      e.preventDefault(); 
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          items: [...cart],
          total: cartTotal,
          customerName: formData.get('name') as string,
          customerEmail: formData.get('email') as string,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          location: 'Riyadh' // Mock location based on "user region"
      };

      addOrder(newOrder);
      addNotification({
          id: Date.now().toString(),
          type: 'order',
          message: lang === 'ar' ? `طلب جديد من ${newOrder.customerName} بقيمة ${newOrder.total} ر.س` : `New order from ${newOrder.customerName}: ${newOrder.total} SAR`,
          time: 'Just now',
          read: false
      });

      FirebaseService.submitOrder({ cart, date: new Date() }); 
      setSubmitted(true); 
      setTimeout(() => { clearCart(); setSubmitted(false); }, 3000); 
  };

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
                    <div className="flex-1 text-center sm:text-start"><div className="flex items-center gap-2 justify-center sm:justify-start mb-1"><span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase">{item.category}</span>{item.weight && <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">{item.weight}</span>}</div><h3 className="text-xl font-bold text-stone-800 mb-1">{lang === 'ar' ? item.name_ar : item.name_en}</h3><p className="text-sm text-brand-600 font-bold mb-1">{Number(item.price).toFixed(2)} {t.currency}</p></div>
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
                <div className="space-y-4 mb-8"><div className="flex justify-between text-stone-600"><span>{t.items_count}</span><span className="font-bold">{totalItems}</span></div><div className="flex justify-between text-stone-900 text-lg font-bold"><span>Total</span><span>{cartTotal.toFixed(2)} {t.currency}</span></div><div className="h-px bg-stone-200"></div></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-stone-500 uppercase">{t.name}</label><input name="name" required type="text" className="w-full bg-white border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition font-medium" placeholder="Ex: John Doe"/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-stone-500 uppercase">{t.email}</label><input name="email" required type="email" className="w-full bg-white border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition font-medium text-start" dir="ltr" placeholder="Ex: john@example.com"/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-stone-500 uppercase">{t.phone}</label><input name="phone" required type="tel" className="w-full bg-white border border-stone-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition font-medium text-start" dir="ltr" placeholder="+966..."/></div>
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
  const { 
    lang, products, setProducts, news, setNews, events, setEvents, jobs, setJobs, 
    usersList, setUsersList, messages, setMessages, pageSettings, setPageSettings, 
    jobApplications, markCVDownloaded, notifications, logout, orders, pageViews
  } = useContext(AppContext);
  const t = TRANSLATIONS[lang];
  const [tab, setTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [viewingApplicationsForJobId, setViewingApplicationsForJobId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- Real-time Stats Calculation ---
  // 1. Total Sales
  const totalSales = useMemo(() => orders.reduce((acc, order) => acc + order.total, 0), [orders]);
  
  // 2. Top Selling Products
  const topSelling = useMemo(() => {
      const productCounts: {[key: string]: {count: number, name: string}} = {};
      orders.forEach(order => {
          order.items.forEach(item => {
              const name = lang === 'ar' ? item.name_ar : item.name_en;
              if (!productCounts[name]) productCounts[name] = { count: 0, name: name };
              productCounts[name].count += item.quantity;
          });
      });
      return Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 3);
  }, [orders, lang]);

  // 3. Sales Distribution (Simulated by order size)
  const salesDistribution = useMemo(() => {
      const dist = { bakeries: 0, home: 0, export: 0 };
      orders.forEach(order => {
          if (order.total > 1000) dist.export++;
          else if (order.total > 200) dist.bakeries++;
          else dist.home++;
      });
      const total = orders.length || 1;
      return {
          bakeries: Math.round((dist.bakeries / total) * 100),
          home: Math.round((dist.home / total) * 100),
          export: Math.round((dist.export / total) * 100)
      };
  }, [orders]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  
  // Handlers for generic CRUD
  const handleEdit = (item: any) => { setEditingItem(item); setFormData({...item}); setIsModalOpen(true); };
  const handleAdd = () => { setEditingItem(null); setFormData({ imageUrl: '' }); setIsModalOpen(true); };
  const handleDelete = (id: string, list: any[], setter: any) => { if(confirm(t.delete + '?')) { setter(list.filter((i: any) => i.id !== id)); showToast(t.deleted_success); } };
  
  const handleSave = (e: React.FormEvent) => { 
    e.preventDefault(); 
    const newItem = { 
        ...formData, 
        id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
        ...(tab === 'jobs' && !editingItem ? { postedDate: new Date().toISOString().split('T')[0] } : {}),
        ...(tab === 'messages' && !editingItem ? { date: new Date().toISOString().split('T')[0], status: 'new' } : {})
    }; 
    
    if (tab === 'products' && newItem.price) {
        newItem.price = parseFloat(newItem.price);
    }
    
    if (tab === 'products') { if (editingItem) setProducts(products.map(p => p.id === newItem.id ? newItem : p)); else setProducts([...products, newItem]); } 
    else if (tab === 'news') { if (editingItem) setNews(news.map(n => n.id === newItem.id ? newItem : n)); else setNews([...news, newItem]); } 
    else if (tab === 'events') { if (editingItem) setEvents(events.map(ev => ev.id === newItem.id ? newItem : ev)); else setEvents([...events, newItem]); } 
    else if (tab === 'jobs') { if (editingItem) setJobs(jobs.map(j => j.id === newItem.id ? newItem : j)); else setJobs([...jobs, newItem]); }
    
    setIsModalOpen(false); 
    showToast(t.saved_success); 
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const file = e.target.files?.[0]; 
    if (file) { 
        const reader = new FileReader(); 
        reader.onloadend = () => { setFormData({ ...formData, imageUrl: reader.result as string }); }; 
        reader.readAsDataURL(file); 
    } 
  };

  const toggleUserBan = (id: string) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
    showToast(t.saved_success);
  };

  const togglePageVisibility = (page: string) => {
    setPageSettings({ ...pageSettings, [page]: !pageSettings[page] });
    showToast(t.saved_success);
  };

  const handleDownloadCV = (app: JobApplication) => {
      markCVDownloaded(app.id);
      const link = document.createElement('a');
      link.href = app.cvUrl;
      link.download = `CV_${app.applicantName.replace(/\s+/g, '_')}.pdf`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const stats = [
    { label: t.users_manage, value: usersList.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t.total_products, value: products.length, icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t.messages_manage, value: messages.length, icon: MessageCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: t.total_news, value: news.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const currentJobApplications = viewingApplicationsForJobId 
    ? jobApplications.filter(app => app.jobId === viewingApplicationsForJobId)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (<div className="fixed bottom-6 right-6 bg-stone-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-[110] flex items-center gap-3"><CheckCircle className="text-green-500" size={24} /><span className="font-bold">{toast}</span></div>)}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-72 bg-stone-900 text-white rounded-xl p-6 h-fit sticky top-24 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-2xl font-bold flex items-center gap-2"><Wheat size={28} className="text-brand-500"/> Panel</h3>
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-stone-800 rounded-full transition">
                        <Bell size={20} className={notifications.some(n => !n.read) ? 'text-brand-400 animate-pulse' : 'text-stone-400'}/>
                        {notifications.some(n => !n.read) && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-stone-900"></span>}
                    </button>
                    {showNotifications && (
                        <div className="absolute top-full left-0 rtl:right-auto rtl:left-full mt-2 w-72 bg-white text-stone-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-left border border-stone-100">
                            <div className="bg-stone-50 p-3 border-b border-stone-100 flex justify-between items-center"><span className="font-bold text-xs uppercase text-stone-500">{t.notifications}</span><span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{notifications.length}</span></div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? <p className="text-center py-4 text-sm text-stone-400">{t.no_notifications}</p> : (
                                    notifications.slice().reverse().map(n => (
                                        <div key={n.id} className="p-3 border-b border-stone-50 hover:bg-brand-50 transition flex items-start gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'order' ? 'bg-green-500' : n.type === 'job' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                            <div><p className="text-xs font-bold text-stone-800 leading-tight">{n.message}</p><p className="text-[10px] text-stone-400 mt-1">{n.time}</p></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <nav className="flex flex-col gap-1.5 flex-1">
                <button onClick={() => { setTab('dashboard'); setViewingApplicationsForJobId(null); }} className={`px-4 py-3 rounded-xl text-start font-medium transition flex items-center gap-3 ${tab === 'dashboard' ? 'bg-brand-600 text-white shadow-lg' : 'hover:bg-stone-800 text-stone-400'}`}><LayoutDashboard size={18}/> {t.dashboard_overview}</button>
                <div className="text-xs font-bold text-stone-500 uppercase mt-4 mb-2 px-4">Content</div>
                {['products', 'news', 'events', 'jobs'].map((item) => (
                    <button key={item} onClick={() => { setTab(item); setViewingApplicationsForJobId(null); }} className={`px-4 py-3 rounded-xl text-start font-medium transition capitalize flex items-center gap-3 ${tab === item ? 'bg-brand-600 text-white shadow-lg' : 'hover:bg-stone-800 text-stone-400'}`}>
                        {item === 'products' && <ShoppingCart size={18}/>}
                        {item === 'news' && <FileText size={18}/>}
                        {item === 'events' && <Calendar size={18}/>}
                        {item === 'jobs' && <Briefcase size={18}/>}
                        {item}
                    </button>
                ))}
                <div className="text-xs font-bold text-stone-500 uppercase mt-4 mb-2 px-4">Management</div>
                <button onClick={() => { setTab('users'); setViewingApplicationsForJobId(null); }} className={`px-4 py-3 rounded-xl text-start font-medium transition flex items-center gap-3 ${tab === 'users' ? 'bg-brand-600 text-white shadow-lg' : 'hover:bg-stone-800 text-stone-400'}`}><Users size={18}/> {t.users_manage}</button>
                <button onClick={() => { setTab('pages'); setViewingApplicationsForJobId(null); }} className={`px-4 py-3 rounded-xl text-start font-medium transition flex items-center gap-3 ${tab === 'pages' ? 'bg-brand-600 text-white shadow-lg' : 'hover:bg-stone-800 text-stone-400'}`}><Settings size={18}/> {t.pages_manage}</button>
                <button onClick={() => { setTab('messages'); setViewingApplicationsForJobId(null); }} className={`px-4 py-3 rounded-xl text-start font-medium transition flex items-center gap-3 ${tab === 'messages' ? 'bg-brand-600 text-white shadow-lg' : 'hover:bg-stone-800 text-stone-400'}`}><MessageCircle size={18}/> {t.messages_manage}</button>
                <div className="h-px bg-stone-800 my-4"></div>
                <button onClick={logout} className="px-4 py-3 rounded-xl text-start font-medium text-red-400 hover:bg-stone-800 flex items-center gap-3"><LogOut size={18}/> {t.logout}</button>
            </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 p-8 min-h-[600px]">
          
          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div className="animate-in fade-in">
                <div className="flex justify-between items-end mb-8">
                    <div><h2 className="text-3xl font-bold text-stone-800 flex items-center gap-3"><LayoutDashboard className="text-brand-600"/> {t.dashboard_overview}</h2><p className="text-stone-500 mt-1">{t.analytics_report}</p></div>
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold"><Activity size={18}/> {t.live_visitors}: {pageViews}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} p-6 rounded-2xl border border-transparent hover:border-stone-200 transition duration-300`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}><stat.icon size={24}/></div>
                                <span className="text-3xl font-bold text-stone-800">{stat.value}</span>
                            </div>
                            <h3 className="text-stone-500 font-bold text-sm uppercase tracking-wider">{stat.label}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Live Map */}
                    <div className="lg:col-span-2 bg-stone-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="font-bold text-lg flex items-center gap-2"><Globe className="text-brand-500"/> {t.live_map}</h3>
                            <span className="text-xs bg-brand-600 px-2 py-1 rounded animate-pulse">Live</span>
                        </div>
                        {/* CSS-only Map Representation */}
                        <div className="relative w-full h-64 bg-stone-800/50 rounded-xl flex items-center justify-center overflow-hidden border border-stone-700">
                            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                            {/* World Map SVG Silhouette */}
                            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-30 fill-stone-500"><path d="M842,168c1.8,-1.8 1.8,-3.6 2.7,-3.6c0.9,0 2.7,2.7 3.6,3.6c0.9,0.9 2.7,2.7 3.6,3.6c0.9,0.9 2.7,0.9 3.6,2.7c0.9,1.8 0.9,3.6 -0.9,4.5c-1.8,0.9 -1.8,2.7 -2.7,4.5c-0.9,1.8 -1.8,2.7 -3.6,3.6c-1.8,0.9 -3.6,0 -4.5,-1.8c-0.9,-1.8 -2.7,-2.7 -3.6,-4.5c-0.9,-1.8 -0.9,-3.6 0,-5.4c0.9,-1.8 0.9,-3.6 1.8,-7.2ZM195,168c1.8,-2.7 4.5,-2.7 6.3,-2.7c1.8,0 2.7,1.8 3.6,3.6c0.9,1.8 1.8,3.6 1.8,5.4c0,1.8 0,3.6 -0.9,5.4c-0.9,1.8 -2.7,2.7 -4.5,2.7c-1.8,0 -3.6,-1.8 -4.5,-3.6c-0.9,-1.8 -1.8,-2.7 -1.8,-5.4c0,-2.7 0,-4.5 0,-5.4ZM532,152c2.7,-2.7 5.4,-2.7 8.1,-2.7c2.7,0 3.6,2.7 4.5,5.4c0.9,2.7 1.8,5.4 1.8,7.2c0,1.8 -0.9,3.6 -2.7,5.4c-1.8,1.8 -3.6,2.7 -6.3,2.7c-2.7,0 -4.5,-1.8 -5.4,-4.5c-0.9,-2.7 -1.8,-3.6 -1.8,-6.3c0,-2.7 0,-4.5 1.8,-7.2ZM620,192c3.6,-1.8 7.2,-1.8 9.9,-0.9c2.7,0.9 4.5,3.6 5.4,6.3c0.9,2.7 0.9,5.4 0,8.1c-0.9,2.7 -2.7,4.5 -5.4,5.4c-2.7,0.9 -5.4,0.9 -8.1,-0.9c-2.7,-1.8 -4.5,-3.6 -5.4,-6.3c-0.9,-2.7 -0.9,-5.4 0.9,-8.1c1.8,-2.7 1.8,-3.6 2.7,-3.6Z" /></svg>
                            {/* Visualizing Latest Orders */}
                            {orders.slice(-5).map((order, i) => (
                                <div key={order.id} 
                                     className="absolute w-3 h-3 bg-brand-500 rounded-full animate-ping" 
                                     style={{
                                         top: i % 2 === 0 ? '40%' : '35%', 
                                         left: i % 2 === 0 ? '55%' : '52%', 
                                         animationDelay: `${i * 0.5}s`
                                     }} 
                                     title={`Order from ${order.customerName}`}></div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-stone-400 mt-4">
                            <span>Active Regions: Middle East, North Africa</span>
                            <span>Server Status: <span className="text-green-400">Online</span></span>
                        </div>
                    </div>

                    {/* Sales Charts */}
                    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                        <h3 className="font-bold text-lg mb-6 text-stone-800 flex items-center gap-2"><PieChart size={20} className="text-stone-400"/> {t.sales_distribution}</h3>
                        <div className="flex items-end justify-between h-40 gap-2 mb-4 px-2">
                            {/* Dynamic Bar Chart */}
                            <div className="w-full bg-brand-200 rounded-t-lg relative group transition-all duration-1000" style={{height: `${salesDistribution.bakeries || 5}%`}} title="Bakeries"><div className="absolute -top-6 w-full text-center text-xs font-bold text-brand-600">{salesDistribution.bakeries}%</div></div>
                            <div className="w-full bg-blue-200 rounded-t-lg relative group transition-all duration-1000" style={{height: `${salesDistribution.home || 5}%`}} title="Household"><div className="absolute -top-6 w-full text-center text-xs font-bold text-blue-600">{salesDistribution.home}%</div></div>
                            <div className="w-full bg-orange-200 rounded-t-lg relative group transition-all duration-1000" style={{height: `${salesDistribution.export || 5}%`}} title="Export"><div className="absolute -top-6 w-full text-center text-xs font-bold text-orange-600">{salesDistribution.export}%</div></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-stone-500 uppercase text-center">
                            <span className="w-full">Bakeries</span>
                            <span className="w-full">Home</span>
                            <span className="w-full">Export</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-stone-200">
                            <h4 className="text-xs font-bold text-stone-400 uppercase mb-2">{t.top_selling}</h4>
                            <div className="space-y-3">
                                {topSelling.length > 0 ? topSelling.map((p, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center text-sm font-bold mb-1"><span className="text-stone-700">{p.name}</span><span className="text-brand-600">{p.count} units</span></div>
                                        <div className="w-full bg-stone-200 h-1.5 rounded-full"><div className="bg-brand-500 h-1.5 rounded-full" style={{width: `${Math.min(100, (p.count / (topSelling[0].count || 1)) * 100)}%`}}></div></div>
                                    </div>
                                )) : <p className="text-xs text-stone-400 italic">No sales data yet</p>}
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-xs font-bold text-stone-500">Total Revenue: </span>
                                <span className="text-lg font-bold text-brand-600">{totalSales.toFixed(2)} {t.currency}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* Generic List (Products, News, Events, Jobs) */}
          {['products', 'news', 'events', 'jobs'].includes(tab) && (
            <div className="animate-in fade-in">
                {viewingApplicationsForJobId ? (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={() => setViewingApplicationsForJobId(null)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-500"><ChevronLeft size={24} className="rtl:rotate-180"/></button>
                            <h2 className="text-2xl font-bold text-stone-800">{t.view_applications}: <span className="text-brand-600">{jobs.find(j => j.id === viewingApplicationsForJobId)?.title_en}</span></h2>
                        </div>
                        {currentJobApplications.length === 0 ? (
                            <div className="text-center py-20 bg-stone-50 rounded-xl border border-stone-100">
                                <FileText size={48} className="mx-auto text-stone-300 mb-4"/>
                                <p className="text-stone-500 font-medium">{t.no_applications}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-stone-200">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                                        <tr><th className="p-4">{t.applicant_name}</th><th className="p-4">{t.email}</th><th className="p-4">{t.application_date}</th><th className="p-4 text-end">{t.actions}</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 text-sm">
                                        {currentJobApplications.map(app => (
                                            <tr key={app.id} className={`transition ${app.downloaded ? 'bg-stone-50/50' : 'hover:bg-stone-50'}`}>
                                                <td className="p-4 font-bold text-stone-700 flex items-center gap-2">
                                                    {app.applicantName}
                                                    {app.downloaded && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal border border-green-200 flex items-center gap-1"><CheckCircle size={10}/> {t.cv_downloaded_badge}</span>}
                                                </td>
                                                <td className="p-4 text-stone-600">{app.applicantEmail}</td>
                                                <td className="p-4 text-stone-500">{app.date}</td>
                                                <td className="p-4 text-end">
                                                    <button onClick={() => handleDownloadCV(app)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition border ${app.downloaded ? 'bg-white border-stone-200 text-stone-500' : 'bg-brand-50 border-brand-100 text-brand-700 hover:bg-brand-100'}`}>
                                                        <Download size={14}/> {t.download_cv}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-stone-800 capitalize">{tab} Management</h2>
                        <button onClick={handleAdd} className="bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition flex items-center gap-2 text-sm font-bold"><Plus size={16}/> {t.add_new}</button>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-stone-200">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                                <tr><th className="p-4">ID</th><th className="p-4">Title/Name</th><th className="p-4">Status</th><th className="p-4 text-end">{t.actions}</th></tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {(tab === 'products' ? products : tab === 'news' ? news : tab === 'events' ? events : jobs).map((item: any) => (
                                    <tr key={item.id} className="hover:bg-stone-50/50 transition">
                                        <td className="p-4 font-mono text-stone-400">#{item.id}</td>
                                        <td className="p-4 font-bold text-stone-700 flex items-center gap-3">
                                            {item.imageUrl && <img src={item.imageUrl} className="w-8 h-8 rounded object-cover border border-stone-200" alt="" />}
                                            {lang === 'ar' ? (item.name_ar || item.title_ar) : (item.name_en || item.title_en)}
                                        </td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{t.active}</span></td>
                                        <td className="p-4 text-end flex justify-end gap-2">
                                            {tab === 'jobs' && (
                                                <button onClick={() => setViewingApplicationsForJobId(item.id)} className="px-3 py-1.5 bg-stone-100 hover:bg-brand-100 text-stone-600 hover:text-brand-700 rounded-lg text-xs font-bold transition flex items-center gap-1 relative">
                                                    <FileText size={14}/> {t.view_applications}
                                                    {jobApplications.filter(app => app.jobId === item.id && !app.downloaded).length > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                                                    )}
                                                </button>
                                            )}
                                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete(item.id, (tab === 'products' ? products : tab === 'news' ? news : tab === 'events' ? events : jobs), (tab === 'products' ? setProducts : tab === 'news' ? setNews : tab === 'events' ? setEvents : setJobs))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                )}
            </div>
          )}

          {/* Users Management */}
          {tab === 'users' && (
            <div className="animate-in fade-in">
                <h2 className="text-2xl font-bold text-stone-800 mb-6">{t.users_manage}</h2>
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider">
                            <tr><th className="p-4">{t.name}</th><th className="p-4">{t.email}</th><th className="p-4">{t.role}</th><th className="p-4">{t.status}</th><th className="p-4">{t.join_date}</th><th className="p-4 text-end">{t.actions}</th></tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-sm">
                            {usersList.map(u => (
                                <tr key={u.id} className="hover:bg-stone-50/50">
                                    <td className="p-4 font-bold text-stone-800">{u.name}</td>
                                    <td className="p-4 text-stone-600">{u.email}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'}`}>{u.role}</span></td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status === 'active' ? t.active : t.banned}</span></td>
                                    <td className="p-4 text-stone-500">{u.joinDate}</td>
                                    <td className="p-4 text-end flex justify-end gap-2">
                                        <button onClick={() => setViewingUser(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title={t.history}><History size={16}/></button>
                                        {u.role !== 'admin' && (
                                            <button onClick={() => toggleUserBan(u.id)} className={`p-2 rounded-lg ${u.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`} title={u.status === 'active' ? t.ban : t.unban}>
                                                <Ban size={16}/>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* Page Settings */}
          {tab === 'pages' && (
            <div className="animate-in fade-in">
                 <h2 className="text-2xl font-bold text-stone-800 mb-6">{t.pages_manage}</h2>
                 <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(pageSettings).map(([page, isVisible]) => (
                            <div key={page} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isVisible ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-400'}`}><FileBox size={20}/></div>
                                    <span className="font-bold text-stone-700 capitalize">{page} Page</span>
                                </div>
                                <button onClick={() => togglePageVisibility(page)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVisible ? 'bg-brand-600' : 'bg-stone-300'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isVisible ? 'translate-x-6' : 'translate-x-1'}`}/>
                                </button>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
          )}

          {/* Messages */}
          {tab === 'messages' && (
             <div className="animate-in fade-in">
                <h2 className="text-2xl font-bold text-stone-800 mb-6">{t.messages_manage}</h2>
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`p-6 rounded-xl border ${msg.status === 'new' ? 'bg-blue-50 border-blue-100' : 'bg-white border-stone-200'} transition`}>
                            <div className="flex justify-between items-start mb-2">
                                <div><h4 className="font-bold text-stone-900">{msg.name}</h4><span className="text-xs text-stone-500">{msg.email}</span></div>
                                <span className="text-xs font-bold text-stone-400">{msg.date}</span>
                            </div>
                            <p className="text-stone-700 text-sm mb-4 bg-white/50 p-3 rounded-lg border border-stone-100/50">{msg.message}</p>
                            <div className="flex gap-2">
                                <a href={`mailto:${msg.email}`} className="bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-stone-700 flex items-center gap-2"><Send size={12}/> Reply</a>
                                {msg.status === 'new' && <button onClick={() => { setMessages(messages.map(m => m.id === msg.id ? {...m, status: 'read'} : m)); showToast(t.saved_success); }} className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-brand-200">Mark as Read</button>}
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && <div className="text-center py-12 text-stone-400">No messages found</div>}
                </div>
             </div>
          )}

        </div>
      </div>

      {/* Edit/Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `${t.edit} ${tab}` : `${t.add_new} ${tab}`}>
        <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-stone-500 uppercase">Title (AR)</label><input name={tab === 'products' ? 'name_ar' : 'title_ar'} value={formData.name_ar || formData.title_ar || ''} onChange={handleChange} className="w-full border border-stone-300 p-2.5 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-brand-500"/></div>
                <div><label className="text-xs font-bold text-stone-500 uppercase">Title (EN)</label><input name={tab === 'products' ? 'name_en' : 'title_en'} value={formData.name_en || formData.title_en || ''} onChange={handleChange} className="w-full border border-stone-300 p-2.5 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-brand-500"/></div>
            </div>
            {tab === 'products' && (
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-stone-500 uppercase">Price</label><input type="number" name="price" value={formData.price || ''} onChange={handleChange} className="w-full border border-stone-300 p-2.5 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-brand-500"/></div>
                    <div><label className="text-xs font-bold text-stone-500 uppercase">Weight</label><input type="text" name="weight" value={formData.weight || ''} onChange={handleChange} className="w-full border border-stone-300 p-2.5 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-brand-500"/></div>
                </div>
            )}
            <div>
                <label className="text-xs font-bold text-stone-500 uppercase">Image</label>
                <div className="mt-1 flex items-center gap-4">
                    {formData.imageUrl && <img src={formData.imageUrl} className="w-16 h-16 rounded-lg object-cover border border-stone-200" alt="Preview"/>}
                    <div className="flex-1 border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:bg-stone-50 cursor-pointer relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                        <span className="text-xs text-stone-500 flex items-center justify-center gap-1"><Upload size={14}/> Upload Image</span>
                    </div>
                </div>
                <div className="mt-2 text-center text-xs text-stone-400 font-bold uppercase">- {t.or_url} -</div>
                <input type="text" name="imageUrl" placeholder="https://example.com/image.jpg" value={formData.imageUrl || ''} onChange={handleChange} className="w-full border border-stone-300 p-2.5 rounded-lg mt-2 text-sm"/>
            </div>
            <button className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-brand-600 transition shadow-lg">{t.save}</button>
        </form>
      </Modal>

      {/* User History Modal */}
      <Modal isOpen={!!viewingUser} onClose={() => setViewingUser(null)} title={`${t.history}: ${viewingUser?.name}`}>
        <div className="space-y-4">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex justify-between">
                <div><p className="text-xs font-bold text-stone-500">Email</p><p className="font-bold">{viewingUser?.email}</p></div>
                <div><p className="text-xs font-bold text-stone-500">Phone</p><p className="font-bold dir-ltr">{viewingUser?.phone}</p></div>
                <div><p className="text-xs font-bold text-stone-500">Join Date</p><p className="font-bold">{viewingUser?.joinDate}</p></div>
            </div>
            <h4 className="font-bold text-stone-800 border-b pb-2">Orders</h4>
            {viewingUser?.ordersCount === 0 ? <p className="text-stone-400 italic text-center py-4">{t.no_orders}</p> : (
                <div className="space-y-2">
                    <div className="p-3 border rounded-lg flex justify-between items-center bg-white"><span className="font-mono text-stone-500">#ORD-001</span><span className="text-sm font-bold">120.00 SAR</span><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Completed</span></div>
                    <div className="p-3 border rounded-lg flex justify-between items-center bg-white"><span className="font-mono text-stone-500">#ORD-005</span><span className="text-sm font-bold">450.00 SAR</span><span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Processing</span></div>
                </div>
            )}
        </div>
      </Modal>
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
                 <div className="space-y-1.5"><div className="flex justify-between items-center"><label className="text-xs font-bold text-stone-600 ml-1">{t.password}</label>{authMode === 'login' && <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700">{t.forgot_password}</a>}</div><div className="relative"><Lock size={18} className="absolute top-3.5 left-3.5 text-stone-400 pointer-events-none rtl:right-3.5 rtl:left-auto"/><input type="text" required value={pass} onChange={e => {setPass(e.target.value); setError('');}} className="w-full pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition font-medium" placeholder="••••••••" dir="ltr"/><button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 text-stone-400 hover:text-stone-600 transition">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
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
    <footer className="bg-brand-950 text-brand-50 pt-20 pb-8 mt-12 border-t border-brand-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                   <img src="/assets/alshifa flour mills logo green circle.png" className="w-full h-full object-cover p-0.5" />
                </div>
                <span className="text-2xl font-bold">{t.brand}</span>
            </div>
            <p className="text-brand-200/80 leading-relaxed text-sm font-medium">{t.footer_desc}</p>
            <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <a href="#" className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center hover:bg-brand-600 hover:scale-110 transition duration-300 shadow-sm border border-brand-700"><Facebook size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center hover:bg-brand-600 hover:scale-110 transition duration-300 shadow-sm border border-brand-700"><Instagram size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center hover:bg-brand-600 hover:scale-110 transition duration-300 shadow-sm border border-brand-700"><Twitter size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center hover:bg-brand-600 hover:scale-110 transition duration-300 shadow-sm border border-brand-700"><Video size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center hover:bg-brand-600 hover:scale-110 transition duration-300 shadow-sm border border-brand-700"><MessageCircle size={16}/></a>
                    <a href="#" className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center hover:bg-brand-600 hover:scale-110 transition duration-300 shadow-sm border border-brand-700"><Send size={16}/></a>
                </div>
                <a href="#" className="text-brand-400 font-bold hover:underline text-sm dir-ltr text-left">@alshifaflourmills</a>
            </div>
          </div>
          <div><h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4><ul className="space-y-4"><li><button onClick={() => setView('home')} className="hover:text-brand-300 font-medium transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_home}</button></li><li><button onClick={() => setView('products')} className="hover:text-brand-300 font-medium transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_products}</button></li><li><button onClick={() => setView('about')} className="hover:text-brand-300 font-medium transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_about}</button></li><li><button onClick={() => setView('careers')} className="hover:text-brand-300 font-medium transition flex items-center gap-2"><ChevronRight size={14}/> {t.nav_careers}</button></li></ul></div>
          <div><h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}</h4><ul className="space-y-4 text-sm font-medium text-brand-100"><li className="flex items-start gap-3"><MapPin size={20} className="text-brand-500 mt-1 shrink-0"/> <span>Industrial City, Phase 3,<br/>Riyadh, Saudi Arabia</span></li><li className="flex items-center gap-3"><Phone size={20} className="text-brand-500 shrink-0"/> <span dir="ltr">+966 12 345 6789</span></li><li className="flex items-center gap-3"><Mail size={20} className="text-brand-500 shrink-0"/> <span>info@alshifa.com</span></li></ul></div>
          <div><h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">{t.subscribe}</h4><p className="text-xs mb-4 font-medium text-brand-200">{lang === 'ar' ? 'اشترك في قائمتنا البريدية للحصول على آخر الأخبار والعروض.' : 'Subscribe to our newsletter for latest news and offers.'}</p><div className="flex flex-col gap-2"><input type="email" placeholder={t.email} className="bg-brand-900/50 border border-brand-800 text-white placeholder:text-brand-500 p-3 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none text-sm" /><button className="bg-brand-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-brand-500 transition">{t.subscribe_btn}</button></div></div>
        </div>
        <div className="border-t border-brand-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-400 font-medium gap-4"><p>{t.copyright} &copy; {new Date().getFullYear()}</p><div className="flex items-center gap-1 bg-brand-900/50 px-4 py-2 rounded-full border border-brand-800"><span>{t.designed_by}</span><a href="#" className="text-brand-300 font-bold hover:text-white transition ml-1">7Dvro</a><span className="text-brand-500">for IT Solutions</span></div></div>
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
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings>({});
  
  // New State for Job Applications & Notifications & Orders & PageViews
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageViews, setPageViews] = useState<number>(0);
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);

  // Track Page Views
  useEffect(() => {
      if (isLoaded) {
          setPageViews(prev => prev + 1);
      }
  }, [view, isLoaded]);

  useEffect(() => {
    const loadData = async () => {
      const storedProducts = localStorage.getItem('afm_products');
      const storedNews = localStorage.getItem('afm_news');
      const storedEvents = localStorage.getItem('afm_events');
      const storedJobs = localStorage.getItem('afm_jobs');
      const storedUsers = localStorage.getItem('afm_users');
      const storedMessages = localStorage.getItem('afm_messages');
      const storedSettings = localStorage.getItem('afm_settings');
      const storedApplications = localStorage.getItem('afm_applications');
      const storedNotifications = localStorage.getItem('afm_notifications');
      const storedOrders = localStorage.getItem('afm_orders');
      const storedPageViews = localStorage.getItem('afm_pageviews');

      if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          parsedProducts.forEach((p: any) => { if(p.price) p.price = Number(p.price); });
          setProducts(parsedProducts);
      } else {
          setProducts(await FirebaseService.getProducts());
      }

      if (storedNews) setNews(JSON.parse(storedNews)); else setNews(await FirebaseService.getNews());
      if (storedEvents) setEvents(JSON.parse(storedEvents)); else setEvents(await FirebaseService.getEvents());
      if (storedJobs) setJobs(JSON.parse(storedJobs)); else setJobs(await FirebaseService.getJobs());
      
      if (storedUsers) setUsersList(JSON.parse(storedUsers)); else setUsersList(INITIAL_USERS);
      if (storedMessages) setMessages(JSON.parse(storedMessages)); else setMessages(INITIAL_MESSAGES);
      if (storedSettings) setPageSettings(JSON.parse(storedSettings)); else setPageSettings(INITIAL_PAGE_SETTINGS);
      if (storedApplications) setJobApplications(JSON.parse(storedApplications));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedOrders) setOrders(JSON.parse(storedOrders)); else setOrders(INITIAL_ORDERS);
      if (storedPageViews) setPageViews(Number(storedPageViews)); else setPageViews(1240); // Start with a base number

      setIsLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => { if (isLoaded) localStorage.setItem('afm_products', JSON.stringify(products)); }, [products, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_news', JSON.stringify(news)); }, [news, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_events', JSON.stringify(events)); }, [events, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_jobs', JSON.stringify(jobs)); }, [jobs, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_users', JSON.stringify(usersList)); }, [usersList, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_messages', JSON.stringify(messages)); }, [messages, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_settings', JSON.stringify(pageSettings)); }, [pageSettings, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_applications', JSON.stringify(jobApplications)); }, [jobApplications, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_notifications', JSON.stringify(notifications)); }, [notifications, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_orders', JSON.stringify(orders)); }, [orders, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('afm_pageviews', pageViews.toString()); }, [pageViews, isLoaded]);

  const addToCart = (p: Product, quantity: number = 1) => { setCart(prev => { const existing = prev.find(item => item.id === p.id); if (existing) { return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + quantity } : item); } return [...prev, { ...p, quantity }]; }); alert(lang === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart'); };
  const updateQuantity = (id: string, delta: number) => { setCart(prev => prev.map(item => { if (item.id === id) { const newQty = Math.max(1, item.quantity + delta); return { ...item, quantity: newQty }; } return item; })); };
  const removeFromCart = (id: string) => { setCart(cart.filter(c => c.id !== id)); };
  const clearCart = () => setCart([]);
  const login = (role: string) => { setUser({ name: 'Admin User', role, email: 'mohemadmuzamil@gmail.com', savedNewsIds: [], savedEventIds: [] }); setView('admin'); };
  const logout = () => { setUser(null); setView('home'); };
  
  const addJobApplication = (app: JobApplication) => { setJobApplications(prev => [...prev, app]); };
  const markCVDownloaded = (appId: string) => { setJobApplications(prev => prev.map(app => app.id === appId ? { ...app, downloaded: true } : app)); };
  
  const addNotification = (note: NotificationItem) => { setNotifications(prev => [note, ...prev]); };
  const clearNotifications = () => { setNotifications([]); };
  
  const addOrder = (order: Order) => { setOrders(prev => [order, ...prev]); };

  const setTheme = (themeName: ThemeName) => {
    const theme = THEMES[themeName];
    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value as string);
    });
  };

  const toggleSavedNews = (id: string) => {
      if (!user) return;
      const currentSaved = user.savedNewsIds || [];
      let newSaved;
      if (currentSaved.includes(id)) {
          newSaved = currentSaved.filter((sid: string) => sid !== id);
      } else {
          newSaved = [...currentSaved, id];
      }
      const updatedUser = { ...user, savedNewsIds: newSaved };
      setUser(updatedUser);
      setUsersList(usersList.map(u => u.email === user.email ? { ...u, savedNewsIds: newSaved } : u));
  };

  const toggleSavedEvent = (id: string) => {
      if (!user) return;
      const currentSaved = user.savedEventIds || [];
      let newSaved;
      if (currentSaved.includes(id)) {
          newSaved = currentSaved.filter((sid: string) => sid !== id);
      } else {
          newSaved = [...currentSaved, id];
      }
      const updatedUser = { ...user, savedEventIds: newSaved };
      setUser(updatedUser);
      setUsersList(usersList.map(u => u.email === user.email ? { ...u, savedEventIds: newSaved } : u));
  };

  const contextValue = { 
    lang, setLang, view, setView, cart, addToCart, updateQuantity, removeFromCart, clearCart, user, login, logout, 
    products, setProducts, news, setNews, events, setEvents, jobs, setJobs, setTheme,
    usersList, setUsersList, messages, setMessages, pageSettings, setPageSettings,
    jobApplications, addJobApplication, markCVDownloaded,
    notifications, addNotification, clearNotifications,
    orders, addOrder, pageViews,
    toggleSavedNews, toggleSavedEvent
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-brand-500 selection:text-white">
        <Header />
        <main className="flex-1">
          {view === 'home' && (<><Hero /><StatsSection /><ProductList /><div className="bg-stone-50 py-20 border-t border-stone-100"><div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center"><div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300"><div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><CheckCircle size={40}/></div><h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'جودة مضمونة' : 'Quality Guaranteed'}</h3><p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'نستخدم أفضل أنواع القمح لضمان جودة منتجاتنا وفق أعلى المعايير.' : 'We use the best wheat types to ensure product quality per highest standards.'}</p></div><div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300"><div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><MapPin size={40}/></div><h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'تغطية واسعة' : 'Wide Coverage'}</h3><p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'أسطول توزيع متكامل يغطي جميع أنحاء المملكة لضمان الوصول السريع.' : 'Integrated distribution fleet covering the kingdom for fast delivery.'}</p></div><div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:-translate-y-2 transition duration-300"><div className="bg-brand-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner"><Phone size={40}/></div><h3 className="text-xl font-bold mb-3 text-stone-800">{lang === 'ar' ? 'دعم مستمر' : '24/7 Support'}</h3><p className="text-stone-500 leading-relaxed">{lang === 'ar' ? 'فريق خدمة العملاء جاهز لخدمتكم والإجابة على استفساراتكم.' : 'Customer service team ready to serve you and answer your queries.'}</p></div></div></div></>)}
          {view === 'products' && pageSettings.products !== false && <ProductList />}
          {view === 'news' && pageSettings.news !== false && <NewsView />}
          {view === 'events' && pageSettings.events !== false && <EventsView />}
          {view === 'careers' && pageSettings.careers !== false && <CareersView />}
          {view === 'about' && pageSettings.about !== false && (<div className="container mx-auto px-4 py-16 max-w-4xl"><div className="bg-white p-10 rounded-2xl shadow-lg border border-stone-100"><div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-100"><div className="bg-brand-600 text-white p-4 rounded-2xl shadow-lg shadow-brand-600/30"><Wheat size={48}/></div><div><h2 className="text-4xl font-bold text-stone-900">{TRANSLATIONS[lang].nav_about}</h2><span className="text-brand-600 font-bold tracking-widest uppercase text-sm">Since 1985</span></div></div><div className="prose max-w-none text-stone-600 leading-loose text-lg"><p className="mb-6 font-medium text-stone-800">{TRANSLATIONS[lang].footer_desc}</p><p>{lang === 'ar' ? 'تأسست مطاحن الشفاء برؤية تهدف إلى تعزيز الأمن الغذائي وتقديم منتجات عالية الجودة. نحن نستخدم أحدث التقنيات الألمانية في الطحن والغربلة لضمان استخراج أنقى أنواع الدقيق.' : 'Al-Shifa Mills was founded with a vision to enhance food security and provide high-quality products. We use the latest German technology in milling and sifting to ensure the extraction of the purest flour.'}</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"><div className="bg-stone-50 p-6 rounded-xl border border-stone-200"><h4 className="font-bold text-stone-900 mb-2">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h4><p className="text-sm">To be the leading provider of grain products in the Middle East.</p></div><div className="bg-stone-50 p-6 rounded-xl border border-stone-200"><h4 className="font-bold text-stone-900 mb-2">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h4><p className="text-sm">Delivering healthy, high-quality nutrition to every home.</p></div></div></div></div></div>)}
          
          {view === 'cart' && <CartView />}
          {view === 'login' && <Login />}
          {view === 'admin' && (user ? <AdminPanel /> : <Login />)}
          {view === 'contact' && pageSettings.contact !== false && (
             <div className="container mx-auto px-4 py-16">
                 <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-stone-100">
                     <div className="text-center mb-10">
                         <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600"><Mail size={32}/></div>
                         <h2 className="text-3xl font-bold text-stone-800">{TRANSLATIONS[lang].contact_us_title}</h2>
                         <p className="text-stone-500 mt-2">We'd love to hear from you</p>
                     </div>
                     <form className="space-y-6" onSubmit={(e) => {
                         e.preventDefault(); 
                         const form = e.target as HTMLFormElement;
                         const formData = new FormData(form);
                         const newMsg = {
                             id: Math.random().toString(36).substr(2, 9),
                             name: formData.get('name') as string,
                             email: formData.get('email') as string,
                             message: formData.get('message') as string,
                             date: new Date().toISOString().split('T')[0],
                             status: 'new' as const
                         };
                         setMessages([...messages, newMsg]);
                         addNotification({
                             id: Date.now().toString(),
                             type: 'comment',
                             message: lang === 'ar' ? `رسالة جديدة من: ${newMsg.name}` : `New message from: ${newMsg.name}`,
                             time: 'Just now',
                             read: false
                         });
                         alert(lang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully');
                         form.reset();
                     }}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div><label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].name}</label><input name="name" required type="text" className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" /></div>
                             <div><label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].email}</label><input name="email" required type="email" className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" /></div>
                         </div>
                         <div><label className="block text-sm font-bold text-stone-600 mb-2">{TRANSLATIONS[lang].message}</label><textarea name="message" required rows={5} className="w-full border border-stone-300 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"></textarea></div>
                         <button className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg">{TRANSLATIONS[lang].send}</button>
                     </form>
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
