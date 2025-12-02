import { DictionaryEntry } from '@/types';

export const SYNONYM_DICT: Record<string, DictionaryEntry> = {
  // Verbs
  "use": { synonyms: ["utilize", "employ", "apply", "harness", "leverage"] },
  "uses": { synonyms: ["utilizes", "employs", "applies", "harnesses", "leverages"] },
  "using": { synonyms: ["utilizing", "employing", "applying", "harnessing", "leveraging"] },
  "used": { synonyms: ["utilized", "employed", "applied", "harnessed", "leveraged"] },
  "make": { synonyms: ["create", "construct", "produce", "generate", "fabricate"] },
  "makes": { synonyms: ["creates", "constructs", "produces", "generates"] },
  "made": { synonyms: ["created", "constructed", "produced", "generated", "fabricated"] },
  "help": { synonyms: ["assist", "aid", "support", "facilitate"] },
  "helps": { synonyms: ["assists", "aids", "supports", "facilitates"] },
  "get": { synonyms: ["acquire", "obtain", "secure", "gain"] },
  "got": { synonyms: ["acquired", "obtained", "secured", "gained"] },
  "give": { synonyms: ["provide", "offer", "grant", "bestow"] },
  "show": { synonyms: ["demonstrate", "display", "exhibit", "reveal", "illustrate"] },
  "think": { synonyms: ["consider", "believe", "contemplate", "ponder"] },
  "need": { synonyms: ["require", "necessitate", "demand"] },
  "want": { synonyms: ["desire", "crave", "seek"] },
  "start": { synonyms: ["commence", "initiate", "begin", "launch"] },
  "stop": { synonyms: ["cease", "halt", "discontinue", "terminate"] },
  "look": { synonyms: ["examine", "observe", "view", "inspect"] },
  "buy": { synonyms: ["purchase", "procure", "acquire"] },
  "change": { synonyms: ["alter", "modify", "transform", "adjust"] },
  "ask": { synonyms: ["inquire", "request", "question", "interrogate"] },
  "say": { synonyms: ["state", "declare", "mention", "remark"] },
  
  // Adjectives
  "good": { synonyms: ["excellent", "superb", "superior", "prime", "favorable", "exceptional"] },
  "bad": { synonyms: ["poor", "subpar", "inferior", "adverse", "unfavorable"] },
  "big": { synonyms: ["large", "massive", "substantial", "immense", "enormous"] },
  "small": { synonyms: ["tiny", "diminutive", "compact", "miniature", "slight"] },
  "important": { synonyms: ["crucial", "essential", "significant", "vital", "pivotal"] },
  "happy": { synonyms: ["joyful", "content", "delighted", "elated", "satisfied"] },
  "sad": { synonyms: ["unhappy", "sorrowful", "depressed", "dejected"] },
  "new": { synonyms: ["novel", "modern", "fresh", "innovative"] },
  "old": { synonyms: ["ancient", "aged", "obsolete", "vintage"] },
  "hard": { synonyms: ["difficult", "arduous", "challenging", "complex"] },
  "easy": { synonyms: ["simple", "effortless", "straightforward"] },
  "fast": { synonyms: ["rapid", "swift", "quick", "speedy"] },
  "slow": { synonyms: ["sluggish", "leisurely", "unhurried"] },
  "different": { synonyms: ["distinct", "dissimilar", "unique", "various"] },
  
  // Adverbs
  "very": { synonyms: ["extremely", "highly", "exceedingly", "remarkably", "truly"] },
  "really": { synonyms: ["genuinely", "truly", "undoubtedly", "certainly"] },
  "maybe": { synonyms: ["perhaps", "possibly", "conceivably"] },
  "always": { synonyms: ["consistently", "constantly", "perpetually"] },
  "never": { synonyms: ["rarely", "seldom"] }, // Contextual risk
  
  // Nouns
  "problem": { synonyms: ["issue", "challenge", "difficulty", "complication"] },
  "idea": { synonyms: ["concept", "notion", "thought", "conception"] },
  "result": { synonyms: ["outcome", "consequence", "effect", "conclusion"] },
  "place": { synonyms: ["location", "site", "venue", "spot"] },
  "part": { synonyms: ["portion", "segment", "fraction", "component"] },
  "system": { synonyms: ["structure", "framework", "scheme", "setup"] },
  "way": { synonyms: ["method", "manner", "approach", "technique"] },
  "job": { synonyms: ["occupation", "profession", "role", "position"] },
  "goal": { synonyms: ["objective", "aim", "target", "ambition"] },
  "money": { synonyms: ["funds", "capital", "currency", "finances"] },
  "story": { synonyms: ["narrative", "tale", "account", "chronicle"] },
};

export const LOCKED_TERMS = new Set([
  "react", "javascript", "typescript", "html", "css", "api", "json", "google", "microsoft", "apple", "facebook", "amazon", "netflix"
]);