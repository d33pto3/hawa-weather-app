import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          title: "HAWA",
          subtitle: "Weather Report",
          style_label: "International Typographic Style",
          current: "Current",
          apparent: "Apparent",
          feels_like: "Feels like temperature",
          info: "Info",
          precision: "Precision Dashboard",
          zilla: "Zilla",
          map: "Map",
          select_region: "Select Region",
          search_location: "SEARCH ANYWHERE...",
          humidity: "Humidity",
          cloudy: "Cloudy",
          wind: "Wind",
          max: "Max",
          min: "Min",
          hourly: "Hourly Forecast",
          theme: "Theme",
          loading: "Waiting for location choice...",
        }
      },
      bn: {
        translation: {
          title: "হাওয়া",
          subtitle: "আবহাওয়ার খবর",
          style_label: "সুইস গ্রাফিক ডিজাইন",
          current: "বর্তমান",
          apparent: "অনুভূত",
          feels_like: "অনুভূত তাপমাত্রা",
          info: "তথ্য",
          precision: "প্রিসিশন ড্যাশবোর্ড",
          zilla: "জেলা",
          map: "মানচিত্র",
          select_region: "জেলা নির্বাচন করুন",
          search_location: "যেকোনো জায়গা খুঁজুন...",
          humidity: "আর্দ্রতা",
          cloudy: "মেঘলা",
          wind: "বাতাস",
          max: "সর্বোচ্চ",
          min: "সর্বনিম্ন",
          hourly: "ঘণ্টা পর পর সংবাদ",
          theme: "থিম",
          loading: "অবস্থান বেছে নেওয়ার জন্য অপেক্ষা করা হচ্ছে...",
        }
      }
    }
  });

export default i18n;
