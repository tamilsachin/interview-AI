/**
 * ============================================================================
 * InterviewAI — Core Application Logic (Phase 1 Frontend Prototype)
 * Architecture: Modular Vanilla JavaScript
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. QUESTION DATABASE (Curated for College Placements & Technical Rounds)
// ----------------------------------------------------------------------------
const QUESTION_BANK = {
  "Frontend Developer": {
    "Technical": [
      {
        id: "fe_tech_1",
        type: "Conceptual Architecture",
        question: "Can you explain the difference between the Virtual DOM and the real DOM in modern frontend frameworks like React? Why does reconciliation improve UI performance?",
        guidance: "Highlight that manipulating the real DOM is computationally expensive. Explain how an in-memory representation allows batch diffing before applying minimal paint operations.",
        rubric: {
          keyConcepts: ["in-memory tree", "batching", "diffing algorithm", "reflow and repaint", "reconciliation"],
          modelAnswer: "The Real DOM directly represents the browser's rendered document tree, where every modification triggers costly layout recalculations (reflow) and repainting. The Virtual DOM is a lightweight JavaScript representation of that DOM kept in memory. When state updates, React constructs a new Virtual DOM tree, runs a diffing algorithm (reconciliation) comparing it with the previous snapshot, and batches only the actual necessary mutations to the real DOM, preventing redundant browser layout thrashing."
        }
      },
      {
        id: "fe_tech_2",
        type: "Browser Runtime & Async",
        question: "How does the JavaScript Event Loop work? Specifically, what is the distinction between Microtasks (like Promise callbacks) and Macrotasks (like setTimeout)?",
        guidance: "Mention the Call Stack, Task Queue, Microtask Queue, and how the engine processes all microtasks before picking the next macrotask.",
        rubric: {
          keyConcepts: ["call stack", "event loop", "microtask queue", "macrotask queue", "promises vs settimeout"],
          modelAnswer: "JavaScript is single-threaded. Synchronous code executes directly on the Call Stack. Asynchronous callbacks are queued: Macrotasks (setTimeout, setInterval, I/O) go to the Task Queue, while Microtasks (Promise.then, MutationObserver, queueMicrotask) go to the Microtask Queue. Once the call stack is clear, the Event Loop first drains ALL pending microtasks completely before rendering and executing the single next macrotask."
        }
      },
      {
        id: "fe_tech_3",
        type: "Performance & Rendering",
        question: "What strategies would you implement to optimize the initial page load time and Cumulative Layout Shift (CLS) of a content-heavy web application?",
        guidance: "Discuss code splitting, lazy loading images with explicit aspect ratios, font loading strategies, and critical CSS.",
        rubric: {
          keyConcepts: ["code splitting", "lazy loading", "dimension attributes / aspect ratio", "font display swap", "critical css"],
          modelAnswer: "To optimize initial load: (1) Use dynamic imports and route-based code splitting so users download only necessary JavaScript. (2) Compress assets and use modern formats like WebP or AVIF. (3) Preload critical fonts and defer non-critical scripts. To prevent Cumulative Layout Shift (CLS): always specify explicit width/height or aspect-ratio CSS on images, reserve space for asynchronous ad slots or dynamic banners, and avoid inserting elements above existing content without user initiation."
        }
      }
    ],
    "Coding & Concepts": [
      {
        id: "fe_code_1",
        type: "Coding Concepts & Closures",
        question: "Explain what a Closure is in JavaScript with a practical example. Where are closures commonly used in frontend engineering?",
        guidance: "Explain lexical scope and how inner functions retain access to outer variables even after the outer function finishes executing.",
        rubric: {
          keyConcepts: ["lexical scope", "outer function scope", "data privacy", "currying", "event handlers"],
          modelAnswer: "A closure is the combination of a function bundled together with references to its surrounding lexical state. Closures allow an inner function to access variables from an enclosing scope even after the outer function has returned. They are commonly used for data encapsulation/private state, memoization caches, and event listener factories."
        }
      },
      {
        id: "fe_code_2",
        type: "Coding Concepts & State",
        question: "Why should state never be mutated directly in React (e.g. state.push vs [...state, item])? What does immutability enable in frontend frameworks?",
        guidance: "Discuss shallow reference equality checks, predictable component re-rendering, and time-travel debugging.",
        rubric: {
          keyConcepts: ["immutability", "reference equality", "re-rendering triggers", "pure components", "mutation pitfalls"],
          modelAnswer: "React uses shallow reference equality (Object.is) to determine if state has changed. If you mutate an object or array directly, its memory reference remains the same, so React may skip re-rendering the component. Immutability ensures predictable state changes, enables rapid change detection, and avoids unexpected side-effects across components."
        }
      }
    ],
    "Role-Specific": [
      {
        id: "fe_role_1",
        type: "Frontend Practical Scenario",
        question: "You need to build a search bar with auto-complete that queries a backend API as the user types. How would you prevent sending a request on every single keystroke?",
        guidance: "Explain debouncing, request cancellation with AbortController, and caching previous query results.",
        rubric: {
          keyConcepts: ["debouncing", "cleartimeout", "abortcontroller", "race conditions", "caching"],
          modelAnswer: "I would implement debouncing using a timer (e.g., 300ms) that resets on every keystroke, ensuring an API request only fires after the user pauses typing. Additionally, I would use an AbortController to cancel any previous pending in-flight request if a new search is initiated, preventing race conditions where older slow responses overwrite newer results."
        }
      }
    ]
  },

  "Backend Developer": {
    "Technical": [
      {
        id: "be_tech_1",
        type: "API Design & Protocols",
        question: "What are the core differences between RESTful APIs and GraphQL? When would you choose one over the other for a scalable backend?",
        guidance: "Address over-fetching and under-fetching, caching simplicity (HTTP headers), and client payload flexibility.",
        rubric: {
          keyConcepts: ["over-fetching", "under-fetching", "http caching", "single endpoint", "schema definition"],
          modelAnswer: "REST uses resource-based URL endpoints with standard HTTP verbs. It benefits from native HTTP caching (ETags, CDN support) and simple tooling, but can lead to over-fetching or under-fetching. GraphQL allows clients to request exactly the shape of data required in a single POST query. REST is ideal for microservices and public endpoints where HTTP caching is vital, while GraphQL shines in complex client frontends demanding varied entity relationships."
        }
      },
      {
        id: "be_tech_2",
        type: "Database Engineering",
        question: "How do database indexes speed up query performance in relational databases (PostgreSQL/MySQL), and what trade-offs do they introduce?",
        guidance: "Explain B-Trees, lookup complexity, and write overhead on INSERT/UPDATE/DELETE.",
        rubric: {
          keyConcepts: ["b-tree", "lookup vs scan", "write penalty", "disk storage", "index selectivity"],
          modelAnswer: "Database indexes create specialized lookup data structures (typically balanced B-Trees) ordered by specific columns. Instead of performing an O(N) sequential full table scan, the database engine executes an O(log N) tree traversal to find row pointers. The trade-offs are: (1) Storage overhead for maintaining the index structures, and (2) Write latency penalty, because every INSERT, UPDATE, or DELETE requires reorganizing the index."
        }
      }
    ],
    "Coding & Concepts": [
      {
        id: "be_code_1",
        type: "Concurrency & Async I/O",
        question: "Explain the difference between synchronous blocking operations and asynchronous non-blocking I/O in Node.js. How do you prevent blocking the main thread?",
        guidance: "Mention libuv threadpool, CPU-intensive algorithms vs network I/O, and worker threads.",
        rubric: {
          keyConcepts: ["single thread", "event loop", "libuv", "cpu-bound vs io-bound", "worker threads"],
          modelAnswer: "Node.js runs user JavaScript on a single thread. For I/O operations (file reads, network sockets, DB queries), it delegates work to libuv and OS non-blocking hooks, returning execution immediately to the event loop. To avoid blocking the main thread, CPU-intensive workloads (cryptography, image compression, large JSON parsing) must be offloaded to Worker Threads or external background queues."
        }
      }
    ],
    "Role-Specific": [
      {
        id: "be_role_1",
        type: "Backend System Scenario",
        question: "How would you design a secure authentication and authorization system for a REST API using JWTs and refresh tokens?",
        guidance: "Explain short-lived access tokens, secure httpOnly refresh tokens, token revocation, and role-based permissions.",
        rubric: {
          keyConcepts: ["short-lived jwt", "httponly cookie", "refresh token rotation", "revocation list / redis", "rbac middleware"],
          modelAnswer: "Use short-lived JWT access tokens (10–15 mins expiry) for stateless authorization sent in the Authorization header. Issue a long-lived cryptographically random refresh token stored in a secure, httpOnly, SameSite cookie. When the access token expires, the client exchanges the refresh token for a new pair (implementing refresh token rotation). Store valid refresh tokens in Redis to enable instant revocation on logout or suspicious activity."
        }
      }
    ]
  },

  "Software Engineer": {
    "Technical": [
      {
        id: "swe_tech_1",
        type: "Data Structures & Complexity",
        question: "Explain the time and space complexity trade-offs between an Array and a Hash Map when performing lookups, insertions, and deletions.",
        guidance: "Analyze contiguous memory vs hash calculation and collision resolution.",
        rubric: {
          keyConcepts: ["o(1) average lookup", "contiguous memory", "hash collisions", "re-indexing overhead", "space overhead"],
          modelAnswer: "Arrays store elements in contiguous memory: lookups by index are O(1), but searching for an arbitrary value is O(N). Insertions/deletions require shifting elements, costing O(N) unless at the end. Hash Maps compute a hash code from keys to index buckets: average lookups, insertions, and deletions are O(1). However, Hash Maps have higher space overhead due to bucket allocations and pointer storage, with worst-case O(N) performance during frequent hash collisions."
        }
      },
      {
        id: "swe_tech_2",
        type: "System Design Concepts",
        question: "What is horizontal scaling versus vertical scaling? What challenges arise with horizontal scaling in distributed state management?",
        guidance: "Cover adding servers vs upgrading hardware. Mention session stickiness, cache invalidation, and database replication.",
        rubric: {
          keyConcepts: ["scale out vs scale up", "stateless architecture", "load balancing", "session stores", "eventual consistency"],
          modelAnswer: "Vertical scaling (scaling up) means upgrading CPU/RAM on a single machine; it has hard hardware ceilings and single points of failure. Horizontal scaling (scaling out) means adding multiple server instances behind a load balancer. The primary challenges in horizontal scaling are distributed state: servers must be made stateless (offloading session storage to shared Redis clusters), handling cache coherence, and coordinating database read replicas with potential replication lag."
        }
      }
    ],
    "Coding & Concepts": [
      {
        id: "swe_code_1",
        type: "Algorithms & Problem Solving",
        question: "How does caching work, and what are the most common cache replacement policies (e.g. LRU vs LFU)?",
        guidance: "Explain cache hits/misses, Least Recently Used with doubly linked lists and hash maps, and cache stampedes.",
        rubric: {
          keyConcepts: ["cache hit ratio", "least recently used (lru)", "least frequently used (lfu)", "doubly linked list", "ttl"],
          modelAnswer: "Caching places frequently queried data in fast, volatile memory (like RAM) to prevent repetitive slow computations or disk/database reads. When cache capacity is reached, eviction policies determine what gets pruned: Least Recently Used (LRU) evicts data accessed furthest in the past (implemented with a Hash Map + Doubly Linked List in O(1)), while Least Frequently Used (LFU) evicts items with the lowest access count."
        }
      }
    ],
    "Role-Specific": [
      {
        id: "swe_role_1",
        type: "Engineering Trade-offs",
        question: "When would you choose a Monolithic architecture versus a Microservices architecture for a new startup product?",
        guidance: "Compare development speed, team size, operational complexity, and independent deployability.",
        rubric: {
          keyConcepts: ["startup velocity", "operational overhead", "independent deployment", "network latency", "modular monolith"],
          modelAnswer: "For a new startup, a well-structured Monolith (or Modular Monolith) is usually optimal. It enables rapid feature iteration, single-command deployments, straightforward end-to-end testing, and zero distributed system overhead (no network latency between services, no complex distributed tracing). Microservices should be adopted later when team size grows, individual domains have vastly different scaling requirements, or independent deployment cadence becomes necessary."
        }
      }
    ]
  },

  "Data Analyst": {
    "Technical": [
      {
        id: "da_tech_1",
        type: "SQL & Relational Logic",
        question: "What is the difference between WHERE and HAVING clauses in SQL, and when would you use Window Functions like ROW_NUMBER() over GROUP BY?",
        guidance: "Explain filtering before vs after aggregation, and preserving row-level detail.",
        rubric: {
          keyConcepts: ["pre-aggregation vs post-aggregation", "group by aggregation", "window functions", "partition by", "row preservation"],
          modelAnswer: "WHERE filters individual rows BEFORE any aggregation occurs, while HAVING filters aggregated metric groups AFTER the GROUP BY operation. GROUP BY condenses multiple rows into a single summary row per group. In contrast, Window Functions (like ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)) perform calculations across a set of table rows while still preserving the original individual row-level detail."
        }
      },
      {
        id: "da_tech_2",
        type: "Data Cleaning & Quality",
        question: "How do you detect and handle missing data or extreme outliers in a large dataset before presenting insights to stakeholders?",
        guidance: "Discuss imputing vs dropping, domain context, interquartile range (IQR), and documenting assumptions.",
        rubric: {
          keyConcepts: ["missing completely at random (mcar)", "imputation strategies", "interquartile range / z-score", "business impact", "documentation"],
          modelAnswer: "First, inspect missing patterns to determine if values are Missing Completely at Random or systematic. Depending on volume and business context: drop rows if negligible, or impute using median (for skewed distributions) or group-level means. For outliers, use domain knowledge alongside statistical thresholds like Interquartile Range (IQR 1.5x) or Z-scores (>3). Always document assumptions and verify if outliers represent data entry errors or genuine high-value anomalies."
        }
      }
    ],
    "Coding & Concepts": [
      {
        id: "da_code_1",
        type: "Python & Analytics",
        question: "In Python Pandas, what is the difference between .loc[] and .iloc[], and why is vectorization preferred over iterating with for-loops?",
        guidance: "Explain label-based vs integer-position indexing, and low-level C array execution in NumPy/Pandas.",
        rubric: {
          keyConcepts: ["label-based indexing", "integer position", "vectorization", "numpy c-speed", "loop overhead"],
          modelAnswer: ".loc[] is label-based indexing (querying by row index labels and column names), while .iloc[] is integer-position based (querying by zero-indexed numerical positions). Vectorized operations in Pandas delegate calculations to underlying compiled C/Fortran NumPy arrays, executing operations in SIMD memory batches without the interpreter overhead of Python for-loops, often yielding 100x to 1000x speedups."
        }
      }
    ],
    "Role-Specific": [
      {
        id: "da_role_1",
        type: "Business Analytics Scenario",
        question: "A company's monthly active users (MAU) grew by 15%, but revenue dropped by 5%. How would you investigate and explain this discrepancy to leadership?",
        guidance: "Segment by user cohort, pricing tiers, geography, and average revenue per user (ARPU).",
        rubric: {
          keyConcepts: ["cohort segmentation", "arpu / ltv", "free vs paid tier mix", "churn of enterprise clients", "conversion funnel"],
          modelAnswer: "I would segment the data across dimensions: (1) Tier Mix: Did free tier sign-ups surge (e.g. from marketing campaigns) while paid tier conversion lagged? (2) ARPU & Churn: Did high-paying enterprise accounts churn while smaller freemium users joined? (3) Geography & Discounts: Did growth come from lower-priced emerging markets or discounted promotional codes? Presenting this cohort breakdown clarifies that top-line user growth was driven by lower-monetizing segments."
        }
      }
    ]
  },

  "Product Manager": {
    "Technical": [
      {
        id: "pm_tech_1",
        type: "Product Strategy & Metrics",
        question: "How do you evaluate and prioritize competing feature requests from engineering, design, sales, and executives?",
        guidance: "Explain prioritization frameworks like RICE, Kano, or Value vs Effort, and tying decisions to company OKRs.",
        rubric: {
          keyConcepts: ["rice framework (reach, impact, confidence, effort)", "company okrs", "stakeholder communication", "customer discovery", "opportunity cost"],
          modelAnswer: "I align all feature proposals against top-level quarterly company OKRs and customer evidence. I use structured frameworks like RICE (Reach, Impact, Confidence, Effort) to quantify expected outcomes while factoring in engineering complexity. Crucially, I validate assumptions through customer interviews and analytics rather than executive opinion alone, communicating the 'why' transparently to manage stakeholder expectations."
        }
      }
    ],
    "Coding & Concepts": [
      {
        id: "pm_code_1",
        type: "Product Metrics & Analytics",
        question: "What is the difference between a Vanity Metric and an Actionable Metric? Give an example of each for a job preparation platform.",
        guidance: "Distinguish between numbers that look impressive versus numbers that inform product iterations.",
        rubric: {
          keyConcepts: ["vanity vs actionable", "repeat engagement", "completion rates", "causation vs correlation", "cohort retention"],
          modelAnswer: "A vanity metric is a high-level aggregate number that looks impressive but cannot guide decision-making (e.g. '100,000 total website page views' or 'registered accounts'). An actionable metric directly ties to core user value and informs what to build or fix (e.g. '7-day retention of users who complete at least one mock interview' or 'interview completion rate'). Actionable metrics clearly show whether product changes improve user outcomes."
        }
      }
    ],
    "Role-Specific": [
      {
        id: "pm_role_1",
        type: "Product Launch Scenario",
        question: "How would you run an A/B test to validate whether adding AI-generated hints during an interview increases user practice completion rates?",
        guidance: "Formulate hypothesis, sample size, primary metric, guardrail metrics, and statistical significance.",
        rubric: {
          keyConcepts: ["hypothesis", "control vs variant", "primary completion metric", "guardrail metrics", "statistical significance"],
          modelAnswer: "Hypothesis: Showing contextual hints will reduce drop-off on challenging questions and increase full interview completion by 15%. Setup: Split qualifying users 50/50 into Control (no hints) and Variant (hints enabled). Primary Metric: Interview completion rate (answering all configured questions). Guardrail Metrics: Average time spent per question and answer quality score (to ensure hints don't encourage shallow copy-pasting). Run until statistical significance (p < 0.05) is reached before deciding on a rollout."
        }
      }
    ]
  },

  "General": {
    "HR & Behavioral": [
      {
        id: "hr_star_1",
        type: "Behavioral — STAR Method",
        question: "Tell me about a time you worked on a challenging group project or faced a disagreement with a team member. How did you resolve it?",
        guidance: "Structure your answer using STAR: Situation (context), Task (your responsibility), Action (steps you personally took to resolve the issue), Result (the positive outcome and what you learned).",
        rubric: {
          keyConcepts: ["situation context", "active listening", "compromise/data-driven decision", "measurable result", "professional collaboration"],
          modelAnswer: "Situation: During our final-year engineering project, two team members disagreed on whether to use SQL or MongoDB. Task: As lead developer, I needed to keep the project on schedule without creating team friction. Action: I organized a structured discussion where we listed our specific entity relationships and query patterns. We recognized our data was heavily relational, demonstrating SQL was the optimal choice. Result: The team aligned unanimously, completed the database migration 4 days ahead of deadline, and achieved an 'A' grade."
        }
      },
      {
        id: "hr_star_2",
        type: "Behavioral — Overcoming Failure",
        question: "Can you describe a situation where you made a mistake or failed to meet a deadline? How did you handle the situation and what did you learn?",
        guidance: "Be honest and accountable. Focus 70% of your answer on how you owned the mistake, mitigated the impact, and put safeguards in place so it would not recur.",
        rubric: {
          keyConcepts: ["ownership / accountability", "timely communication", "remediation steps", "post-mortem / prevention", "resilience"],
          modelAnswer: "Situation: In my summer internship, I pushed a script that accidentally broke an internal reporting query right before a sprint review. Task: I was responsible for fixing the pipeline and communicating with stakeholders. Action: I immediately alerted my mentor rather than attempting a silent cover-up, reverted the commit, and wrote unit tests covering the edge case. Result: The report was restored in 45 minutes, and I added a pre-commit validation hook that our whole team adopted for future deployments."
        }
      },
      {
        id: "hr_star_3",
        type: "Behavioral — Career Motivation",
        question: "Why are you interested in this role and our company, and where do you see your technical skills evolving over the next two years?",
        guidance: "Connect your personal passion and recent projects to the company's domain. Outline a clear, proactive learning trajectory.",
        rubric: {
          keyConcepts: ["company alignment", "genuine enthusiasm", "concrete learning roadmap", "curiosity", "ownership mindset"],
          modelAnswer: "I have closely followed your team's open-source tooling and focus on scalable cloud systems. In my academic projects building full-stack web applications, I realized how much I enjoy optimizing backend throughput and resilient APIs. Over the next two years, my goal is to transition from solid individual feature development into contributing to high-throughput system architecture, mastering distributed caching, and actively mentoring incoming junior interns."
        }
      }
    ]
  }
};

// ----------------------------------------------------------------------------
// 2. CENTRAL APPLICATION STATE
// ----------------------------------------------------------------------------
const appState = {
  currentView: "landing",
  config: {
    role: "Frontend Developer",
    category: "Technical",
    experience: "Fresher / College Student",
    difficulty: "Intermediate",
    count: 3,
    durationMinutes: 15,
    jobDescription: ""
  },
  questions: [],
  currentIndex: 0,
  answers: [],
  timer: {
    intervalId: null,
    totalSeconds: 900,
    remainingSeconds: 900,
    startTime: null,
    elapsedSeconds: 0
  }
};

// ----------------------------------------------------------------------------
// 3. SAFE DOM ELEMENT ACCESSOR
// ----------------------------------------------------------------------------
function getElement(id) {
  return document.getElementById(id);
}

// ----------------------------------------------------------------------------
// 4. VIEW ROUTING & TRANSITIONS
// ----------------------------------------------------------------------------
function showView(targetViewId) {
  appState.currentView = targetViewId;

  const views = {
    landing: getElement("view-landing"),
    setup: getElement("view-setup"),
    interview: getElement("view-interview"),
    feedback: getElement("view-feedback")
  };

  Object.entries(views).forEach(([key, el]) => {
    if (!el) return;
    if (key === targetViewId) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ----------------------------------------------------------------------------
// 5. SETUP CONTROLLER & ROBUST QUESTION SELECTION
// ----------------------------------------------------------------------------
function handleSetupSubmit(event) {
  if (event) event.preventDefault();

  const roleEl = getElement("setup-role");
  const categoryEl = getElement("setup-category");
  const experienceEl = getElement("setup-experience");
  const difficultyEl = getElement("setup-difficulty");
  const countEl = getElement("setup-count");
  const durationEl = getElement("setup-duration");
  const jobDescEl = getElement("setup-job-desc");
  const errorEl = getElement("setup-error");

  const role = roleEl ? roleEl.value.trim() : "Frontend Developer";
  const category = categoryEl ? categoryEl.value.trim() : "Technical";
  const experience = experienceEl ? experienceEl.value.trim() : "Fresher / College Student";
  const difficulty = difficultyEl ? difficultyEl.value.trim() : "Intermediate";
  const count = countEl ? parseInt(countEl.value, 10) || 3 : 3;
  const durationMinutes = durationEl ? parseInt(durationEl.value, 10) : 15;
  const jobDescription = jobDescEl ? jobDescEl.value.trim() : "";

  if (!role || !category) {
    if (errorEl) {
      errorEl.textContent = "Please select both a target job role and an interview category.";
      errorEl.style.display = "block";
    }
    return;
  }

  if (errorEl) {
    errorEl.style.display = "none";
  }

  appState.config = {
    role,
    category,
    experience,
    difficulty,
    count,
    durationMinutes,
    jobDescription
  };

  // Safe question selection with guaranteed fallback
  appState.questions = selectQuestionsForSession(role, category, count);
  appState.currentIndex = 0;
  appState.answers = new Array(appState.questions.length).fill("");

  initInterviewRoom();
  showView("interview");
}

function selectQuestionsForSession(role, category, count) {
  let pool = [];

  // Behavioral questions check
  if (category === "HR & Behavioral") {
    pool = (QUESTION_BANK["General"] && QUESTION_BANK["General"]["HR & Behavioral"]) || [];
  } else {
    // Look up exact role & category match
    if (QUESTION_BANK[role] && Array.isArray(QUESTION_BANK[role][category])) {
      pool = QUESTION_BANK[role][category];
    } else if (QUESTION_BANK[role] && Array.isArray(QUESTION_BANK[role]["Technical"])) {
      pool = QUESTION_BANK[role]["Technical"];
    } else if (QUESTION_BANK["Software Engineer"] && Array.isArray(QUESTION_BANK["Software Engineer"]["Technical"])) {
      pool = QUESTION_BANK["Software Engineer"]["Technical"];
    }
  }

  // Absolute fallback safety: never allow pool to be empty or undefined
  if (!Array.isArray(pool) || pool.length === 0) {
    pool = (QUESTION_BANK["Frontend Developer"] && QUESTION_BANK["Frontend Developer"]["Technical"]) || [
      {
        id: "fallback_1",
        type: "General Engineering",
        question: "Describe your approach to designing a scalable and maintainable software application.",
        guidance: "Discuss modularity, testing, performance, and clear documentation.",
        rubric: {
          keyConcepts: ["modularity", "clean architecture", "testing", "documentation"],
          modelAnswer: "Focus on separation of concerns, writing testable modular components, and documenting design decisions."
        }
      }
    ];
  }

  // Shuffle and pick desired count
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ----------------------------------------------------------------------------
// 6. INTERVIEW ROOM CONTROLLER
// ----------------------------------------------------------------------------
function initInterviewRoom() {
  const roleDisplay = getElement("room-role-display");
  const categoryDisplay = getElement("room-category-display");
  const difficultyDisplay = getElement("room-difficulty-display");

  if (roleDisplay) roleDisplay.textContent = appState.config.role;
  if (categoryDisplay) categoryDisplay.textContent = appState.config.category;
  if (difficultyDisplay) difficultyDisplay.textContent = appState.config.difficulty;

  initTimer(appState.config.durationMinutes);
  loadQuestion(appState.currentIndex);
}

function loadQuestion(index) {
  const total = appState.questions.length;
  const q = appState.questions[index];
  if (!q) return;

  const counterEl = getElement("room-question-counter");
  const percentEl = getElement("room-progress-percent");
  const fillEl = getElement("room-progress-fill");
  const typeEl = getElement("room-question-type");
  const textEl = getElement("room-question-text");
  const guidanceEl = getElement("room-guidance-text");
  const answerEl = getElement("room-answer-input");
  const prevBtn = getElement("room-prev-btn");
  const nextBtn = getElement("room-next-btn");
  const autosaveEl = getElement("room-autosave-indicator");

  const questionNum = index + 1;
  const percent = Math.round((questionNum / total) * 100);

  if (counterEl) counterEl.textContent = `Question ${questionNum} of ${total}`;
  if (percentEl) percentEl.textContent = `${percent}% Completed`;
  if (fillEl) fillEl.style.width = `${percent}%`;

  if (typeEl) typeEl.textContent = q.type || "Interview Question";
  if (textEl) textEl.textContent = q.question;
  if (guidanceEl) guidanceEl.textContent = q.guidance || "Explain your thinking step-by-step.";

  if (answerEl) {
    answerEl.value = appState.answers[index] || "";
    answerEl.focus();
  }

  updateWordCount();

  if (prevBtn) prevBtn.disabled = index === 0;

  if (nextBtn) {
    if (index === total - 1) {
      nextBtn.textContent = "Submit & View Report ✓";
    } else {
      nextBtn.textContent = "Save & Next Question →";
    }
  }

  if (autosaveEl) autosaveEl.textContent = "Saved locally";
}

function saveCurrentAnswer() {
  const answerEl = getElement("room-answer-input");
  const autosaveEl = getElement("room-autosave-indicator");
  if (!answerEl) return;

  const text = answerEl.value.trim();
  appState.answers[appState.currentIndex] = text;

  if (autosaveEl) autosaveEl.textContent = "Saved locally";
}

function handleNextQuestion() {
  saveCurrentAnswer();

  if (appState.currentIndex < appState.questions.length - 1) {
    appState.currentIndex++;
    loadQuestion(appState.currentIndex);
  } else {
    finishInterviewSession();
  }
}

function handlePrevQuestion() {
  saveCurrentAnswer();

  if (appState.currentIndex > 0) {
    appState.currentIndex--;
    loadQuestion(appState.currentIndex);
  }
}

function handleSkipQuestion() {
  const answerEl = getElement("room-answer-input");
  if (answerEl) answerEl.value = "";
  appState.answers[appState.currentIndex] = "[Question skipped by candidate]";
  handleNextQuestion();
}

function updateWordCount() {
  const answerEl = getElement("room-answer-input");
  const wordCounterEl = getElement("room-word-counter");
  if (!answerEl || !wordCounterEl) return;

  const text = answerEl.value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  wordCounterEl.textContent = `${words} word${words === 1 ? "" : "s"}`;
}

// ----------------------------------------------------------------------------
// 7. TIMER ENGINE
// ----------------------------------------------------------------------------
function initTimer(durationMinutes) {
  if (appState.timer.intervalId) {
    clearInterval(appState.timer.intervalId);
    appState.timer.intervalId = null;
  }

  const container = getElement("room-timer-container");

  if (!durationMinutes || durationMinutes <= 0) {
    if (container) container.style.display = "none";
    appState.timer.remainingSeconds = 0;
    appState.timer.startTime = Date.now();
    return;
  }

  if (container) container.style.display = "flex";
  appState.timer.totalSeconds = durationMinutes * 60;
  appState.timer.remainingSeconds = appState.timer.totalSeconds;
  appState.timer.startTime = Date.now();

  updateTimerDisplay();

  appState.timer.intervalId = setInterval(() => {
    appState.timer.remainingSeconds--;
    appState.timer.elapsedSeconds = Math.floor((Date.now() - appState.timer.startTime) / 1000);

    updateTimerDisplay();

    if (appState.timer.remainingSeconds <= 0) {
      clearInterval(appState.timer.intervalId);
      appState.timer.intervalId = null;
      finishInterviewSession();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const textEl = getElement("room-timer-text");
  const container = getElement("room-timer-container");
  if (!textEl) return;

  const mins = Math.max(0, Math.floor(appState.timer.remainingSeconds / 60));
  const secs = Math.max(0, appState.timer.remainingSeconds % 60);
  textEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (container) {
    if (appState.timer.remainingSeconds <= 120) {
      container.style.color = "#f59e0b";
      container.style.borderColor = "rgba(245, 158, 11, 0.4)";
    } else {
      container.style.color = "var(--accent-cyan)";
      container.style.borderColor = "rgba(6, 182, 212, 0.25)";
    }
  }
}

function stopTimer() {
  if (appState.timer.intervalId) {
    clearInterval(appState.timer.intervalId);
    appState.timer.intervalId = null;
  }
}

// ----------------------------------------------------------------------------
// 8. INTERVIEW COMPLETION & RUBRIC EVALUATION ENGINE
// ----------------------------------------------------------------------------
function finishInterviewSession() {
  stopTimer();
  saveCurrentAnswer();

  const elapsed = appState.timer.startTime
    ? Math.max(1, Math.floor((Date.now() - appState.timer.startTime) / 1000))
    : 120;
  appState.timer.elapsedSeconds = elapsed;

  const report = evaluateSessionAnswers(appState.questions, appState.answers);
  renderFeedbackReport(report);
  showView("feedback");
}

function evaluateSessionAnswers(questions, answers) {
  let totalScoreSum = 0;
  const questionReports = [];

  questions.forEach((q, idx) => {
    const rawAnswer = answers[idx] || "";
    const isSkipped = rawAnswer === "[Question skipped by candidate]" || rawAnswer.trim() === "";

    let questionScore = 0;
    const strengths = [];
    const missing = [];

    const rubric = q.rubric || {};
    const rubricConcepts = rubric.keyConcepts || [];
    const modelAns = rubric.modelAnswer || "Focus on addressing the core question clearly with concrete trade-offs.";

    if (isSkipped) {
      questionScore = 25;
      strengths.push("Question was reviewed during the mock round.");
      missing.push("No answer was submitted. Key concepts were not addressed.");
    } else {
      const words = rawAnswer.split(/\s+/).filter(Boolean).length;
      const lowerAnswer = rawAnswer.toLowerCase();

      let conceptsFound = 0;
      rubricConcepts.forEach((concept) => {
        const wordsInConcept = concept.toLowerCase().split(" ");
        const match = wordsInConcept.some((w) => lowerAnswer.includes(w));
        if (match) {
          conceptsFound++;
        }
      });

      const conceptRatio = rubricConcepts.length > 0 ? conceptsFound / rubricConcepts.length : 0.5;
      const conceptScore = conceptRatio * 50;
      const depthScore = Math.min(35, words * 0.75);
      const structureScore = 15;

      questionScore = Math.min(96, Math.max(45, Math.round(conceptScore + depthScore + structureScore)));

      if (words > 40) {
        strengths.push("Good descriptive depth and willingness to elaborate on technical rationale.");
      } else {
        strengths.push("Concise response addressing the main topic.");
      }

      if (conceptsFound >= 2) {
        strengths.push(`Successfully touched upon core concepts: ${rubricConcepts.slice(0, 2).join(", ")}.`);
      } else if (rubricConcepts.length > 0) {
        missing.push(`Consider mentioning: ${rubricConcepts.slice(0, 3).join(", ")}.`);
      }

      if (words < 30) {
        missing.push("Elaborate further by providing a concrete real-world example or discussing edge cases.");
      }
    }

    totalScoreSum += questionScore;

    questionReports.push({
      questionNumber: idx + 1,
      questionText: q.question,
      questionType: q.type || "Interview Round",
      userAnswer: isSkipped ? "(Question Skipped)" : rawAnswer,
      score: questionScore,
      strengths: strengths.length ? strengths : ["Demonstrated baseline understanding."],
      missing: missing.length ? missing : ["Could explore scale and performance trade-offs."],
      modelAnswer: modelAns
    });
  });

  const overallScore = Math.round(totalScoreSum / Math.max(1, questions.length));

  const techScore = Math.min(40, Math.round((overallScore / 100) * 40));
  const commScore = Math.min(30, Math.round((overallScore / 100) * 30));
  const reasonScore = Math.min(30, Math.round((overallScore / 100) * 30));

  return {
    overallScore,
    techScore,
    commScore,
    reasonScore,
    questions: questionReports,
    timeSpent: appState.timer.elapsedSeconds
  };
}

function renderFeedbackReport(report) {
  const roleEl = getElement("feedback-role-display");
  const catEl = getElement("feedback-category-display");
  const diffEl = getElement("feedback-difficulty-display");
  const timeEl = getElement("feedback-time-taken");
  const overallEl = getElement("feedback-overall-score");
  const ratingEl = getElement("feedback-score-rating");

  if (roleEl) roleEl.textContent = appState.config.role;
  if (catEl) catEl.textContent = appState.config.category;
  if (diffEl) diffEl.textContent = appState.config.difficulty;

  const mins = Math.floor(report.timeSpent / 60);
  const secs = report.timeSpent % 60;
  if (timeEl) timeEl.textContent = `Time: ${mins}m ${secs}s`;

  if (overallEl) overallEl.textContent = report.overallScore;

  if (ratingEl) {
    if (report.overallScore >= 85) {
      ratingEl.textContent = "Excellent Performance";
      ratingEl.style.color = "var(--color-success)";
    } else if (report.overallScore >= 70) {
      ratingEl.textContent = "Strong Demonstration";
      ratingEl.style.color = "var(--accent-cyan-light)";
    } else {
      ratingEl.textContent = "Needs Practice";
      ratingEl.style.color = "var(--color-warning)";
    }
  }

  // Rubric Bars
  const b1Val = getElement("score-bar-1-val");
  const b1Fill = getElement("score-bar-1-fill");
  const b2Val = getElement("score-bar-2-val");
  const b2Fill = getElement("score-bar-2-fill");
  const b3Val = getElement("score-bar-3-val");
  const b3Fill = getElement("score-bar-3-fill");

  if (b1Val) b1Val.textContent = `${report.techScore} / 40`;
  if (b1Fill) b1Fill.style.width = `${Math.round((report.techScore / 40) * 100)}%`;

  if (b2Val) b2Val.textContent = `${report.commScore} / 30`;
  if (b2Fill) b2Fill.style.width = `${Math.round((report.commScore / 30) * 100)}%`;

  if (b3Val) b3Val.textContent = `${report.reasonScore} / 30`;
  if (b3Fill) b3Fill.style.width = `${Math.round((report.reasonScore / 30) * 100)}%`;

  // Strengths and Improvements lists
  const allStrengths = [];
  const allImprovements = [];
  report.questions.forEach((q) => {
    allStrengths.push(...q.strengths);
    allImprovements.push(...q.missing);
  });

  const strengthsListEl = getElement("feedback-strengths-list");
  const improvementsListEl = getElement("feedback-improvements-list");

  if (strengthsListEl) {
    strengthsListEl.innerHTML = [...new Set(allStrengths)]
      .slice(0, 3)
      .map((s) => `<li>${escapeHtml(s)}</li>`)
      .join("");
  }

  if (improvementsListEl) {
    improvementsListEl.innerHTML = [...new Set(allImprovements)]
      .slice(0, 3)
      .map((m) => `<li>${escapeHtml(m)}</li>`)
      .join("");
  }

  // Question-by-Question Cards
  const questionsContainer = getElement("feedback-questions-container");
  if (questionsContainer) {
    questionsContainer.innerHTML = report.questions
      .map(
        (q) => `
      <article class="review-card">
        <div class="review-card-header">
          <span class="review-q-number">Question ${q.questionNumber} (${escapeHtml(q.questionType)})</span>
          <span class="review-q-score tabular-nums">Score: ${q.score}/100</span>
        </div>
        <p class="review-q-text">${escapeHtml(q.questionText)}</p>

        <div class="review-user-answer-box">
          <div class="review-box-label">Your Submitted Answer:</div>
          <p class="review-box-content">${escapeHtml(q.userAnswer)}</p>
        </div>

        <div class="review-feedback-grid">
          <div class="feedback-col">
            <div class="feedback-col-label" style="color: var(--color-success);">Key Strengths</div>
            <p class="feedback-col-text">${q.strengths.map((s) => escapeHtml(s)).join(" ")}</p>
          </div>
          <div class="feedback-col">
            <div class="feedback-col-label" style="color: var(--color-warning);">Areas to Improve</div>
            <p class="feedback-col-text">${q.missing.map((m) => escapeHtml(m)).join(" ")}</p>
          </div>
        </div>

        <div class="model-answer-box">
          <div class="model-answer-label">Recommended Benchmark Answer:</div>
          <p class="model-answer-text">${escapeHtml(q.modelAnswer)}</p>
        </div>
      </article>
    `
      )
      .join("");
  }

  // Recommended Topics Pills
  const roleTopics = {
    "Frontend Developer": ["Reconciliation & Diffing", "Event Loop Microtasks", "Critical Rendering Path", "Component Isolation"],
    "Backend Developer": ["B-Tree Indexes", "Libuv Non-blocking I/O", "REST Caching & ETags", "Database Connection Pooling"],
    "Software Engineer": ["Contiguous Memory Arrays", "Distributed Caching (LRU/LFU)", "Horizontal Stateless Scaling", "Hash Collision Mitigation"],
    "Data Analyst": ["SQL Window Functions", "Outlier IQR & Imputation", "Pandas Vectorization", "Cohort Retention Analysis"],
    "Product Manager": ["RICE Prioritization", "Actionable vs Vanity Metrics", "A/B Testing Guardrails", "Customer Journey Mapping"],
    "General": ["STAR Behavioral Structure", "Conflict Mediation", "Quantifiable Impact Metrics", "Career Growth Roadmaps"]
  };

  const topicsContainer = getElement("feedback-topics-container");
  if (topicsContainer) {
    const topics = roleTopics[appState.config.role] || roleTopics["General"];
    topicsContainer.innerHTML = topics
      .map((t) => `<span class="topic-tag">${escapeHtml(t)}</span>`)
      .join("");
  }
}

// ----------------------------------------------------------------------------
// 9. UTILITY HELPERS
// ----------------------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ----------------------------------------------------------------------------
// 10. SAFE EVENT LISTENERS REGISTRATION
// ----------------------------------------------------------------------------
function registerEventListeners() {
  const bind = (id, event, handler) => {
    const el = getElement(id);
    if (el) {
      el.addEventListener(event, handler);
    }
  };

  // Nav triggers
  bind("nav-brand-btn", "click", (e) => {
    e.preventDefault();
    showView("landing");
  });
  bind("nav-start-btn", "click", () => showView("setup"));
  bind("hero-start-btn", "click", () => showView("setup"));
  bind("banner-start-btn", "click", () => showView("setup"));

  // Setup Form
  bind("setup-back-btn", "click", () => showView("landing"));
  bind("setup-form", "submit", handleSetupSubmit);

  // Interview Room Controls
  bind("room-answer-input", "input", () => {
    updateWordCount();
    const autosaveEl = getElement("room-autosave-indicator");
    if (autosaveEl) autosaveEl.textContent = "Unsaved changes...";
  });
  bind("room-answer-input", "blur", saveCurrentAnswer);

  bind("room-prev-btn", "click", handlePrevQuestion);
  bind("room-next-btn", "click", handleNextQuestion);
  bind("room-skip-btn", "click", handleSkipQuestion);

  // End Interview Modal
  const modal = getElement("modal-confirm-end");
  bind("room-end-btn", "click", () => {
    if (modal) modal.style.display = "flex";
  });
  bind("modal-cancel-btn", "click", () => {
    if (modal) modal.style.display = "none";
  });
  bind("modal-confirm-btn", "click", () => {
    if (modal) modal.style.display = "none";
    finishInterviewSession();
  });

  // Feedback Actions
  bind("feedback-new-btn", "click", () => showView("setup"));
  bind("feedback-retake-btn", "click", () => showView("setup"));

  // Nav section anchor links: ensure landing view is active when clicked from other views
  if (typeof document !== "undefined") {
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        showView("landing");
      });
    });
  }
}

// ----------------------------------------------------------------------------
// 11. ENVIRONMENT-SAFE INITIALIZATION
// ----------------------------------------------------------------------------
function initApp() {
  registerEventListeners();
  showView("landing");
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    // DOM is already ready (e.g. inside type="module")
    initApp();
  }
} else {
  // If executed directly in Node.js (e.g. `node script.js`)
  console.log("==================================================================");
  console.log("InterviewAI — Phase 1 Frontend Script");
  console.log("This is a browser script loaded automatically by index.html.");
  console.log("To run your development server and test in the browser, run:");
  console.log("    npm run dev    (or npm start)");
  console.log("==================================================================");
}
