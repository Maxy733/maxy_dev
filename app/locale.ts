export type Locale = 'en' | 'th';

export function localizedPath(path: string, locale: Locale) {
  const englishPath = path.replace(/^\/th(?=\/|$)/, '') || '/';
  return locale === 'th' ? '/th' + (englishPath === '/' ? '' : englishPath) : englishPath;
}

export const ui = {
  en: {
    skip: 'Skip to content', navigation: 'Main navigation', work: 'Work', projects: 'Projects', career: 'Career',
    articles: 'Articles', about: 'About', résumé: 'Résumé', settings: 'Settings', language: 'Language',
    motion: 'Motion sickness proof', brandHome: 'Kyaw Tay Za, home', brandRole: 'Data Scientist',
    back: 'Back', backToArticles: 'Back to Articles', download: 'Download PDF', backToTop: 'Back to top',
    caseStudy: 'Case study', overview: 'Project overview', stack: 'Tech stack',
    featured: 'Featured project', previousProject: 'Previous project', nextProject: 'Next project',
    previousArticle: 'Previous articles', nextArticle: 'Next articles', projectList: 'Project list',
    read: 'Read article', readMore: 'Read More', readAbout: 'Read more about',
    pause: 'Pause automatic project rotation', play: 'Resume automatic project rotation',
    rotationDisabled: 'Automatic rotation disabled by Motion sickness proof',
    gameWork: 'Browse projects via the left arcade cabinet', gameCareer: 'Explore my career via the top-right TV',
    power: 'Comet screen power', timeline: 'Timeline', careerTimeline: 'Career timeline',
    education: 'Education', skills: 'Skills', aboutMe: 'About me', contact: 'Get in touch',
    aboutContact: 'About and contact', email: 'Email', previewRésumé: 'Preview résumé',
    credit: 'Designed and built by', explore: 'Explore my work', abstract: 'Abstract', keywords: 'Keywords',
    contents: 'Contents', portfolioArticle: 'Portfolio write-up', figure: 'Figure',
    screenshot: 'Screenshot to be added', chart: 'Original chart to be added', result: 'Original result to be added',
  },
  th: {
    skip: 'ข้ามไปยังเนื้อหา', navigation: 'เมนูหลัก', work: 'ผลงาน', projects: 'โปรเจกต์', career: 'เส้นทางอาชีพ',
    articles: 'บทความ', about: 'เกี่ยวกับ', résumé: 'เรซูเม่', settings: 'การตั้งค่า', language: 'ภาษา',
    motion: 'ลดเอฟเฟกต์ที่ทำให้เวียนหัว', brandHome: 'หน้าหลักของ Kyaw Tay Za', brandRole: 'นักวิทยาศาสตร์ข้อมูล',
    back: 'กลับ', backToArticles: 'กลับไปที่บทความ', download: 'ดาวน์โหลด PDF', backToTop: 'กลับขึ้นด้านบน',
    caseStudy: 'กรณีศึกษา', overview: 'ภาพรวมโปรเจกต์', stack: 'เทคโนโลยีที่ใช้',
    featured: 'โปรเจกต์เด่น', previousProject: 'โปรเจกต์ก่อนหน้า', nextProject: 'โปรเจกต์ถัดไป',
    previousArticle: 'บทความก่อนหน้า', nextArticle: 'บทความถัดไป', projectList: 'รายการโปรเจกต์',
    read: 'อ่านบทความ', readMore: 'อ่านเพิ่มเติม', readAbout: 'อ่านเพิ่มเติมเกี่ยวกับ',
    pause: 'พักการสลับโปรเจกต์อัตโนมัติ', play: 'สลับโปรเจกต์อัตโนมัติต่อ',
    rotationDisabled: 'หยุดการสลับโปรเจกต์อัตโนมัติตามการตั้งค่าลดเอฟเฟกต์',
    gameWork: 'ดูโปรเจกต์ผ่านตู้เกมด้านซ้าย', gameCareer: 'ดูเส้นทางอาชีพผ่านทีวีด้านขวาบน',
    power: 'เปิดหรือปิดจอดาวหาง', timeline: 'ไทม์ไลน์', careerTimeline: 'ไทม์ไลน์เส้นทางอาชีพ',
    education: 'การศึกษา', skills: 'ทักษะ', aboutMe: 'เกี่ยวกับฉัน', contact: 'ติดต่อ',
    aboutContact: 'เกี่ยวกับฉันและช่องทางติดต่อ', email: 'อีเมล', previewRésumé: 'ดูเรซูเม่',
    credit: 'ออกแบบและพัฒนาโดย', explore: 'ดูผลงานของฉัน', abstract: 'บทคัดย่อ', keywords: 'คำสำคัญ',
    contents: 'สารบัญ', portfolioArticle: 'บทความในพอร์ตโฟลิโอ', figure: 'ภาพที่',
    screenshot: 'จะเพิ่มภาพหน้าจอภายหลัง', chart: 'จะเพิ่มกราฟต้นฉบับภายหลัง', result: 'จะเพิ่มผลลัพธ์ต้นฉบับภายหลัง',
  },
} as const;
