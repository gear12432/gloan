export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'EN', name: 'English', nativeName: 'English (US/IN)' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'BN', name: 'Bengali', nativeName: 'বাংলা' },
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  EN: {
    dashboard: 'Dashboard',
    createNewCustomer: 'Create New Customer',
    addNow: 'Add Now',
    pending: 'Pending',
    successful: 'Successful',
    all: 'All',
    searchPlaceholder: 'Search by ID, name or mobile number',
    noRecords: 'No customer records found',
    settings: 'Settings',
    language: 'Language',
    loanInterestSettings: 'Loan Interest Settings',
    defaultInterestRate: 'Default Interest Rate',
    themeSettings: 'Theme Settings',
    businessProfile: 'Business Profile',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    signOut: 'Sign Out of Account',
    profileAndSettings: 'Profile & Settings',
    editProfile: 'Edit Profile',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    lightThemeActive: 'Light Theme Active',
    darkThemeActive: 'Dark Theme Active',
    aboutApp: 'About App',
    helpSupport: 'Help & Support',
  },
  HI: {
    dashboard: 'डैशबोर्ड',
    createNewCustomer: 'नया ग्राहक जोड़ें',
    addNow: 'अभी जोड़ें',
    pending: 'पेंडिंग',
    successful: 'सफल',
    all: 'सभी',
    searchPlaceholder: 'ID, नाम या मोबाइल नंबर से खोजें',
    noRecords: 'कोई ग्राहक रिकॉर्ड नहीं मिला',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    loanInterestSettings: 'लोन ब्याज सेटिंग्स',
    defaultInterestRate: 'डिफ़ॉल्ट ब्याज दर',
    themeSettings: 'थीम सेटिंग्स',
    businessProfile: 'बिजनेस प्रोफाइल',
    privacyPolicy: 'प्राइवेसी पॉलिसी',
    termsConditions: 'नियम और शर्तें',
    signOut: 'खाते से लॉगआउट करें',
    profileAndSettings: 'प्रोफाइल और सेटिंग्स',
    editProfile: 'प्रोफाइल संपादित करें',
    lightTheme: 'लाइट थीम',
    darkTheme: 'डार्क थीम',
    lightThemeActive: 'लाइट थीम सक्रिय है',
    darkThemeActive: 'डार्क थीम सक्रिय है',
    aboutApp: 'ऐप के बारे में',
    helpSupport: 'सहायता और समर्थन',
  },
  BN: {
    dashboard: 'ড্যাশবোর্ড',
    createNewCustomer: 'নতুন গ্রাহক যোগ করুন',
    addNow: 'এখন যোগ করুন',
    pending: 'পেন্ডিং',
    successful: 'সফল',
    all: 'সমস্ত',
    searchPlaceholder: 'আইডি, নাম বা মোবাইল নম্বর দিয়ে খুঁজুন',
    noRecords: 'কোন গ্রাহক রেকর্ড পাওয়া যায়নি',
    settings: 'সেটিংস',
    language: 'ভাষা',
    loanInterestSettings: 'ঋণের সুদের হার',
    defaultInterestRate: 'ডিফল্ট সুদের হার',
    themeSettings: 'থিম সেটিংস',
    businessProfile: 'ব্যবসায়িক প্রোফাইল',
    privacyPolicy: 'গোপনীয়তা নীতি',
    termsConditions: 'শর্তাবলী',
    signOut: 'লগআউট করুন',
    profileAndSettings: 'প্রোফাইল এবং সেটিংস',
    editProfile: 'প্রোফাইল সম্পাদনা',
    lightTheme: 'লাইট থিম',
    darkTheme: 'ডার্ক থিম',
    lightThemeActive: 'লাইট থিম সক্রিয়',
    darkThemeActive: 'ডার্ক থিম সক্রিয়',
    aboutApp: 'অ্যাপ সম্পর্কে',
    helpSupport: 'সাহায্য এবং সমর্থন',
  },
};

export function getTranslation(langCode: string, key: string, fallback?: string): string {
  const code = (langCode || 'EN').toUpperCase();
  if (TRANSLATIONS[code] && TRANSLATIONS[code][key]) {
    return TRANSLATIONS[code][key];
  }
  if (TRANSLATIONS['EN'] && TRANSLATIONS['EN'][key]) {
    return TRANSLATIONS['EN'][key];
  }
  return fallback || key;
}
