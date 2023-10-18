// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        'Log in' : 'Log in',
        'Log out' : 'Log out',
        'Upload' : 'Upload',
        'LIVE Creator Hub' : 'LIVE Creator Hub',
        'Feedback and help' : 'Feedback and help',
        'Keyboard shortcuts' : 'Keyboard shortcuts',
        'Dark mode' : 'Dark mode',
        'Language' : 'Language',
        'TikTok desktop app' : 'TikTok desktop app',
        'Download' : 'Download',
        'Download mobile app instead' : 'Download mobile app instead',
        'Messages' : 'Messages',
        'Inbox' : 'Inbox',
        'For You' : 'For You',
        'Following' : 'Following',
        'Explore' : 'Explore',
        'Are you sure you want to log out?' : 'Are you sure you want to log out?',
        'See more' : 'See more',
        'See less' : 'See less',
        'Follow' : 'Follow',
        'Post' : 'Post',
        'Comments' : 'Comments',
      },
    },
    vi: {
      translation: {
        'Log in' : 'Đăng Nhập',
        'Log out' : 'Đăng xuất',
        'Upload' : 'Tải lên',
        'LIVE Creator Hub' : 'Trung tâm Nhà sáng tạo LIVE',
        'Feedback and help' : 'Phản hồi và trợ giúp',
        'Keyboard shortcuts' : 'Phím tắt trên bàn phím',
        'Dark mode' : 'Chế độ tối',
        'Language' : 'Ngôn ngữ',
        'TikTok desktop app' : 'Ứng dụng TikTok cho máy tính',
        'Download' : 'Tải về',
        'Download mobile app instead' : 'Thay vào đó, tải ứng dụng di động về',
        'Messages' : 'Tin nhắn',
        'Inbox' : 'Hộp thư',
        'For You' : 'Dành cho bạn',
        'Following' : 'Đang follow',
        'Explore' : 'Khám phá',
        'Are you sure you want to log out?' : 'Bạn có chắc muốn đăng xuất?',
        'See more' : 'Tải thêm',
        'See less' : 'Ẩn bớt',
        'Follow' : 'Theo dõi',
        'Following' : 'Đang theo dõi',
        'Post' : 'Đăng',
        'Comments' : 'Viết gì đó',
      },
    },
  },
  fallbackLng: 'en', // Ngôn ngữ mặc định
  lng: 'en', // Ngôn ngữ ban đầu
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
