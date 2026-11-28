export const overviewTopics = ['Question', 'Data', 'Approach', 'Evidence'] as const;

type StudySection = (typeof overviewTopics)[number] | 'What I contributed';

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  visual?: 'screenshot' | 'chart' | 'result';
  preview?: ProjectImage;
  screenshots?: readonly ProjectImage[];
  techStack?: readonly { name: string; src: string }[];
  techStackBadge?: Pick<ProjectImage, 'src' | 'alt' | 'width' | 'height'>;
  study: Record<StudySection, string | readonly string[]>;
};

export const projects = [
  {
    slug: 'libby-bot',
    title: 'Libby Bot Library AI',
    category: 'Featured project',
    description: 'A book discovery app for Assumption University Library that helps students search the catalog and find recommendations based on book metadata and popularity.',
    visual: 'screenshot',
    techStack: [
      { name: 'Next.js', src: '/projects/libby-bot/stack/nextdotjs.svg' },
      { name: 'Tailwind CSS', src: '/projects/libby-bot/stack/tailwindcss.svg' },
      { name: 'Clerk', src: '/projects/libby-bot/stack/clerk.svg' },
      { name: 'Python', src: '/projects/libby-bot/stack/python.svg' },
      { name: 'Flask', src: '/projects/libby-bot/stack/flask.svg' },
      { name: 'PostgreSQL', src: '/projects/libby-bot/stack/postgresql.svg' },
      { name: 'Redis', src: '/projects/libby-bot/stack/redis.svg' },
      { name: 'Railway', src: '/projects/libby-bot/stack/railway.svg' },
      { name: 'Vercel', src: '/projects/libby-bot/stack/vercel.svg' },
    ],
    screenshots: [
      {
        src: '/projects/libby-bot/discover.webp',
        width: 1600,
        height: 803,
        alt: 'Libby Bot home page with a catalog search field and a row of trending book covers.',
        caption: 'Discover page with keyword search and the week’s trending books.',
      },
      {
        src: '/projects/libby-bot/preferences.webp',
        width: 1600,
        height: 807,
        alt: 'Libby Bot onboarding screen with selectable genres including fiction, technology, and science.',
        caption: 'Readers can select favorite genres during onboarding.',
      },
      {
        src: '/projects/libby-bot/recommendations.webp',
        width: 1600,
        height: 827,
        alt: 'Your Recommendations page with For You, Trending, and By Major tabs above a row of book cards.',
        caption: 'The recommendation screen groups book suggestions into For You, Trending, and By Major.',
      },
      {
        src: '/projects/libby-bot/book-details.webp',
        width: 1064,
        height: 568,
        alt: 'Book details page for Towards Open and Trustworthy Digital Societies, showing its cover, summary, and catalog metadata.',
        caption: 'Opening a recommendation shows the book’s summary and catalog details.',
      },
    ],
    study: {
      Question: 'How can Assumption University Library help students discover books that match their interests or coursework when manual catalog searches take time and reader feedback is sparse?',
      Data: 'The cleaned catalog contained 118,801 book records, with only 61 user ratings available. Records included titles, authors, and ISBNs. Google Books and Open Library helped fill gaps in descriptions, genres, and covers.',
      Approach: 'The report’s conclusion describes a recommender that matches titles, authors, and genres and boosts popular books. Readers can search the catalog, browse suggestions, and open a book to see its summary and details. The app connects a Next.js interface to a Flask API and a PostgreSQL database.',
      Evidence: 'The screenshots show how readers used the app in the senior project demo. The report’s separate hybrid evaluation recorded a Precision@10 of 0.82 and a Recall@10 of 0.75. Exhibition feedback averaged 4.5 out of 5 for overall satisfaction.',
      'What I contributed': 'I helped develop and deploy the web app for AU Library. I integrated the recommendation features, catalog data processing, and backend APIs into the full-stack application.',
    },
  },
  {
    slug: 'internship-performance-analysis',
    title: 'Internship Performance Analysis',
    category: 'Data analysis',
    description: 'A study that compares how prepared students feel for full-time work and models how the university could expand access to internships.',
    visual: 'chart',
    preview: {
      src: '/projects/internship-performance-analysis/abstract-preview.webp',
      width: 1280,
      height: 720,
      alt: 'Illustrative bar chart with glowing pink and cyan bars on a dark arcade screen.',
      caption: 'Abstract bar chart illustration.',
    },
    techStack: [
      { name: 'Looker Studio', src: '/projects/internship-performance-analysis/reporting.svg' },
      { name: 'BigML', src: '/projects/internship-performance-analysis/bigml.png' },
      { name: 'Excel Solver', src: '/projects/internship-performance-analysis/excel.svg' },
    ],
    screenshots: [
      {
        src: '/projects/internship-performance-analysis/career-preparedness.webp',
        width: 933,
        height: 682,
        alt: 'Box plots compare self-rated preparedness on a five-point scale. Scores range from 3 to 5 for students who interned and from 1 to 5 for those who did not.',
        caption: 'Preparedness averaged 4.16 out of 5 for 19 respondents with internship experience and 3.38 for 32 respondents without it.',
      },
      {
        src: '/projects/internship-performance-analysis/internship-correlations.webp',
        width: 969,
        height: 766,
        alt: 'A correlation heatmap for five variables among 19 interns. The communication and teamwork measure correlates with technical skills at 0.91.',
        caption: 'Communication and teamwork showed the strongest correlation with technical skills among interns (r = 0.91).',
      },
      {
        src: '/projects/internship-performance-analysis/predictor-importance.webp',
        width: 808,
        height: 509,
        alt: 'A BigML field importance chart ranks understanding of future career goals first at 54.77%, followed by academic year at 17.85%.',
        caption: 'Clear career goals had the highest field importance in the BigML model shown (54.77%).',
      },
      {
        src: '/projects/internship-performance-analysis/placement-optimization.webp',
        width: 1488,
        height: 474,
        alt: 'The Excel Solver table projects 80 placements from 13 corporate partnerships and one career event, using 115,000 THB and 200 staff hours.',
        caption: 'Under the model’s assumptions, 13 partnerships and one career event yield 80 projected placements. The plan uses all 200 available staff hours.',
      },
    ],
    study: {
      Question: 'How does self-reported career preparedness differ between undergraduates with and without internship experience, and how could the university expand access to placements?',
      Data: 'The survey covered 51 undergraduates. Of those, 19 (37.3%) had internship experience and 32 (62.7%) did not. Students rated preparedness on a five-point scale. The sample was concentrated in one faculty.',
      Approach: 'The team summarized survey responses in Looker Studio, compared preparedness scores with a Mann–Whitney U test, and examined correlations among interns. BigML ranked predictors, and Excel Solver allocated partnerships and career events within budget, staffing, and event limits.',
      Evidence: 'Students with internship experience rated their preparedness at 4.16 out of 5 on average, compared with 3.38 for students without internship experience (Mann–Whitney U = 412.5, p = 0.0143). The Solver scenario projected 80 new placements from 13 corporate partnerships and one career event.',
      'What I contributed': 'Describe my role in preparing the data, conducting the analysis, and presenting the findings.',
    },
  },
  {
    slug: 'data-mining',
    title: 'Data Mining with KNN & Apriori',
    category: 'Data mining',
    description: 'A study that uses Apriori to find anime genres that appear together and k-nearest neighbors (KNN) with cosine distance to recommend similar titles.',
    visual: 'result',
    preview: {
      src: '/projects/data-mining/abstract-preview.webp',
      width: 1280,
      height: 720,
      alt: 'Illustrative scatter plot with glowing pink and cyan clusters on a dark arcade screen.',
      caption: 'Abstract scatter plot illustration.',
    },
    techStack: [
      { name: 'Python', src: '/projects/libby-bot/stack/python.svg' },
      { name: 'pandas', src: '/projects/data-mining/pandas.svg' },
      { name: 'scikit-learn', src: '/projects/data-mining/scikitlearn.svg' },
    ],
    screenshots: [
      {
        src: '/projects/data-mining/pca-neighbors.webp',
        width: 1556,
        height: 1007,
        alt: 'PCA scatter plot with a red star for Fullmetal Alchemist: Brotherhood and five blue points for its recommended neighbors among gray catalog points.',
        caption: 'Two-dimensional PCA projection of the anime catalog, highlighting Fullmetal Alchemist: Brotherhood and its five KNN recommendations.',
      },
      {
        src: '/projects/data-mining/apriori-rules.webp',
        width: 1320,
        height: 345,
        alt: 'Apriori output listing five genre rules by lift. The rule linking Action and Adventure to Fantasy has 5.74% support, 57.24% confidence, and a lift of 2.44.',
        caption: 'The five highest-lift genre rules in the Apriori output, with support and confidence for each rule.',
      },
      {
        src: '/projects/data-mining/knn-neighbors.webp',
        width: 1062,
        height: 262,
        alt: 'KNN results for Fullmetal Alchemist: Brotherhood. In order, the neighbors are Hunter × Hunter, Naruto Shippuden, Naruto, One Piece, and The Seven Deadly Sins.',
        caption: 'The five nearest titles by cosine distance. Hunter × Hunter and Naruto Shippuden both appear at a reported distance of 0.002.',
      },
    ],
    study: {
      Question: 'Which anime genres often appear together, and which titles are most similar to Fullmetal Alchemist: Brotherhood based on genre, score, and rating count?',
      Data: 'The study used popular_anime.csv. After cleaning missing values, the encoded genre matrix had 16,124 rows and 18 genre columns. The recommendation features also included each title’s score and number of ratings.',
      Approach: 'Apriori found genre combinations with at least 5% support and filtered the rules at a minimum lift of 1.2. KNN compared binary genre features, standardized scores, and standardized rating counts using cosine distance. PCA projected those features into two dimensions for visual inspection.',
      Evidence: 'Of the titles tagged both Action and Adventure, 57.24% were also tagged Fantasy. The rule had 5.74% support and a lift of 2.44. For Fullmetal Alchemist: Brotherhood, the closest recommendations were Hunter × Hunter and Naruto Shippuden, each at a reported cosine distance of 0.002.',
      'What I contributed': 'Describe my role in implementing the methods, checking their output, and interpreting the results.',
    },
  },
  {
    slug: 'au-document-wallet',
    title: 'AU Document Wallet (ETDA)',
    category: 'Project',
    description: 'A mobile wallet prototype for Assumption University students and alumni to receive, view, and share academic transcripts. The prototype follows guidance from Thailand’s Electronic Transactions Development Agency (ETDA) and draws on work from its digital trust network.',
    visual: 'screenshot',
    techStack: [
      { name: 'React Native', src: '/projects/au-document-wallet/react.svg' },
      { name: 'Expo', src: '/projects/au-document-wallet/expo.svg' },
      { name: 'TypeScript', src: '/projects/au-document-wallet/typescript.svg' },
      { name: 'NestJS', src: '/projects/au-document-wallet/nestjs.svg' },
      { name: 'Supabase', src: '/projects/au-document-wallet/supabase.svg' },
      { name: 'PostgreSQL', src: '/projects/libby-bot/stack/postgresql.svg' },
    ],
    screenshots: [
      {
        src: '/projects/au-document-wallet/onboarding.webp',
        width: 949,
        height: 993,
        alt: 'Two AU Wallet mobile screens show the welcome page and an empty account registration form.',
        caption: 'Students and alumni start at the welcome screen and create an account before connecting their AU identity.',
      },
      {
        src: '/projects/au-document-wallet/transcript-lifecycle.webp',
        width: 1284,
        height: 444,
        alt: 'A six-step diagram shows the issuer preparing a record and offer, the student accepting the offer, and the recipient checking the information after the credential is issued.',
        caption: 'The planned transcript flow connects the university issuer, student holder, and recipient. The prototype simulates the recipient’s verification.',
      },
      {
        src: '/projects/au-document-wallet/wallet-pin.webp',
        width: 949,
        height: 993,
        alt: 'The Create Wallet PIN screen shows six empty slots, and the confirmation screen shows six masked digits.',
        caption: 'After connecting to AU in the prototype, the student creates and confirms a local wallet PIN.',
      },
      {
        src: '/projects/au-document-wallet/sharing-preview.webp',
        width: 616,
        height: 804,
        alt: 'The Share transcript proof screen shows degree name, major, and graduation date selected, with GPA switched off.',
        caption: 'The sharing preview demonstrates field selection. The prototype backend supports disclosure of whole sections.',
      },
      {
        src: '/projects/au-document-wallet/scanner-and-history.webp',
        width: 949,
        height: 993,
        alt: 'The wallet shows an empty QR camera frame and a demonstration sharing-history entry for Employer A.',
        caption: 'The demo shows the QR scanner and an example entry in the sharing history.',
      },
    ],
    study: {
      Question: 'How can students and alumni receive and share academic transcripts while giving each recipient only the information they need?',
      Data: 'The prototype handles university-issued transcript credentials, including student and academic claims, issuer details, and credential status. The wallet displays active and revoked records.',
      Approach: 'ETDA’s Thai VC Architecture and Reference Framework informed the issuer, holder, and verifier roles. The React Native and Expo app uses an OpenID-informed workflow for mock AU identity matching, local PIN setup, and transcript offer acceptance. Field switches demonstrate sharing choices, while the backend supports disclosure of whole sections.',
      Evidence: 'The team reports testing on Android and iOS through Expo Go. Informal feedback at the 25 September 2026 exhibition described the workflow as easy to follow. The demonstration uses prototype university services and a simulated verifier.',
      'What I contributed': 'Add the features or stages I owned.',
    },
  },
  {
    slug: 'stocksync-ai',
    title: 'StockSync AI',
    category: 'Project',
    description: 'An inventory and sales dashboard for small retailers, developed alongside a smart cart prototype.',
    techStack: [
      { name: 'React', src: '/projects/au-document-wallet/react.svg' },
      { name: 'Expo', src: '/projects/au-document-wallet/expo.svg' },
      { name: 'TypeScript', src: '/projects/au-document-wallet/typescript.svg' },
      { name: 'FastAPI (planned)', src: '/projects/stocksync-ai/fastapi.svg' },
    ],
    screenshots: [
      {
        src: '/projects/stocksync-ai/checkout-concepts.webp',
        width: 1500,
        height: 472,
        alt: 'Three concept illustrations show a cart with a camera and barcode scanner, an on-screen prompt asking the shopper to scan an item, and a store owner viewing an inventory dashboard.',
        caption: 'The proposal deck illustrates the cart prototype, an on-screen barcode prompt, and the dashboard concept.',
      },
      {
        src: '/projects/stocksync-ai/student-survey.webp',
        width: 1500,
        height: 750,
        alt: 'The proposal’s survey slide reports 90% definite interest in a smart basket and 10% openness to the idea. Long queues are the most cited checkout issue at 65.3%.',
        caption: 'Among the 100 students surveyed, 90% said they would definitely use the proposed smart basket and 10% were open to the idea.',
      },
      {
        src: '/projects/stocksync-ai/pilot-plan.webp',
        width: 1500,
        height: 369,
        alt: 'A four-month plan covers hardware setup, image labeling, model training, backend integration, lab testing, and a pilot.',
        caption: 'The proposed pilot plan allocates four months to hardware setup and data collection, model training, backend integration, and testing.',
      },
    ],
    study: {
      Question: 'How could neighborhood shops and campus stores shorten checkout queues and track stock as items are sold?',
      Data: 'The team surveyed 100 students about smart baskets. The prototype plan called for collecting and labeling images of local retail products to train the recognition model.',
      Approach: 'The team developed the dashboard app for store owners. The cart prototype pairs a camera with a barcode scanner in the proposed checkout flow. A planned FastAPI backend would connect cart events to the dashboard for live stock updates and alerts.',
      Evidence: 'In the student survey, 90% said they would definitely use a smart basket and 10% were open to the idea. Long queues were the most cited checkout issue at 65.3%. The team proposed a store pilot to evaluate checkout speed and recognition accuracy.',
      'What I contributed': 'Add the parts I designed, implemented, or tested.',
    },
  },
  {
    slug: 'network-security-simulation',
    title: 'Network Security Simulation',
    category: 'Project',
    description: 'A two-round classroom exercise in keeping a WordPress storefront available under load and measuring its recovery.',
    visual: 'chart',
    techStack: [
      { name: 'Amazon Web Services', src: '/projects/network-security-simulation/aws.svg' },
      { name: 'WordPress', src: '/projects/network-security-simulation/wordpress.svg' },
      { name: 'WooCommerce', src: '/projects/network-security-simulation/woocommerce.svg' },
      { name: 'Uptime Kuma', src: '/projects/network-security-simulation/uptimekuma.svg' },
    ],
    techStackBadge: {
      src: '/projects/network-security-simulation/aws-academy-cloud-security-foundations.png',
      alt: 'AWS Academy Cloud Security Foundations training badge',
      width: 458,
      height: 484,
    },
    screenshots: [
      {
        src: '/projects/network-security-simulation/round-two-uptime.webp',
        width: 1232,
        height: 584,
        alt: 'An Uptime Kuma chart shows a 347 ms average response time, 100% uptime over 24 hours, and 93.57% uptime over 30 days.',
        caption: 'The Round 2 snapshot shows 100% uptime and an average response time of 347 ms over 24 hours.',
      },
      {
        src: '/projects/network-security-simulation/round-one-uptime.webp',
        width: 1232,
        height: 237,
        alt: 'The Round 1 monitoring panel shows 0% uptime over 24 hours and 3.79% over 30 days.',
        caption: 'The Round 1 snapshot shows 0% uptime over the 24 hours displayed.',
      },
      {
        src: '/projects/network-security-simulation/tls-audit.webp',
        width: 1500,
        height: 619,
        alt: 'The SSL Labs report gives the storefront an A+ and lists TLS 1.3 and HTTP Strict Transport Security.',
        caption: 'The HTTPS audit graded the storefront A+ and confirmed support for TLS 1.3 and HTTP Strict Transport Security.',
      },
    ],
    study: {
      Question: 'How can a load-balanced storefront stay available during simulated traffic spikes, and which changes help the team restore service after an outage?',
      Data: 'The team monitored its WooCommerce storefront over two rounds. Uptime Kuma and UptimeRobot tracked uptime and response times. SSL Labs and PageSpeed Insights provided HTTPS and performance baselines.',
      Approach: 'The team ran the storefront on six Amazon EC2 instances behind an Application Load Balancer. It reviewed TLS and caching, added AWS WAF and Wordfence for the second round, and corrected a load balancer target configuration after an early outage.',
      Evidence: [
        'The simulated DDoS traffic never let up. In Round 1, the storefront couldn’t keep up with the flood of requests, and Uptime Kuma reported 0% uptime in its 24-hour snapshot.',
        'In Round 2, an AWS Application Load Balancer spread the traffic across eight identical instances. The requests kept coming, and the storefront held at 100% uptime over the monitored 24 hours, with an average response time of 347 ms. The same snapshot showed 93.57% rolling 30-day uptime, and the HTTPS audit earned an A+ from SSL Labs.',
      ],
      'What I contributed': 'Add my role in configuring, observing, or documenting the simulation.',
    },
  },
] as const satisfies readonly Project[];

export const resumePath = '/resume';

export const contact = {
  email: 'kyawtayza774@gmail.com',
  githubUsername: 'maxy733',
  linkedinUsername: 'kyawtayza774',
};
