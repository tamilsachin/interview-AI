/**
 * ============================================================================
 * InterviewAI — Core Application Logic (Phase 1 Frontend Prototype)
 * Architecture: Modular Vanilla JavaScript
 *
 * Designed for beginners: Clean separation of concerns
 * 1. Question Bank Data Store
 * 2. Application State Management
 * 3. View Routing (Single-Page transitions)
 * 4. Interview Session Engine (Timers, Navigation, Auto-saving)
 * 5. Demonstration Feedback & Rubric Scoring Engine
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
      },
      {
        id: "fe_tech_4",
        type: "State & Architecture",
        question: "When would you prefer local component state over a global state management solution, and what architectural pitfalls occur when global stores are overused?",
        guidance: "Explain prop drilling vs needless re-renders. Address separation of concerns.",
        rubric: {
          keyConcepts: ["component isolation", "unnecessary re-renders", "prop drilling", "tight coupling", "transient state"],
          modelAnswer: "Local state is preferred for transient UI data isolated to a single component or immediate parent-child pairs (e.g. form input values, modal visibility, hover states). Overusing global stores introduces tight coupling, makes components harder to test or reuse independently, and can cause widespread unnecessary re-renders when unrelated components subscribe to a shared global store slice."
        }
      },
      {
        id: "fe_tech_5",
        type: "Web Security",
        question: "What is Cross-Site Scripting (XSS), and how do modern frontend practices safeguard applications against it?",
        guidance: "Explain stored vs reflected XSS and how JSX/template escaping and Content Security Policies (CSP) prevent arbitrary script execution.",
        rubric: {
          keyConcepts: ["cross-site scripting", "injection", "context escaping", "dangerouslySetInnerHTML", "content security policy"],
          modelAnswer: "XSS occurs when malicious JavaScript is injected into trusted web pages and executed within victims' browsers. Modern frameworks protect by automatically escaping variables embedded in JSX/HTML by default. Developers must avoid raw HTML injection methods (like dangerouslySetInnerHTML), sanitize untrusted rich text with libraries like DOMPurify, and enforce a strict Content Security Policy (CSP) header prohibiting inline script execution."
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
          modelAnswer: "REST uses resource-based URL endpoints with standard HTTP verbs. It benefits from native HTTP caching (ETags, CDN support) and simple tooling, but can lead to over-fetching (receiving unneeded fields) or under-fetching (requiring multiple roundtrips). GraphQL allows clients to request exactly the shape of data required in a single POST query. REST is ideal for microservices and public endpoints where HTTP caching is vital, while GraphQL shines in complex client frontends demanding varied entity relationships."
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
      },
      {
        id: "be_tech_3",
        type: "Concurrency & Resilience",
        question: "What is the difference between synchronous blocking operations and asynchronous non-blocking I/O in Node.js? How do you prevent blocking the main thread?",
        guidance: "Mention libuv threadpool, CPU-intensive algorithms vs network I/O, and worker threads.",
        rubric: {
          keyConcepts: ["single thread", "event loop", "libuv", "cpu-bound vs io-bound", "worker threads"],
          modelAnswer: "Node.js runs user JavaScript on a single thread. For I/O operations (file reads, network sockets, DB queries), it delegates work to libuv and operating system kernel non-blocking hooks, returning execution immediately to the event loop. To avoid blocking the main thread, CPU-intensive workloads (cryptography, image compression, large JSON parsing) must be offloaded to Worker Threads or external background queues."
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
      },
      {
        id: "swe_tech_3",
        type: "Algorithms & Problem Solving",
        question: "How does caching work, and what are the most common cache replacement policies (e.g. LRU vs LFU)?",
        guidance: "Explain cache hits/misses, Least Recently Used with doubly linked lists and hash maps, and cache stampedes.",
        rubric: {
          keyConcepts: ["cache hit ratio", "least recently used (lru)", "least frequently used (lfu)", "doubly linked list", "ttl"],
          modelAnswer: "Caching places frequently queried data in fast, volatile memory (like RAM) to prevent repetitive slow computations or disk/database reads. When cache capacity is reached, eviction policies determine what gets pruned: Least Recently Used (LRU) evicts data accessed furthest in the past (implemented with a Hash Map + Doubly Linked List in O(1)), while Least Frequently Used (LFU) evicts items with the lowest access count."
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
  currentView: "landing", // 'landing' | 'setup' | 'interview' | 'feedback'
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
  answers: [], // Array of string answers matching questions index
  timer: {
    intervalId: null,
    totalSeconds: 900,
    remainingSeconds: 900,
    startTime: null,
    elapsedSeconds: 0
  }
};

// ----------------------------------------------------------------------------
// 3. DOM ELEMENT REFERENCES
// ----------------------------------------------------------------------------
const DOM = {
  // Views
  views: {
    landing: document.getElementById("view-landing"),
    setup: document.getElementById("view-setup"),
    interview: document.getElementById("view-interview"),
    feedback: document.getElementById("view-feedback")
  },

  // Landing triggers
  navBrandBtn: document.getElementById("nav-brand-btn"),
  navStartBtn: document.getElementById("nav-start-btn"),
  heroStartBtn: document.getElementById("hero-start-btn"),
  bannerStartBtn: document.getElementById("banner-start-btn"),

  // Setup View
  setupForm: document.getElementById("setup-form"),
  setupBackBtn: document.getElementById("setup-back-btn"),
  setupRole: document.getElementById("setup-role"),
  setupCategory: document.getElementById("setup-category"),
  setupExperience: document.getElementById("setup-experience"),
  setupDifficulty: document.getElementById("setup-difficulty"),
  setupCount: document.getElementById("setup-count"),
  setupDuration: document.getElementById("setup-duration"),
  setupJobDesc: document.getElementById("setup-job-desc"),
  setupError: document.getElementById("setup-error"),

  // Interview Room View
  roomRoleDisplay: document.getElementById("room-role-display"),
  roomCategoryDisplay: document.getElementById("room-category-display"),
  roomDifficultyDisplay: document.getElementById("room-difficulty-display"),
  roomTimerContainer: document.getElementById("room-timer-container"),
  roomTimerText: document.getElementById("room-timer-text"),
  roomEndBtn: document.getElementById("room-end-btn"),
  roomQuestionCounter: document.getElementById("room-question-counter"),
  roomProgressPercent: document.getElementById("room-progress-percent"),
  roomProgressFill: document.getElementById("room-progress-fill"),
  roomQuestionType: document.getElementById("room-question-type"),
  roomQuestionText: document.getElementById("room-question-text"),
  roomGuidanceText: document.getElementById("room-guidance-text"),
  roomAnswerInput: document.getElementById("room-answer-input"),
  roomWordCounter: document.getElementById("room-word-counter"),
  roomAutosaveIndicator: document.getElementById("room-autosave-indicator"),
  roomPrevBtn: document.getElementById("room-prev-btn"),
  roomSkipBtn: document.getElementById("room-skip-btn"),
  roomNextBtn: document.getElementById("room-next-btn"),

  // Modal
  modalConfirmEnd: document.getElementById("modal-confirm-end"),
  modalCancelBtn: document.getElementById("modal-cancel-btn"),
  modalConfirmBtn: document.getElementById("modal-confirm-btn"),

  // Feedback View
  feedbackRoleDisplay: document.getElementById("feedback-role-display"),
  feedbackCategoryDisplay: document.getElementById("feedback-category-display"),
  feedbackDifficultyDisplay: document.getElementById("feedback-difficulty-display"),
  feedbackTimeTaken: document.getElementById("feedback-time-taken"),
  feedbackOverallScore: document.getElementById("feedback-overall-score"),
  feedbackScoreRating: document.getElementById("feedback-score-rating"),
  scoreBar1Val: document.getElementById("score-bar-1-val"),
  scoreBar1Fill: document.getElementById("score-bar-1-fill"),
  scoreBar2Val: document.getElementById("score-bar-2-val"),
  scoreBar2Fill: document.getElementById("score-bar-2-fill"),
  scoreBar3Val: document.getElementById("score-bar-3-val"),
  scoreBar3Fill: document.getElementById("score-bar-3-fill"),
  feedbackStrengthsList: document.getElementById("feedback-strengths-list"),
  feedbackImprovementsList: document.getElementById("feedback-improvements-list"),
  feedbackQuestionsContainer: document.getElementById("feedback-questions-container"),
  feedbackTopicsContainer: document.getElementById("feedback-topics-container"),
  feedbackNewBtn: document.getElementById("feedback-new-btn"),
  feedbackRetakeBtn: document.getElementById("feedback-retake-btn")
};

// ----------------------------------------------------------------------------
// 4. VIEW ROUTING & TRANSITIONS
// ----------------------------------------------------------------------------
function showView(targetViewId) {
  // Update state
  appState.currentView = targetViewId;

  // Toggle active class on screen containers
  Object.keys(DOM.views).forEach((key) => {
    if (key === targetViewId) {
      DOM.views[key].classList.add("active");
    } else {
      DOM.views[key].classList.remove("active");
    }
  });

  // Scroll to top of window for seamless transition
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ----------------------------------------------------------------------------
// 5. SETUP CONTROLLER & QUESTION SELECTION
// ----------------------------------------------------------------------------
function handleSetupSubmit(event) {
  event.preventDefault();

  // Validate inputs
  const role = DOM.setupRole.value.trim();
  const category = DOM.setupCategory.value.trim();
  const experience = DOM.setupExperience.value.trim();
  const difficulty = DOM.setupDifficulty.value.trim();
  const count = parseInt(DOM.setupCount.value, 10) || 3;
  const durationMinutes = parseInt(DOM.setupDuration.value, 10);
  const jobDescription = DOM.setupJobDesc.value.trim();

  if (!role || !category) {
    DOM.setupError.textContent = "Please select both a target job role and an interview category.";
    DOM.setupError.style.display = "block";
    return;
  }

  DOM.setupError.style.display = "none";

  // Save config
  appState.config = {
    role,
    category,
    experience,
    difficulty,
    count,
    durationMinutes,
    jobDescription
  };

  // Build question list based on role & category
  appState.questions = selectQuestionsForSession(role, category, count);
  appState.currentIndex = 0;
  appState.answers = new Array(appState.questions.length).fill("");

  // Initialize Interview Room
  initInterviewRoom();
  showView("interview");
}

function selectQuestionsForSession(role, category, count) {
  let pool = [];

  // If Behavioral, pick from General HR
  if (category === "HR & Behavioral") {
    pool = QUESTION_BANK["General"]["HR & Behavioral"] || [];
  } else {
    // Check specific role technical pool
    if (QUESTION_BANK[role] && QUESTION_BANK[role]["Technical"]) {
      pool = QUESTION_BANK[role]["Technical"];
    } else if (QUESTION_BANK["Software Engineer"]["Technical"]) {
      pool = QUESTION_BANK["Software Engineer"]["Technical"];
    }
  }

  // Fallback to general software questions if pool empty
  if (pool.length === 0) {
    pool = QUESTION_BANK["Software Engineer"]["Technical"];
  }

  // Shuffle and slice to desired count
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ----------------------------------------------------------------------------
// 6. INTERVIEW ROOM CONTROLLER
// ----------------------------------------------------------------------------
function initInterviewRoom() {
  // Set header metadata
  DOM.roomRoleDisplay.textContent = appState.config.role;
  DOM.roomCategoryDisplay.textContent = appState.config.category;
  DOM.roomDifficultyDisplay.textContent = appState.config.difficulty;

  // Initialize timer
  initTimer(appState.config.durationMinutes);

  // Load first question
  loadQuestion(appState.currentIndex);
}

function loadQuestion(index) {
  const total = appState.questions.length;
  const q = appState.questions[index];

  if (!q) return;

  // Update counters and progress
  const questionNum = index + 1;
  DOM.roomQuestionCounter.textContent = `Question ${questionNum} of ${total}`;

  const percent = Math.round((questionNum / total) * 100);
  DOM.roomProgressPercent.textContent = `${percent}% Completed`;
  DOM.roomProgressFill.style.width = `${percent}%`;

  // Update question content
  DOM.roomQuestionType.textContent = q.type || "Interview Prompt";
  DOM.roomQuestionText.textContent = q.question;
  DOM.roomGuidanceText.textContent = q.guidance || "Answer clearly with reasoning and examples.";

  // Restore preserved answer
  DOM.roomAnswerInput.value = appState.answers[index] || "";
  updateWordCount();

  // Update button states
  DOM.roomPrevBtn.disabled = index === 0;

  if (index === total - 1) {
    DOM.roomNextBtn.textContent = "Submit & View Report ✓";
  } else {
    DOM.roomNextBtn.textContent = "Save & Next Question →";
  }

  // Reset autosave badge
  DOM.roomAutosaveIndicator.textContent = "Saved locally";
  DOM.roomAnswerInput.focus();
}

function saveCurrentAnswer() {
  const text = DOM.roomAnswerInput.value.trim();
  appState.answers[appState.currentIndex] = text;
  DOM.roomAutosaveIndicator.textContent = "Saved locally";
}

function handleNextQuestion() {
  saveCurrentAnswer();

  if (appState.currentIndex < appState.questions.length - 1) {
    appState.currentIndex++;
    loadQuestion(appState.currentIndex);
  } else {
    // Reached final question -> Complete interview
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
  DOM.roomAnswerInput.value = "";
  appState.answers[appState.currentIndex] = "[Question skipped by candidate]";
  handleNextQuestion();
}

function updateWordCount() {
  const text = DOM.roomAnswerInput.value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  DOM.roomWordCounter.textContent = `${words} word${words === 1 ? "" : "s"}`;
}

// ----------------------------------------------------------------------------
// 7. TIMER ENGINE
// ----------------------------------------------------------------------------
function initTimer(durationMinutes) {
  // Clear any existing timer
  if (appState.timer.intervalId) {
    clearInterval(appState.timer.intervalId);
    appState.timer.intervalId = null;
  }

  if (durationMinutes <= 0) {
    // Untimed session
    DOM.roomTimerContainer.style.display = "none";
    appState.timer.remainingSeconds = 0;
    appState.timer.startTime = Date.now();
    return;
  }

  DOM.roomTimerContainer.style.display = "flex";
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
      alert("Session time is up! Generating your demonstration report...");
      finishInterviewSession();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(appState.timer.remainingSeconds / 60);
  const secs = appState.timer.remainingSeconds % 60;
  DOM.roomTimerText.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // If under 2 minutes, turn highlight amber
  if (appState.timer.remainingSeconds <= 120) {
    DOM.roomTimerContainer.style.color = "#f59e0b";
    DOM.roomTimerContainer.style.borderColor = "rgba(245, 158, 11, 0.4)";
  } else {
    DOM.roomTimerContainer.style.color = "var(--accent-cyan)";
    DOM.roomTimerContainer.style.borderColor = "rgba(6, 182, 212, 0.25)";
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

  // Calculate elapsed time
  const elapsed = appState.timer.startTime
    ? Math.max(1, Math.floor((Date.now() - appState.timer.startTime) / 1000))
    : 120;
  appState.timer.elapsedSeconds = elapsed;

  // Run rubric evaluation on answers
  const report = evaluateSessionAnswers(appState.questions, appState.answers);

  // Render evaluation report UI
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

    if (isSkipped) {
      questionScore = 20; // baseline for attempt
      strengths.push("Question was reviewed during the mock round.");
      missing.push("No answer was submitted. Key concepts were not addressed.");
    } else {
      const words = rawAnswer.split(/\s+/).filter(Boolean).length;
      const lowerAnswer = rawAnswer.toLowerCase();

      // Check key concepts matching from rubric
      const rubricConcepts = q.rubric.keyConcepts || [];
      let conceptsFound = 0;

      rubricConcepts.forEach((concept) => {
        const wordsInConcept = concept.toLowerCase().split(" ");
        const match = wordsInConcept.some((w) => lowerAnswer.includes(w));
        if (match) {
          conceptsFound++;
        }
      });

      // Scoring formula: Length & Concept completeness
      let conceptScore = (conceptsFound / Math.max(1, rubricConcepts.length)) * 50;
      let depthScore = Math.min(35, words * 0.7); // Reward thorough answers
      let structureScore = 15; // Baseline coherence

      questionScore = Math.min(96, Math.max(45, Math.round(conceptScore + depthScore + structureScore)));

      // Extract specific feedback
      if (words > 40) {
        strengths.push("Good descriptive depth and willingness to elaborate on technical rationale.");
      } else {
        strengths.push("Concise response addressing the main topic.");
      }

      if (conceptsFound >= 2) {
        strengths.push(`Successfully touched upon core concepts: ${rubricConcepts.slice(0, 2).join(", ")}.`);
      } else {
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
      questionType: q.type,
      userAnswer: isSkipped ? "(Question Skipped)" : rawAnswer,
      score: questionScore,
      strengths: strengths.length ? strengths : ["Demonstrated baseline understanding."],
      missing: missing.length ? missing : ["Could explore scale and performance trade-offs."],
      modelAnswer: q.rubric.modelAnswer
    });
  });

  const overallScore = Math.round(totalScoreSum / Math.max(1, questions.length));

  // Dimensional sub-scores
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
  // Metadata header
  DOM.feedbackRoleDisplay.textContent = appState.config.role;
  DOM.feedbackCategoryDisplay.textContent = appState.config.category;
  DOM.feedbackDifficultyDisplay.textContent = appState.config.difficulty;

  const mins = Math.floor(report.timeSpent / 60);
  const secs = report.timeSpent % 60;
  DOM.feedbackTimeTaken.textContent = `Time: ${mins}m ${secs}s`;

  // Overall Score
  DOM.feedbackOverallScore.textContent = report.overallScore;

  if (report.overallScore >= 85) {
    DOM.feedbackScoreRating.textContent = "Excellent Performance";
    DOM.feedbackScoreRating.style.color = "var(--color-success)";
  } else if (report.overallScore >= 70) {
    DOM.feedbackScoreRating.textContent = "Strong Demonstration";
    DOM.feedbackScoreRating.style.color = "var(--accent-cyan-light)";
  } else {
    DOM.feedbackScoreRating.textContent = "Needs Practice";
    DOM.feedbackScoreRating.style.color = "var(--color-warning)";
  }

  // Rubric Bars
  DOM.scoreBar1Val.textContent = `${report.techScore} / 40`;
  DOM.scoreBar1Fill.style.width = `${Math.round((report.techScore / 40) * 100)}%`;

  DOM.scoreBar2Val.textContent = `${report.commScore} / 30`;
  DOM.scoreBar2Fill.style.width = `${Math.round((report.commScore / 30) * 100)}%`;

  DOM.scoreBar3Val.textContent = `${report.reasonScore} / 30`;
  DOM.scoreBar3Fill.style.width = `${Math.round((report.reasonScore / 30) * 100)}%`;

  // Overall Strengths and Improvements lists
  const allStrengths = [];
  const allImprovements = [];
  report.questions.forEach((q) => {
    allStrengths.push(...q.strengths);
    allImprovements.push(...q.missing);
  });

  DOM.feedbackStrengthsList.innerHTML = [...new Set(allStrengths)]
    .slice(0, 3)
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");

  DOM.feedbackImprovementsList.innerHTML = [...new Set(allImprovements)]
    .slice(0, 3)
    .map((m) => `<li>${escapeHtml(m)}</li>`)
    .join("");

  // Question-by-Question Cards
  DOM.feedbackQuestionsContainer.innerHTML = report.questions
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

  // Recommended Topics Pills
  const roleTopics = {
    "Frontend Developer": ["Reconciliation & Diffing", "Event Loop Microtasks", "Critical Rendering Path", "Component Isolation"],
    "Backend Developer": ["B-Tree Indexes", "Libuv Non-blocking I/O", "REST Caching & ETags", "Database Connection Pooling"],
    "Software Engineer": ["Contiguous Memory Arrays", "Distributed Caching (LRU/LFU)", "Horizontal Stateless Scaling", "Hash Collision Mitigation"],
    "General": ["STAR Behavioral Structure", "Conflict Mediation", "Quantifiable Impact Metrics", "Career Growth Roadmaps"]
  };

  const topics = roleTopics[appState.config.role] || roleTopics["General"];
  DOM.feedbackTopicsContainer.innerHTML = topics
    .map((t) => `<span class="topic-tag">${escapeHtml(t)}</span>`)
    .join("");
}

// ----------------------------------------------------------------------------
// 9. UTILITY HELPERS
// ----------------------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ----------------------------------------------------------------------------
// 10. EVENT LISTENERS
// ----------------------------------------------------------------------------
function registerEventListeners() {
  // Navigation Bar Triggers
  DOM.navBrandBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showView("landing");
  });

  DOM.navStartBtn.addEventListener("click", () => showView("setup"));
  DOM.heroStartBtn.addEventListener("click", () => showView("setup"));
  DOM.bannerStartBtn.addEventListener("click", () => showView("setup"));

  // Setup Form
  DOM.setupBackBtn.addEventListener("click", () => showView("landing"));
  DOM.setupForm.addEventListener("submit", handleSetupSubmit);

  // Interview Room Controls
  DOM.roomAnswerInput.addEventListener("input", () => {
    updateWordCount();
    DOM.roomAutosaveIndicator.textContent = "Unsaved changes...";
  });

  // Autosave on blur
  DOM.roomAnswerInput.addEventListener("blur", saveCurrentAnswer);

  DOM.roomPrevBtn.addEventListener("click", handlePrevQuestion);
  DOM.roomNextBtn.addEventListener("click", handleNextQuestion);
  DOM.roomSkipBtn.addEventListener("click", handleSkipQuestion);

  // End Interview Modal
  DOM.roomEndBtn.addEventListener("click", () => {
    DOM.modalConfirmEnd.style.display = "flex";
  });

  DOM.modalCancelBtn.addEventListener("click", () => {
    DOM.modalConfirmEnd.style.display = "none";
  });

  DOM.modalConfirmBtn.addEventListener("click", () => {
    DOM.modalConfirmEnd.style.display = "none";
    finishInterviewSession();
  });

  // Feedback Actions
  DOM.feedbackNewBtn.addEventListener("click", () => showView("setup"));
  DOM.feedbackRetakeBtn.addEventListener("click", () => showView("setup"));
}

// ----------------------------------------------------------------------------
// 11. INITIALIZATION ON PAGE LOAD
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  registerEventListeners();
  showView("landing");
});
