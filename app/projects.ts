export const studySections = ['Question', 'Data', 'Approach', 'Evidence', 'What I contributed'] as const;

type StudySection = (typeof studySections)[number];

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  visual?: 'screenshot' | 'chart' | 'result';
  study: Record<StudySection, string>;
};

export const projects = [
  {
    slug: 'libby-bot',
    title: 'Libby Bot Library AI',
    category: 'Featured project',
    description: 'Project overview to be added. This space will cover what Assumption University Library needed, what I built, and how a recommendation works.',
    visual: 'screenshot',
    study: {
      Question: 'Describe what Assumption University Library needed and what a useful recommendation would help a reader do.',
      Data: 'Add the catalog fields, sources, and example inputs used to make recommendations.',
      Approach: 'Walk through a search, how the app chooses a recommendation, and what it returns to the reader.',
      Evidence: 'Add the original screenshot and a real example of a recommendation.',
      'What I contributed': 'Describe the parts of Libby Bot that I designed, built, and evaluated.',
    },
  },
  {
    slug: 'internship-performance-analysis',
    title: 'Internship Performance Analysis',
    category: 'Data analysis',
    description: 'Add the question this analysis answers and what the chart shows.',
    visual: 'chart',
    study: {
      Question: 'Add the question that guided the internship performance analysis.',
      Data: 'Describe the dataset, the measures of performance, and any limits on the available records.',
      Approach: 'Summarize how the records were prepared, analyzed, and compared.',
      Evidence: 'Add the original chart, including its units, timeframe, and takeaway.',
      'What I contributed': 'Describe my role in preparing the data, conducting the analysis, and presenting the findings.',
    },
  },
  {
    slug: 'data-mining',
    title: 'Data Mining with KNN & Apriori',
    category: 'Data mining',
    description: 'Add the question this project answers and the result that best illustrates it.',
    visual: 'result',
    study: {
      Question: 'Add the classification and association questions the project investigated.',
      Data: 'Document the inputs and how examples were separated for training and evaluation.',
      Approach: 'Explain where KNN was used for classification and where Apriori was used to find association rules.',
      Evidence: 'Add the evaluation result or an original association rule with its support and confidence.',
      'What I contributed': 'Describe my role in implementing the methods, checking their output, and interpreting the results.',
    },
  },
  {
    slug: 'au-document-wallet',
    title: 'AU Document Wallet',
    category: 'Project',
    description: 'Add my contribution to the university document wallet.',
    study: {
      Question: 'Describe the document workflow this project set out to improve.',
      Data: 'Identify the document types and information the wallet handles.',
      Approach: 'Describe the main workflow and the design choices behind it.',
      Evidence: 'Add an original screenshot or a verified example of the workflow.',
      'What I contributed': 'Add the features or stages I owned.',
    },
  },
  {
    slug: 'stocksync-ai',
    title: 'StockSync AI',
    category: 'Project',
    description: 'Add my contribution to StockSync AI.',
    study: {
      Question: 'Describe the problem StockSync AI set out to solve.',
      Data: 'List the information sources and inputs the project uses.',
      Approach: 'Explain what the application does and where AI fits in the workflow.',
      Evidence: 'Add a verified output or example interaction.',
      'What I contributed': 'Add the parts I designed, implemented, or tested.',
    },
  },
  {
    slug: 'network-security-simulation',
    title: 'Network Security Simulation',
    category: 'Project',
    description: 'Add my contribution to the network security simulation.',
    study: {
      Question: 'Describe the security concept the simulation explored.',
      Data: 'Describe the lab environment and what observations were recorded.',
      Approach: 'Summarize the simulation setup and how defensive behavior was assessed.',
      Evidence: 'Add an original diagram, observation, or verified result from the simulation.',
      'What I contributed': 'Add my role in configuring, observing, or documenting the simulation.',
    },
  },
] as const satisfies readonly Project[];

export const resumePath = '/resume';

export const contact = {
  email: 'kyawtayza774@gmail.com',
  githubUsername: 'maxy733',
};
