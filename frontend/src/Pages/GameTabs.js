import React, { useState, useEffect, useRef } from "react";
import "./GameTabs.css";
import Firework from "./Firework";
import axios from 'axios';
import { useToast } from "../components/Toast";

const coinText = (n) => `You earned ${n} coin${n === 1 ? '' : 's'}!`;

const GameTabs = () => {
  const toast = useToast();
  const chipNavRef = useRef(null);
  // 🆕 Synonym Quiz States
  // Add these lines near your other useState declarations // Used for loading status
const [showNextAnalogyButton, setShowNextAnalogyButton] = useState(false);
// GameTabs.js - Near your other useState calls
const [requestNextAntonym, setRequestNextAntonym] = useState(0); // Fixes Line 891, 914, 1439
  const [solvedCrosswords, setSolvedCrosswords] = useState([]); 
// This could be an array of crossword IDs the user has already completed
const [requestNextPuzzle, setRequestNextPuzzle] = useState(0);
  const [currentCrosswordId, setCurrentCrosswordId] = useState(null);
  const [loadingSynonym, setSynonymLoading] = useState(false);
const [crosswordCompleted, setCrosswordCompleted] = useState(false);
const [showNextButton, setShowNextButton] = useState(false);
  const [antonymPuzzle, setAntonymPuzzle] = useState(null);
const [loadingAntonym, setLoadingAntonym] = useState(true);
const [antonymError, setAntonymError] = useState(null);
const [antonymSelected, setAntonymSelected] = useState(null);
const [antonymResult, setAntonymResult] = useState("");
const [antonymLocked, setAntonymLocked] = useState(false);
const [synonymPuzzle, setSynonymPuzzle] = useState(null);
const [synonymSelected, setSynonymSelected] = useState("");
const [synonymResult, setSynonymResult] = useState("");

const [synonymError, setSynonymError] = useState(null);
const [synonymLocked, setSynonymLocked] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
   const [crosswordLetters, setCrosswordLetters] = useState([]);
   const [correctWord, setCorrectWord] = useState('');
   const [crosswordHint, setCrosswordHint] = useState('');
const [crosswordResult, setCrosswordResult] = useState('');
const [loading, setLoading] = useState(true);
const [hintIndex, setHintIndex] = useState(null); 
const [givenMask, setGivenMask] = useState([]); // true for letters the puzzle gives you
const [loadingSequence, setLoadingSequence] = useState(false);
const [sequenceLoading, setSequenceLoading] = useState(false);
const [popupMessage, setPopupMessage] = useState("");
  const [coin, setCoin] = useState(0);
  const [sudokuResult, setSudokuResult] = useState('');
  const [techQuiz, setTechQuiz] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]); // To store the top players list
const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
const [leaderboardError, setLeaderboardError] = useState(null);
  const [loadingTech, setLoadingTech] = useState(false);
  const [techError, setTechError] = useState(null);
  const [techSelectedAnswerIndex, setTechSelectedAnswerIndex] = useState(null);
const [techQuizLocked, setTechQuizLocked] = useState(false);
const [techQuizResult, setTechQuizResult] = useState('');
const [requestNextTechQuiz, setRequestNextTechQuiz] = useState(0);
const [loadingSudoku, setLoadingSudoku] = useState(false);
const [fetchError, setFetchError] = useState(null);
const [sudokuPuzzle, setSudokuPuzzle] = useState(null);
const [userBoard, setUserBoard] = useState(null); 
const [initialBoard, setInitialBoard] = useState(null);
  const [showFirework, setShowFirework] = useState(false);
  const [crosswordTimeLeft, setCrosswordTimeLeft] = useState(120);

  const [activeTab, setActiveTab] = useState("crossword");
  // Tracks which tabs have been opened, so each game loads only when its tab is first visited
  const [visitedTabs, setVisitedTabs] = useState({ crossword: true });
  useEffect(() => {
    setVisitedTabs(prev => (prev[activeTab] ? prev : { ...prev, [activeTab]: true }));
    const active = chipNavRef.current?.querySelector('.chip.active');
    if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeTab]);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  // Top-level hooks in GameTabs
  const [nbackSequence, setNbackSequence] = useState([]);
  const [nbackIndex, setNbackIndex] = useState(0);
  const [nbackUserInput, setNbackUserInput] = useState([]);
  const [nbackScore, setNbackScore] = useState(0);
const userPhoneNumber = localStorage.getItem("phoneNumber");
  // Initialize sequence once when component mounts
  const [sequencePuzzle, setSequencePuzzle] = useState(null);
    const [sequenceAnswer, setSequenceAnswer] = useState(''); // User's input
    const [sequenceResult, setSequenceResult] = useState('');
   
    const [sequenceError, setSequenceError] = useState(null);
    const [sequenceLocked, setSequenceLocked] = useState(false);



    // 🆕 Analogy Quiz States (Updated to match new model)
   const [analogyPuzzle, setAnalogyPuzzle] = useState(null);
    // Tracks the user's selected option by its index (0, 1, 2, or 3)
    const [analogySelectedAnswerIndex, setAnalogySelectedAnswerIndex] = useState(null); 
    const [analogyResult, setAnalogyResult] = useState('');
    const [loadingAnalogy, setLoadingAnalogy] = useState(false);
    const [analogyError, setAnalogyError] = useState(null);
    const [analogyLocked, setAnalogyLocked] = useState(false);
    useEffect(() => {
    // Only run if the Antonym tab is the current or initial one
    if (activeTab === 'antonym') {
        loadLatestAntonym();
    }
}, [activeTab]);
    // (The login token is now added to every request in src/api.js)
  useEffect(() => {
    const seq = Array.from({ length: 10 }, () => Math.floor(Math.random() * 9) + 1);
    setNbackSequence(seq);
  }, []);
const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};

const closeSidebar = () => {
  setSidebarOpen(false);
};

const handleTabClick = (tabName) => {
  setActiveTab(tabName);
  closeSidebar();
};

useEffect(() => {
  const fetchCoins = async () => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    
    if (!phoneNumber) {
      console.error("No phone number found");
      return;
    }

    try {
      // Use the same pattern as your other API calls
      const base = process.env.REACT_APP_BACKENDURL || '';
      const res = await axios.get(`${base}/api/user/coin`, {
        params: { phoneNumber }
        // Token is automatically added by the interceptor
      });
      setCoin(res.data.coins);
    } catch (err) {
      console.error("Failed to fetch coins:", err.response?.data || err.message);
    }
  };

  fetchCoins();
}, []);

// 🎯 CORRECT CROSSWORD FETCHING LOGIC (Persistence Fix)
useEffect(() => {
    let mounted = true;
    const fetchUnsolvedCrossword = async () => {
        const phoneNumber = localStorage.getItem("phoneNumber");
        if (!phoneNumber) {
            if (mounted) setLoading(false);
            setCrosswordResult("Authentication required. Please log in.");
            return;
        }

        try {
            if (mounted) setLoading(true);
            const base = process.env.REACT_APP_BACKENDURL || '';

            // 💡 Backend returns the next UNSOLVED puzzle for this user, or 'puzzle: null' if all are solved.
            const url = `${base}/api/crossword?phoneNumber=${phoneNumber}`;
            const res = await axios.get(url);

            if (!mounted) return;

            // --- CRITICAL PERSISTENCE CHECK ---
            if (res.data.puzzle === null) {
                // Case 1: All solved or no puzzles available
                setCrosswordResult("🎉 You've completed all available crosswords! Check back later for new challenges.");
                setCurrentCrosswordId(null);
                setCrosswordCompleted(true); // <-- LOCKS THE GRID and triggers the new rendering logic
                setShowNextButton(false);
                
            } else {
                // Case 2: Unsolved puzzle found
                const { _id, initialLetters, hint } = res.data;
                
                setCurrentCrosswordId(_id);
                setCrosswordHint(hint);

                const hintPos = initialLetters.findIndex(l => l);
                setHintIndex(hintPos);

                setCrosswordLetters(initialLetters.map(l => l || ""));
                setGivenMask(initialLetters.map(l => !!l));
                setCrosswordTimeLeft(120);
                setCrosswordCompleted(false); // Enable input fields
                setShowNextButton(false);
                setCrosswordResult('');
            }

        } catch (err) {
            console.error('❌ Failed to load crossword:', err.response?.data || err.message);
            setCrosswordResult("❌ Failed to load crossword. Server error.");
        } finally {
            if (mounted) setLoading(false);
        }
    };

    fetchUnsolvedCrossword();
    return () => { mounted = false; };
}, [requestNextPuzzle]); // Runs on load and when the "Next Puzzle" button is clicked // Assuming this fetches the current/next puzzle


useEffect(() => {
    if (activeTab !== 'scoreboard') return;
    let mounted = true;
    const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        setLeaderboardError(null);
        try {
            const base = process.env.REACT_APP_BACKENDURL || '';
            // 💡 IMPORTANT: Ensure your backend has this route set up!
            const res = await axios.get(`${base}/api/top-players`); 

            if (!mounted) return;
          
            if (Array.isArray(res.data)) {
                setLeaderboard(res.data);
            } else {
                setLeaderboardError("Invalid leaderboard data format.");
            }
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
            setLeaderboardError('Failed to load leaderboard. Server error.');
        } finally {
            if (mounted) setLoadingLeaderboard(false);
        }
    };

    fetchLeaderboard();
    return () => { mounted = false; };
}, [activeTab]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
// GameTabs.js - Antonym Fetch Logic (REPLACE YOUR EXISTING ONE)
// GameTabs.js - Antonym Fetch Logic (THE CORRECT AND ONLY useEffect for Antonym)
useEffect(() => {
    let mounted = true;
    const base = process.env.REACT_APP_BACKENDURL || '';
    const phoneNumber = userPhoneNumber;

    async function fetchAntonym() {
        // Only run fetch if we are on the Antonym tab and the phone number is available
        if (activeTab !== 'antonym' || !phoneNumber) return; 

        setLoadingAntonym(true);
        setAntonymError(null);
        setAntonymLocked(false);
        setAntonymResult("");
        setAntonymSelected(null);
        setAntonymPuzzle(null); // Clear previous puzzle data while fetching

        try {
            const res = await axios.get(`${base}/api/antonym`, {
                params: { phoneNumber: phoneNumber }
            });

            if (!mounted) return;

            const quizData = res.data.quiz;// Use 'puzzle' key as per your provided logic
            const message = res.data.message;
            console.log("quiz data is ",quizData);
            if (quizData) {
                const isSolvedLocally = localStorage.getItem(`antonym-${quizData._id}`) === 'solved';

                setAntonymPuzzle(quizData);

                if (isSolvedLocally || res.data.isSolvedOnServer) {
                    setAntonymLocked(true); 
                    setAntonymResult("✅ This Antonym quiz has already been solved.");
                } else {
                    setAntonymLocked(false);
                }
            } else if (message) {
                // All solved or no quiz found
                setAntonymPuzzle(null);
                setAntonymLocked(true);
                setAntonymResult(message);
            } else {
                setAntonymError("No Antonym Quiz available.");
            }
        } catch (err) {
            if (mounted) {
                const errorMessage = err.response?.data?.error || 'Unknown network error.';
                console.error("Antonym Fetch Error:", errorMessage);
                setAntonymError(`Failed to load quiz: ${errorMessage}`);
                setAntonymPuzzle(null);
            }
        } finally {
            if (mounted) setLoadingAntonym(false);
        }
    }

    fetchAntonym();

    return () => { mounted = false; };
// 🔑 CRITICAL FIX: Added requestNextAntonym to dependency array
}, [userPhoneNumber, activeTab, requestNextAntonym]); // Re-fetch when userPhoneNumber is ready or tab changes

// End of corrected Antonym Fetch Logic
const handleTechQuizAnswer = async (selectedIndex) => {
    // Prevent clicking if already locked or loading
    if (techQuizLocked || !techQuiz || loadingTech) {
        return;
    }
    
    // Set the selected answer index immediately for visual feedback
    setTechSelectedAnswerIndex(selectedIndex); 

    try {
        setTechQuizResult("Checking answer...");
        const base = process.env.REACT_APP_BACKENDURL || '';
        const puzzleId = techQuiz._id;

        // 1. Send the selected index to the backend for checking
        const res = await axios.post(`${base}/api/tech-quiz/check-answer`, {
            phoneNumber: userPhoneNumber,
            quizId: puzzleId,
            selectedAnswerIndex: selectedIndex // 🛑 Send the index
        });

        if (res.data.isCorrect) {
            setTechQuizLocked(true);
            // Optionally store status in local storage, although the server tracking is primary
            // localStorage.setItem(`techquiz-${puzzleId}`, 'solved'); 

            if (res.data.coinsAwarded > 0) {
                setCoin(prev => prev + res.data.coinsAwarded);
                setShowFirework(true);
                setTimeout(() => setShowFirework(false), 10000);
                setTechQuizResult(`✅ Correct! You earned ${res.data.coinsAwarded} coin(s)!`);
                toast.coin(coinText(res.data.coinsAwarded)); 
            } else {
                setTechQuizResult("✅ Correct! (Coin already awarded)");
            }

        } else {
            // If incorrect, show result but keep unlocked for another try
            setTechQuizResult("❌ Incorrect answer. Try again!");
        }
    } catch (err) {
        console.error('Tech Quiz check failed:', err);
        setTechQuizResult('Failed to communicate with the server.');
    }
};

const loadNextTechQuiz = () => {
    setTechQuiz(null);
    setTechQuizLocked(false);
    setTechQuizResult('');
    setTechSelectedAnswerIndex(null);
    // Trigger the fetch logic
    setRequestNextTechQuiz(prev => prev + 1);
};
const fetchSequenceQuiz = async (overrideTabCheck = false) => {
    // ⚠️ Assuming 'activeTab' and 'userPhoneNumber' are available in scope
    if (!overrideTabCheck && activeTab !== 'memory') return;
    if (!userPhoneNumber) return; 

    const base = process.env.REACT_APP_BACKENDURL || '';

    // Reset state before fetching
    setSequenceLoading(true);
    setSequenceError(null);
    setSequenceResult("");
    setSequenceLocked(false);
    setSequencePuzzle(null); 
    setSequenceAnswer(''); 

    try {
        const res = await axios.get(`${base}/api/sequence`, {
            params: { phoneNumber: userPhoneNumber }
        });

        const quizData = res.data.quiz; 
        const message = res.data.message;
          console.log("sequencdd is ",quizData);
        if (quizData) {
            // Unsolved quiz found
            setSequencePuzzle(quizData);
            setSequenceLocked(false);
        } else if (message) {
            // All solved or no quiz found (message from backend)
            setSequenceResult(message); 
            setSequenceLocked(true); // Lock as there's nothing new to solve
        } else {
            setSequenceError("No Number Sequence Quiz available.");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.error || 'Unknown network error.';
        console.error("Sequence Fetch Error:", errorMessage);
        setSequenceError(`Failed to load quiz: ${errorMessage}`);
        setSequencePuzzle(null);
    } finally {
        setSequenceLoading(false);
    }
};
const handleLogout = () => {
  // Clear authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("phoneNumber");
  localStorage.removeItem("role");
  
  // Optional: Clear game progress (remove if you want progress to persist)
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('crossword-') || 
      key.startsWith('synonym-') || 
      key.startsWith('antonym-') ||
      key.startsWith('sequence-') || 
      key.startsWith('analogy-')
    )) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log("🔓 Logout: Cleared authentication and game progress");
  window.location.href = "/login";
};

  // ---------------- Memory Match Effect (Checking for match/mismatch) ----------------
 
  // Inside GameTabs component

// 🆕 New useEffect to fetch the latest Tech Quiz
useEffect(() => {
    let mounted = true;
    const base = process.env.REACT_APP_BACKENDURL || '';
    
    // ⚠️ IMPORTANT: Replace 'userPhoneNumber' with the actual variable holding the phone number.
    // It must be available in the component's scope (e.g., from props, context, or useState).
    const phoneNumber = userPhoneNumber; 

    async function fetchAnalogy() {
        if (!phoneNumber) {
            // Guard against making the request if the phone number isn't ready
            console.error("Cannot fetch analogy: Phone number is missing.");
            setAnalogyError("Authentication failed: Phone number not available.");
            setLoadingAnalogy(false);
            return;
        }

        setLoadingAnalogy(true);
        try {
            // ✅ FIX 1: Pass phoneNumber as a query parameter
            const res = await axios.get(`${base}/api/analogy`, {
                params: {
                    phoneNumber: phoneNumber 
                }
            }); 

            if (!mounted) return;
            
            // ✅ FIX 2: Access the puzzle from the 'puzzle' key, as returned by the backend
            const puzzleData = res.data.puzzle;
            const message = res.data.message;

            if (puzzleData) {
                setAnalogyPuzzle(puzzleData);
                // Reset any previous "all solved" messages
                setAnalogyResult("");
            } else if (message) {
                // Handle the case where the backend says "All quizzes solved" (puzzle: null)
                setAnalogyPuzzle(null); 
                setAnalogyResult(message); 
            } else {
                 // Should not happen, but safe fallback
                setAnalogyPuzzle(null);
                setAnalogyResult("No Analogy Quiz available today.");
            }
            
            setAnalogyError(null); // Clear any previous error
            
        } catch (err) {
            if (mounted) {
                const errorMessage = err.response?.data?.error || 'Unknown network error.';
                console.error("Analogy Fetch Error:", errorMessage);
                setAnalogyError(`Failed to load quiz: ${errorMessage}`);
                setAnalogyPuzzle(null);
            }
        } finally {
            if (mounted) setLoadingAnalogy(false);
        }
    }
    
    if (!visitedTabs.nback) return;
    fetchAnalogy();

    return () => { mounted = false; };
// ⚠️ Ensure 'phoneNumber' is in the dependency array if it can change over time
}, [userPhoneNumber, visitedTabs.nback]);
useEffect(() => {
    // 🛑 CRITICAL: We only call the fetch function if the tab is active
    // and the phone number (user identity) is available.
    if (activeTab === 'memory' && userPhoneNumber) {
        // Calls the external function to fetch the next unsolved quiz
        fetchSequenceQuiz(); 
        console.log("fetch quiz is heated");
    }
    
    // ⚠️ NOTE: If fetchSequenceQuiz is not wrapped in React.useCallback, 
    // you should include it in the dependency array to satisfy ESLint warnings.
    // If it *is* wrapped in useCallback, ensure that fetchSequenceQuiz's dependencies 
    // are correct (activeTab, userPhoneNumber, and all state setters it uses).
    // For simplicity, assuming dependencies are handled correctly within the function's definition scope:
}, [userPhoneNumber, activeTab]);
// (Duplicate coin-balance fetch removed: coins are already loaded once above)
  // ---------------- Memory Match Handlers ----------------
  // Add this block inside your main quiz component (e.g., QuizDashboard.js)

useEffect(() => {
    let mounted = true;
    const base = process.env.REACT_APP_BACKENDURL || '';

    // Define the fetch function inside useEffect to ensure it uses the latest state/props
    async function fetchSynonym() {
        // Only run fetch if we are on the Synonym tab and the phone number is available
        if (activeTab !== 'synonym' || !userPhoneNumber) return; 

        fetchSynonymQuiz();
    
        // Reset state before fetching
        setSynonymLoading(true);
        setSynonymError(null);
        setSynonymSelected(null);
        setSynonymResult("");
        setSynonymLocked(false);
        setSynonymPuzzle(null); 

        try {
            const res = await axios.get(`${base}/api/synonym`, {
                params: { phoneNumber: userPhoneNumber }
            });

            if (!mounted) return;

            // 🔑 CRITICAL: Use the 'quiz' key from the backend response
            const quizData = res.data.quiz; 
            const message = res.data.message;

            if (quizData) {
                setSynonymPuzzle(quizData);
                setSynonymLocked(false);
            } else if (message) {
                // All solved or no quiz found
                setSynonymResult(message); 
                setSynonymLocked(true);
            } else {
                setSynonymError("No Synonym Quiz available.");
            }
        } catch (err) {
            if (mounted) {
                const errorMessage = err.response?.data?.error || 'Unknown network error.';
                console.error("Synonym Fetch Error:", errorMessage);
                setSynonymError(`Failed to load quiz: ${errorMessage}`);
                setSynonymPuzzle(null);
            }
        } finally {
            if (mounted) setSynonymLoading(false);
        }
    }

    fetchSynonym();

    // Cleanup function to prevent state update on unmounted component
    return () => { mounted = false; };
// Dependency array: Re-run when the phone number is set or the tab changes
}, [userPhoneNumber, activeTab]);
  // --- Handler for Synonym Answer (like analogy) ---
// Corrected handleSynonymAnswer function:
// Define this function in the main body of your functional component (e.g., GameTabs.js)
// NOTE: It needs access to all the state setters (setSynonymLoading, setSynonymPuzzle, etc.)
// and props (userPhoneNumber, activeTab).

const fetchSynonymQuiz = async (overrideTabCheck = false) => {
    // Only run fetch if we are on the Synonym tab and the phone number is available
    // 'overrideTabCheck' is used when calling after a successful submit (we want to fetch immediately)
    if (!overrideTabCheck && activeTab !== 'synonym') return;
    if (!userPhoneNumber) return; 

    const base = process.env.REACT_APP_BACKENDURL || '';

    // Reset state before fetching
    setSynonymLoading(true);
    setSynonymError(null);
    setSynonymSelected(null);
    setSynonymResult("");
    setSynonymLocked(false);
    setSynonymPuzzle(null); 

    try {
        const res = await axios.get(`${base}/api/synonym`, {
            params: { phoneNumber: userPhoneNumber }
        });

        const quizData = res.data.quiz; 
        const message = res.data.message;

        if (quizData) {
            setSynonymPuzzle(quizData);
            setSynonymLocked(false);
        } else if (message) {
            // All solved or no quiz found
            setSynonymResult(message); 
            setSynonymLocked(true);
        } else {
            setSynonymError("No Synonym Quiz available.");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.error || 'Unknown network error.';
        console.error("Synonym Fetch Error:", errorMessage);
        setSynonymError(`Failed to load quiz: ${errorMessage}`);
        setSynonymPuzzle(null);
    } finally {
        setSynonymLoading(false);
    }
};
const handleSynonymAnswer = async (selectedIndex) => {
    // 1. Initial Validation & Guard Clauses
    if (synonymLocked || !synonymPuzzle || loadingSynonym) return;
    
    // Defensive check
    if (!synonymPuzzle._id) { 
        console.error("Synonym Puzzle object is missing the '_id'. Cannot submit.");
        setSynonymResult("Error: Cannot submit, puzzle data is incomplete.");
        return; 
    }

    setSynonymSelected(selectedIndex); // Store selected index
    setSynonymLoading(true); // Start loading state

    try {
        setSynonymResult("Checking answer...");
        const base = process.env.REACT_APP_BACKENDURL || '';
        const puzzleId = synonymPuzzle._id;

        const res = await axios.post(`${base}/api/synonym/check`, {
            phoneNumber: userPhoneNumber,
            quizId: puzzleId,
            selectedAnswer: String(selectedIndex) 
        });

        const { isCorrect, coinsAwarded, explanation, message } = res.data;

        if (isCorrect) {
            // Mark the current quiz as solved
            setSynonymLocked(true);
            localStorage.setItem(`synonym-${puzzleId}`, 'solved');

            if (coinsAwarded > 0) {
                setCoin(prev => prev + coinsAwarded);
                setShowFirework(true);
                setTimeout(() => setShowFirework(false), 10000);
                
                const resultMsg = `✅ Correct! You earned ${coinsAwarded} coin(s)! ${explanation ? `\n\nExplanation: ${explanation}` : ''}`;
                setSynonymResult(resultMsg);
                toast.coin(coinText(coinsAwarded));
            } else {
                setSynonymResult("✅ Correct! (Coin already awarded)");
            }
            
            // 🎯 CRITICAL: LOAD THE NEXT UNSOLVED QUIZ
            // We call the external fetch function after the user has been rewarded/notified.
            // We pass 'true' to ensure it fetches immediately, ignoring the activeTab check.
            await fetchSynonymQuiz(true); 
            
        } else {
            // Incorrect answer logic
            setSynonymResult(message || "❌ Incorrect solution. Try again!"); 
        }

    } catch (err) {
        console.error('Synonym check failed:', err);
        // Display the specific error message if available
        const errorMessage = err.response?.data?.error || 'Failed to communicate with the server.';
        setSynonymResult(errorMessage);
    } finally {
        setSynonymLoading(false); // Stop loading state
    }
};
// ✅ Corrected Antonym Answer Handler
// GameTabs.js - Corrected handleAntonymAnswer function
const handleAntonymAnswer = async (selectedIndex) => {
    // 1. Guard Clauses (Safety check)
    if (antonymLocked || !antonymPuzzle || loadingAntonym) {
        console.warn("Antonym submission blocked by guard clauses.");
        if (antonymLocked) setAntonymResult("This puzzle is already solved.");
        return;
    }

    setAntonymSelected(selectedIndex);
    setAntonymResult("Checking answer...");

    try {
        const base = process.env.REACT_APP_BACKENDURL || '';
        const puzzleId = antonymPuzzle._id;

        // 2. Send the selected answer to the backend for validation
        const res = await axios.post(`${base}/api/antonym/check`, { 
            phoneNumber: userPhoneNumber,
            quizId: puzzleId,
            selectedAnswer: selectedIndex
        });

        // 3. Process Backend Response
        if (res.data.isCorrect) {
            setAntonymLocked(true);
            localStorage.setItem(`antonym-${puzzleId}`, 'solved'); 
            setShowFirework(true);
            setTimeout(() => setShowFirework(false), 10000);
            
            // Handle coins and result message
            if (res.data.coinsAwarded > 0) {
                setCoin(prev => prev + res.data.coinsAwarded);
                setAntonymResult(`✅ Correct! You earned ${res.data.coinsAwarded} coin(s)!`);
                toast.coin(coinText(res.data.coinsAwarded));
            } else {
                setAntonymResult("✅ Correct! (Coin already awarded)");
            }
            
            // 🚀 CRITICAL FIX: Trigger the re-fetch for the next puzzle
            setTimeout(() => {
                setRequestNextAntonym(prev => prev + 1); 
            }, 3000); // Wait 3 seconds to show the success message before loading the next one

        } else {
            // Incorrect answer
            setAntonymResult("❌ Incorrect solution. Try again!");
        }

    } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Unknown Network Error';
        console.error('Antonym check failed:', errorMessage, err);
        setAntonymResult(`Failed to communicate with the server. Error: ${errorMessage}`);
    }
};
const loadLatestAntonym = async () => {
    // 1. Set Loading State and Reset
    setLoadingAntonym(true);
    setAntonymError(null);
    setAntonymResult('');
    setAntonymSelected(null);
    setAntonymLocked(false);

    try {
        const base = process.env.REACT_APP_BACKENDURL || '';

        // 2. Fetch the latest unsolved puzzle for the specific user
        // The backend logic is crucial here: it must identify the user 
        // via phoneNumber and return the next unsolved quiz, or a "solved all" flag.
        const res = await axios.get(`${base}/api/antonym`, {
            params: { phoneNumber: userPhoneNumber } 
        });

        const puzzle = res.data.puzzle;

        if (puzzle) {
            const puzzleId = puzzle._id;

            // 3. Check for local/server lock immediately
            const isSolvedLocally = localStorage.getItem(`antonym-${puzzleId}`) === 'solved';
            
            // Assume the backend sends 'isSolvedOnServer' or the puzzle is marked as solved
            if (isSolvedLocally || res.data.isSolvedOnServer) {
                // Puzzle found but is already solved by the user
                setAntonymPuzzle(puzzle); // Keep the puzzle data to show the question
                setAntonymLocked(true); 
                setAntonymResult("✅ This Antonym quiz has already been solved.");
            } else {
                // New unsolved puzzle loaded
                setAntonymPuzzle(puzzle);
                setAntonymLocked(false);
            }
        } else {
            // 4. Handle "No New Puzzle" scenario
            setAntonymPuzzle(null);
            setAntonymLocked(true); // Lock the controls
            setAntonymResult(res.data.message || 'No new Antonym quiz found today.');
        }
    } catch (err) {
        console.error('Failed to fetch Antonym quiz', err);
        setAntonymError('Failed to load Antonym quiz.');
        setAntonymPuzzle(null);
        setAntonymLocked(true);
    } finally {
        setLoadingAntonym(false);
    }
};

 // ---------------- Global Timer ----------------
  const [timeLeft, setTimeLeft] = useState(60);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ---------------- Crossword Logic ----------------


// Front-End: Updated Crossword Fetch Logic
useEffect(() => {
    const fetchUnsolvedCrossword = async () => {
        const phoneNumber = localStorage.getItem("phoneNumber");
        if (!phoneNumber) {
            setCrosswordResult("Authentication required. Please log in.");
            return;
        }

        try {
            setLoading(true);
            const base = process.env.REACT_APP_BACKENDURL || '';

            // 💡 Call the NEW logic: Fetch the next UNSOLVED puzzle for this user
            // The backend now determines which puzzle is the "next" available one 
            // by checking the user's `solvedCrosswords` array.
            const url = `${base}/api/crossword?phoneNumber=${phoneNumber}`;

            const res = await axios.get(url);

            if (res.data.puzzle === null || res.data.message === "Congratulations! You have solved all current crosswords.") {
                 // Case 1: All solved or no puzzles available
                setCrosswordResult("🎉 You've completed all available crosswords!");
                setCrosswordCompleted(true);
                setShowNextButton(false); // No need for a next button if there are no more puzzles
                setCurrentCrosswordId(null);
                setLoading(false);
                return;
            }

            // Case 2: Unsolved puzzle found
            // NOTE: The backend now sends the data directly, without the correctWord!
            const { _id, initialLetters, hint } = res.data; // Destructure the response
            
            setCurrentCrosswordId(_id); // Store the ID of the current puzzle
            // setCorrectWord(fetchedCorrectWord); // ❌ Remove this, as the server should hide it
            setCrosswordHint(hint);

            const hintPos = initialLetters.findIndex(l => l);
            setHintIndex(hintPos);

            setCrosswordLetters(initialLetters.map(l => l || ""));
                setGivenMask(initialLetters.map(l => !!l));
            setCrosswordTimeLeft(120);
            setCrosswordCompleted(false);
            setShowNextButton(false);
            setCrosswordResult('');
            setLoading(false);

        } catch (err) {
            console.error('❌ Failed to load crossword:', err.response?.data || err.message);
            setCrosswordResult("❌ Failed to load crossword. Server error.");
            setLoading(false);
        }
    };

    fetchUnsolvedCrossword();
}, [requestNextPuzzle]); // ✅ Only depends on trigger
// Depend only on the trigger
// New function for submitting the final word
const submitCrosswordAnswer = async (completedWord) => {
    if (!currentCrosswordId || crosswordCompleted) return;

    try {
        // 1. Check answer against the specific crossword ID
        const base = process.env.REACT_APP_BACKENDURL || '';
        const res = await axios.post(`${base}/api/crossword/check-solution`, {
            phoneNumber: userPhoneNumber,
            crosswordId: currentCrosswordId,
            submittedWord: completedWord 
        });

        // Backend must return if it's correct and if coins were awarded
        if (res.data.isCorrect) {
            setCrosswordResult("✅ Correct! Well done!");
            setShowFirework(true);
            setTimeout(() => setShowFirework(false), 10000);
            setCrosswordCompleted(true);
            setShowNextButton(true);

            if (res.data.coinsAwarded > 0) {
                setCoin(prev => prev + res.data.coinsAwarded);
                toast.coin(coinText(res.data.coinsAwarded));
            }
        } else {
            setCrosswordResult("❌ Incorrect word. Try again.");
        }

    } catch (err) {
        console.error('Crossword submission failed:', err);
        setCrosswordResult('Failed to communicate with the server.');
    }
}
// 🎯 NEW TECH QUIZ FETCHING LOGIC (Persistence Fix)
useEffect(() => {
    if (!visitedTabs.tech) return;
    let mounted = true;
    const fetchUnsolvedTechQuiz = async () => {
        const phoneNumber = localStorage.getItem("phoneNumber");
        if (!phoneNumber) {
            if (mounted) setLoadingTech(false);
            setTechQuizResult("Authentication required. Please log in.");
            return;
        }

        try {
            if (mounted) setLoadingTech(true);
            const base = process.env.REACT_APP_BACKENDURL || '';

            // 💡 NEW BACKEND ROUTE: Fetch the next UNSOLVED quiz for this user.
            // NOTE: You must update your backend to have a GET route for /api/tech-quiz?phoneNumber=...
            const url = `${base}/api/tech-quiz?phoneNumber=${phoneNumber}`;
            const res = await axios.get(url);

            if (!mounted) return;
            setTechQuizResult(''); // Clear previous results

            if (res.data.quiz === null) {
                // Case 1: All solved or no quizzes available
                setTechQuizResult(res.data.message || "🎉 You've completed all available tech quizzes!");
                setTechQuiz(null); 
                setTechQuizLocked(true); // Lock the interface
                
            } else {
                // Case 2: Unsolved puzzle found
                setTechQuiz(res.data.quiz);
                setTechQuizLocked(false);
                setTechSelectedAnswerIndex(null); // Reset selection
            }

        } catch (err) {
            console.error('❌ Failed to load tech quiz:', err.response?.data || err.message);
            setTechQuizResult("❌ Failed to load tech quiz. Server error.");
        } finally {
            if (mounted) setLoadingTech(false);
        }
    };

    fetchUnsolvedTechQuiz();
    return () => { mounted = false; };
}, [requestNextTechQuiz, visitedTabs.tech]); // Runs on load and when the user requests the next one
useEffect(() => {
 if (loading || crosswordCompleted) return; // Stop timer if already solved

 const timer = setInterval(() => {
 setCrosswordTimeLeft((prev) => {
 if (prev <= 1) {
 clearInterval(timer);
 
// Remove the line that reveals the answer:
 // setCrosswordLetters(correctWord.split("")); 
 
 setCrosswordCompleted(true); // Lock the input fields
 setShowNextButton(true);    // Allow user to load the next one
 setCrosswordResult("❌ Time’s up! Please load the next puzzle.");
 }
 return prev - 1;
 });
 }, 1000);

 // Dependency array must change
 return () => clearInterval(timer);
}, [loading, crosswordCompleted]); // Only depend on loading and completion state

useEffect(() => {
 if (!visitedTabs.sudoku) return;
 let mounted = true;
 async function loadLatest() {
 setLoadingSudoku(true);
 setFetchError(null);
 try {
 const base = process.env.REACT_APP_BACKENDURL || '';
const res = await axios.get(`${base}/api/dashboard/latest-sudoku`);  
 if (!mounted) return;
 if (res.data && res.data.puzzle) {
 
 setSudokuPuzzle(res.data.puzzle); 
 setInitialBoard(JSON.parse(JSON.stringify(res.data.puzzle))); // Deep copy for pre-filled check
 setUserBoard(JSON.parse(JSON.stringify(res.data.puzzle))); // Deep copy for user edits
 } else {
 setFetchError('No sudoku found');
 }
 } catch (err) {
 console.error('Failed to fetch sudoku', err);
 setFetchError('Failed to load sudoku');
 } finally {
 if (mounted) setLoadingSudoku(false);
 }
 }
 loadLatest();
 return () => { mounted = false; };
}, [visitedTabs.sudoku]); // Loads when the Sudoku tab is first opened

const [attempts, setAttempts] = useState(0);
const checkSudokuSolution = async () => {
    if (!userBoard || loadingSudoku) return;

    // Optional: Quick check to ensure all cells are filled (no 0s)
    const isBoardComplete = userBoard.flat().every(cell => cell !== 0);
    if (!isBoardComplete) {
        setSudokuResult("⚠️ Please fill all empty cells before checking.");
        return;
    }

    try {
        setSudokuResult("Checking solution...");
        
        // 1. Send the user's completed board to the backend for validation
        const base = process.env.REACT_APP_BACKENDURL || '';
        const res = await axios.post(`${base}/api/sudoku/check-solution`, {
            phoneNumber: userPhoneNumber,
            userBoard: userBoard // Send the 9x9 user's array
        });

        // Backend should respond with { isCorrect: boolean, coinsAwarded?: number }
        if (res.data.isCorrect) {
            setSudokuResult("✅ Congratulations! You solved the Sudoku!");
            setShowFirework(true);
            setTimeout(() => setShowFirework(false), 10000);

            if (res.data.coinsAwarded > 0) {
                // 2. Update local coin state if the backend confirms an award
                setCoin(prev => prev + res.data.coinsAwarded);
                toast.coin(coinText(res.data.coinsAwarded));
            }
        } else {
            setSudokuResult("❌ Incorrect solution. Keep trying!");
        }

    } catch (err) {
        console.error('Sudoku check failed:', err);
        setSudokuResult('Failed to communicate with the server.');
    }
};

const handleSequenceCheck = async () => {
    // 1. Initial Guard Clauses
    if (sequenceLocked || !sequencePuzzle || loadingSequence) return;
    
    const userAns = parseInt(sequenceAnswer.trim(), 10);
    if (isNaN(userAns)) {
        setSequenceResult("⚠️ Please enter a valid number.");
        return;
    }

    // 🛑 FIX 1: Set Loading State
    setSequenceLoading(true);

    try {
        setSequenceResult("Checking answer...");

        const base = process.env.REACT_APP_BACKENDURL || '';
        const puzzleId = sequencePuzzle._id;

        // 1. Check solution on the backend
        const res = await axios.post(`${base}/api/sequence/check-solution`, {
            phoneNumber: userPhoneNumber,
            quizId: puzzleId,
            selectedAnswer: userAns // Backend expects a number for comparison
        });

        // Destructure response keys, including the 'explanation' (hint)
        const { isCorrect, coinsAwarded, explanation, message } = res.data;

        if (isCorrect) {
            setSequenceLocked(true);
            
            // ⚠️ Client-side lock removed: This is less important since the backend drives the next quiz load
            // localStorage.setItem(`sequence-${puzzleId}`, 'solved'); 

            if (coinsAwarded > 0) {
                setCoin(prev => prev + coinsAwarded);
                setShowFirework(true);
                setTimeout(() => setShowFirework(false), 10000);
                
                // 🛑 FIX 3: Use the explanation/hint from the backend
                const resultMsg = `✅ Correct! You earned ${coinsAwarded} coin(s)! Pattern: ${explanation || 'No explanation provided.'}`;
                setSequenceResult(resultMsg);
                toast.coin(coinText(coinsAwarded));
            } else {
                 // Use the message from the backend (e.g., "Puzzle already solved.")
                setSequenceResult(message || "✅ Correct! (Coin already awarded)");
            }

            // 🛑 FIX 2: Load the next unsolved quiz after success
            // Assuming fetchSequenceQuiz is available in scope
            await fetchSequenceQuiz(true); 

        } else {
            // Use the message from the backend (e.g., "Incorrect answer.")
            setSequenceResult(message || "❌ Incorrect solution. Try again!");
        }

    } catch (err) {
        console.error('Sequence check failed:', err);
        const errorMessage = err.response?.data?.error || 'Failed to communicate with the server.';
        setSequenceResult(errorMessage);
    } finally {
        // 🛑 FIX 1: Stop Loading State
        setSequenceLoading(false);
    }
};

const handleAnalogyAnswer = async (selectedIndex) => {
    if (analogyLocked || !analogyPuzzle || loadingAnalogy) {
        return;
    }
    
    setAnalogySelectedAnswerIndex(selectedIndex); 

    try {
        setAnalogyResult("Checking answer...");
        const base = process.env.REACT_APP_BACKENDURL || '';
        const puzzleId = analogyPuzzle._id; // ✅ FIX 1: Define puzzleId here

        // ✅ FIX 2: Define res using the await call
        const res = await axios.post(`${base}/api/analogy/check-solution`, {
            phoneNumber: userPhoneNumber,
            quizId: puzzleId,
            selectedAnswer: selectedIndex 
        });

        if (res.data.isCorrect) {
            setAnalogyLocked(true);
            localStorage.setItem(`analogy-${puzzleId}`, 'solved'); 
            setShowNextAnalogyButton(true); // ✅ FIX 3: This setter is now defined in useState

            if (res.data.coinsAwarded > 0) {
                setCoin(prev => prev + res.data.coinsAwarded);
                setShowFirework(true);
                setTimeout(() => setShowFirework(false), 10000);
                setAnalogyResult(`✅ Correct! You earned ${res.data.coinsAwarded} coin(s)!`);
                toast.coin(coinText(res.data.coinsAwarded)); 
            } else {
                setAnalogyResult("✅ Correct! (Coin already awarded)");
            }

        } else {
            setAnalogyResult("❌ Incorrect solution. Try again!");
        }
    } catch (err) {
        console.error('Analogy check failed:', err);
        setAnalogyResult('Failed to communicate with the server.');
    }
};
// ✅ NEW FUNCTION
 // Function to load the analogy puzzle (used on mount and when moving to the next one)
const loadLatestAnalogy = async () => {
    try {
        setLoadingAnalogy(true);
        setAnalogyError(null);
        
        // Check if the user has already solved this puzzle in a previous session
        // This check is often integrated into the backend or handled by a useEffect hook 
        // that checks localStorage on initial load. We will focus on the fetch here.
        
        const base = process.env.REACT_APP_BACKENDURL || '';
        
        // Fetch the latest unsolved analogy puzzle for the user
        const res = await axios.get(`${base}/api/analogy`, {
            params: { phoneNumber: userPhoneNumber } 
        });

        if (res.data.puzzle) {
            const puzzle = res.data.puzzle;
            const puzzleId = puzzle._id;

            // Check localStorage lock for immediate client-side lock
            const isSolvedLocally = localStorage.getItem(`analogy-${puzzleId}`) === 'solved';
            
            // Assume backend also sends a flag if all puzzles are solved or if this specific one is solved
            if (isSolvedLocally || res.data.isSolvedOnServer) {
                // Puzzle is solved or all are solved
                setAnalogyPuzzle(null); 
                setAnalogyLocked(true); 
                setAnalogyResult("✅ All analogies solved for today!");
            } else {
                // New unsolved puzzle loaded
                setAnalogyPuzzle(puzzle);
                setAnalogyLocked(false);
                setAnalogyResult('');
                setAnalogySelectedAnswerIndex(null);
                setShowNextAnalogyButton(false);
            }
        } else {
            setAnalogyPuzzle(null);
            setAnalogyLocked(true); // Lock it since no puzzle was found
            setAnalogyResult('No new analogy puzzle found today.');
        }
    } catch (err) {
        console.error('Failed to fetch analogy', err);
        setAnalogyError('Failed to load analogy puzzle.');
        setAnalogyPuzzle(null);
        setAnalogyLocked(true);
    } finally {
        setLoadingAnalogy(false);
    }
};
// Function to reset states and load the next analogy puzzle
const loadNextAnalogy = () => {
    // 1. Reset client-side states related to the solved puzzle
    setAnalogyLocked(false);
    setAnalogySelectedAnswerIndex(null);
    setAnalogyResult('');
    setShowNextAnalogyButton(false); 
    setAnalogyPuzzle(null); // Clear the current puzzle
    
    // 2. Trigger the fetch for the next unsolved puzzle
    // This calls the primary loading function, which will handle the logic
    // of checking if a new puzzle is available for the user.
    loadLatestAnalogy(); 
};
// ... rest of GameTabs component
const handleLetterChange = (e, index) => {
 let val = e.target.value.toUpperCase().slice(0, 1);

 // 1. Input Validation
 if (val !== '' && !/^[A-Z]$/.test(val)) {
 return;
 }
 
 setCrosswordLetters(prevLetters => {
 const updated = [...prevLetters];
 updated[index] = val;
 
 // ❌ REMOVED INSECURE CLIENT-SIDE CHECK:
 // The entire block that checked `currentWord === correctWord`
    // and awarded coins is removed.

 // 2. Feedback Reset
 // Only clear the feedback if it wasn't a confirmed "Correct!" message
 if (!crosswordResult.startsWith("✅")) {
 setCrosswordResult(""); 
 }

 return updated;
 });
};
const loadNextCrossword = () => {
  // Reset states
  setCrosswordCompleted(false);
  setShowNextButton(false);
  setCrosswordResult('');
  setCrosswordLetters([]);
  setCorrectWord('');
  setCrosswordHint('');
  setCrosswordTimeLeft(120);
  setLoading(true);

  // ✅ Trigger the next puzzle fetch
  setRequestNextPuzzle(prev => prev + 1);
};



// Add this function near handleLetterChange
const handleSudokuChange = (e, row, col) => {
  const val = e.target.value.trim();
  const num = val === '' ? 0 : parseInt(val, 10);
  
  // Input validation: must be empty, or a number between 1 and 9
  if (val !== '' && (isNaN(num) || num < 1 || num > 9)) {
    return;
  }
  
  // Ensure the cell is not a pre-filled cell (use initialBoard for check)
  if (initialBoard && initialBoard[row][col] !== 0) {
    return;
  }

  // Update the userBoard state
  setUserBoard(prevBoard => {
    const newBoard = JSON.parse(JSON.stringify(prevBoard));
    newBoard[row][col] = num; // Set the number (or 0 for clear)
    return newBoard;
  });
};
  // ---------------- Presentation helpers ----------------
  // Move focus to the nearest editable tile in the given direction (skips given letters)
  const focusTile = (index, step = 1) => {
    const tiles = document.querySelectorAll('.cw-tile');
    let i = index;
    while (i >= 0 && i < tiles.length && givenMask[i]) i += step;
    if (tiles[i]) tiles[i].focus();
  };

  const onCrosswordInput = (e, index) => {
    const val = e.target.value.toUpperCase().slice(-1);
    handleLetterChange({ target: { value: val } }, index);
    if (/^[A-Z]$/.test(val)) focusTile(index + 1);
  };

  const onCrosswordKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !crosswordLetters[index]) focusTile(index - 1, -1);
    if (e.key === 'ArrowLeft') focusTile(index - 1, -1);
    if (e.key === 'ArrowRight') focusTile(index + 1);
    if (e.key === 'Enter' && !crosswordLetters.some((l) => l === '')) {
      submitCrosswordAnswer(crosswordLetters.join('').toUpperCase());
    }
  };

  const optionState = (isSelected, locked, resultText) => {
    if (!isSelected) return '';
    if (resultText && resultText.startsWith('✅')) return 'is-correct';
    if (resultText && resultText.startsWith('❌')) return 'is-wrong';
    return 'is-selected';
  };

  const renderOptions = ({ options, selectedIndex, locked, resultText, onPick }) => (
    <div className="options">
      {options.map((option, index) => (
        <button
          key={index}
          className={`option ${optionState(selectedIndex === index, locked, resultText)}`}
          onClick={() => onPick(index)}
          disabled={locked}
        >
          <span className="option-letter">{OPTION_LETTERS[index]}</span>
          <span className="option-text">{option}</span>
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'crossword': {
        if (crosswordCompleted && currentCrosswordId === null && !loading) {
          return (
            <GameCard icon="🧩" title="Daily crossword">
              <StateMessage
                kind="done"
                title="You’re all caught up"
                text={crosswordResult || 'You’ve solved every crossword. New ones are added regularly.'}
              />
            </GameCard>
          );
        }
        const timerLow = crosswordTimeLeft <= 20;
        return (
          <GameCard
            icon="🧩"
            title="Daily crossword"
            subtitle="Fill in the missing letters to spell the word."
            badge={
              !loading && !crosswordCompleted ? (
                <span className={`timer ${timerLow ? 'timer-low' : ''}`}>
                  ⏱ {Math.max(crosswordTimeLeft, 0)}s
                </span>
              ) : null
            }
          >
            {loading ? (
              <StateMessage kind="loading" text="Loading your crossword…" />
            ) : (
              <>
                <div className="hint-box">
                  <span className="hint-label">Clue</span>
                  {crosswordHint}
                </div>

                <div className="cw-row" style={{ '--count': crosswordLetters.length || 1 }}>
                  {crosswordLetters.map((letter, index) => (
                    <input
                      key={index}
                      className={`cw-tile ${givenMask[index] ? 'cw-given' : ''} ${letter ? 'cw-filled' : ''}`}
                      maxLength={2}
                      value={letter}
                      onChange={(e) => onCrosswordInput(e, index)}
                      onKeyDown={(e) => onCrosswordKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      disabled={crosswordCompleted || givenMask[index]}
                      autoCapitalize="characters"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-label={`Letter ${index + 1}`}
                    />
                  ))}
                </div>

                <ResultBanner text={crosswordResult} />

                <div className="actions">
                  {!crosswordCompleted && crosswordLetters.length > 0 && (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => submitCrosswordAnswer(crosswordLetters.join('').toUpperCase())}
                      disabled={loading || crosswordLetters.some((l) => l === '')}
                    >
                      Check word
                    </button>
                  )}
                  {showNextButton && (
                    <button className="btn btn-primary btn-block" onClick={loadNextCrossword}>
                      Next crossword
                    </button>
                  )}
                </div>
              </>
            )}
          </GameCard>
        );
      }

      case 'sudoku': {
        if (loadingSudoku) return <GameCard icon="🔢" title="Daily Sudoku"><StateMessage kind="loading" text="Loading today’s Sudoku…" /></GameCard>;
        if (fetchError) return <GameCard icon="🔢" title="Daily Sudoku"><StateMessage kind="error" title="Sudoku didn’t load" text={fetchError} /></GameCard>;
        if (!userBoard) return <GameCard icon="🔢" title="Daily Sudoku"><StateMessage kind="empty" title="No Sudoku today" text="Check back later for a new grid." /></GameCard>;
        return (
          <GameCard icon="🔢" title="Daily Sudoku" subtitle="Each row, column and 3×3 box needs the numbers 1 to 9.">
            <div className="sudoku">
              {userBoard.map((rowArr, row) =>
                rowArr.map((num, col) => {
                  const isPrefilled = initialBoard[row][col] !== 0;
                  const edges = `${col % 3 === 2 && col !== 8 ? ' edge-r' : ''}${row % 3 === 2 && row !== 8 ? ' edge-b' : ''}`;
                  return (
                    <input
                      key={`${row}-${col}`}
                      className={`sudoku-cell${isPrefilled ? ' given' : ''}${edges}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={num === 0 ? '' : String(num)}
                      onChange={(e) => handleSudokuChange(e, row, col)}
                      disabled={isPrefilled}
                      aria-label={`Row ${row + 1}, column ${col + 1}`}
                    />
                  );
                })
              )}
            </div>
            <ResultBanner text={sudokuResult} />
            <div className="actions">
              <button onClick={checkSudokuSolution} className="btn btn-primary btn-block">
                Check solution
              </button>
            </div>
          </GameCard>
        );
      }

      case 'tech': {
        if (loadingTech) return <GameCard icon="💡" title="Tech quiz"><StateMessage kind="loading" text="Loading the next question…" /></GameCard>;
        if (!techQuiz) {
          return (
            <GameCard icon="💡" title="Tech quiz">
              <StateMessage
                kind={techError ? 'error' : 'done'}
                title={techError ? 'The quiz didn’t load' : 'You’re all caught up'}
                text={techQuizResult || techError || 'No new tech questions right now.'}
                action={<button className="btn btn-ghost" onClick={loadNextTechQuiz}>Check for new questions</button>}
              />
            </GameCard>
          );
        }
        return (
          <GameCard icon="💡" title="Tech quiz" subtitle="Pick the correct answer.">
            <p className="question">{techQuiz.question}</p>
            {renderOptions({
              options: techQuiz.options,
              selectedIndex: techSelectedAnswerIndex,
              locked: techQuizLocked,
              resultText: techQuizResult,
              onPick: handleTechQuizAnswer,
            })}
            <ResultBanner text={techQuizResult} />
            {techQuizLocked && (
              <div className="actions">
                <button className="btn btn-primary btn-block" onClick={loadNextTechQuiz}>
                  Next question
                </button>
              </div>
            )}
          </GameCard>
        );
      }

      case 'memory': {
        if (loadingSequence) return <GameCard icon="🧠" title="Number sequence"><StateMessage kind="loading" text="Loading the sequence…" /></GameCard>;
        if (sequenceError) return <GameCard icon="🧠" title="Number sequence"><StateMessage kind="error" title="The sequence didn’t load" text={sequenceError} /></GameCard>;
        if (!sequencePuzzle) {
          return (
            <GameCard icon="🧠" title="Number sequence">
              <StateMessage kind="done" title="You’re all caught up" text={sequenceResult || 'No new sequences right now.'} />
            </GameCard>
          );
        }
        const numbers = Array.isArray(sequencePuzzle.sequence) ? sequencePuzzle.sequence : [];
        return (
          <GameCard icon="🧠" title="Number sequence" subtitle="Find the number that comes next.">
            <div className="sequence">
              {numbers.map((n, i) => (
                <span key={i} className="seq-num">{n}</span>
              ))}
              <input
                type="number"
                inputMode="numeric"
                className="seq-num seq-answer"
                value={sequenceAnswer}
                onChange={(e) => setSequenceAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !sequenceLocked && sequenceAnswer.trim() !== '') handleSequenceCheck();
                }}
                disabled={sequenceLocked}
                placeholder="?"
                aria-label="Your answer"
              />
            </div>
            {sequencePuzzle.hint && (
              <div className="hint-box">
                <span className="hint-label">Hint</span>
                {sequencePuzzle.hint}
              </div>
            )}
            <ResultBanner text={sequenceResult} />
            <div className="actions">
              <button
                onClick={handleSequenceCheck}
                className="btn btn-primary btn-block"
                disabled={sequenceLocked || sequenceAnswer.trim() === ''}
              >
                Check answer
              </button>
            </div>
          </GameCard>
        );
      }

      case 'synonym': {
        if (loadingSynonym) return <GameCard icon="🔤" title="Synonyms"><StateMessage kind="loading" text="Loading the next word…" /></GameCard>;
        if (synonymError) return <GameCard icon="🔤" title="Synonyms"><StateMessage kind="error" title="The quiz didn’t load" text={synonymError} /></GameCard>;
        if (!synonymPuzzle) {
          return (
            <GameCard icon="🔤" title="Synonyms">
              <StateMessage kind="done" title="You’re all caught up" text={synonymResult || 'No new synonym questions right now.'} />
            </GameCard>
          );
        }
        return (
          <GameCard icon="🔤" title="Synonyms" subtitle="Pick the word that means the same.">
            <p className="question question-word">{synonymPuzzle.question}</p>
            {renderOptions({
              options: synonymPuzzle.options,
              selectedIndex: synonymSelected,
              locked: synonymLocked || loadingSynonym,
              resultText: synonymResult,
              onPick: handleSynonymAnswer,
            })}
            {synonymPuzzle.hint && (
              <div className="hint-box">
                <span className="hint-label">Hint</span>
                {synonymPuzzle.hint}
              </div>
            )}
            <ResultBanner text={synonymResult} />
          </GameCard>
        );
      }

      case 'antonym': {
        if (loadingAntonym) return <GameCard icon="🔡" title="Antonyms"><StateMessage kind="loading" text="Loading the next word…" /></GameCard>;
        if (antonymError) return <GameCard icon="🔡" title="Antonyms"><StateMessage kind="error" title="The quiz didn’t load" text={antonymError} /></GameCard>;
        if (!antonymPuzzle) {
          return (
            <GameCard icon="🔡" title="Antonyms">
              <StateMessage kind="done" title="You’re all caught up" text={antonymResult || 'No new antonym questions right now.'} />
            </GameCard>
          );
        }
        return (
          <GameCard icon="🔡" title="Antonyms" subtitle="Pick the word that means the opposite.">
            <p className="question question-word">{antonymPuzzle.question}</p>
            {renderOptions({
              options: antonymPuzzle.options,
              selectedIndex: antonymSelected,
              locked: antonymLocked,
              resultText: antonymResult,
              onPick: handleAntonymAnswer,
            })}
            {antonymPuzzle.hint && (
              <div className="hint-box">
                <span className="hint-label">Hint</span>
                {antonymPuzzle.hint}
              </div>
            )}
            <ResultBanner text={antonymResult} />
          </GameCard>
        );
      }

      case 'nback': {
        if (loadingAnalogy) return <GameCard icon="🔄" title="Analogies"><StateMessage kind="loading" text="Loading the next analogy…" /></GameCard>;
        if (analogyError) return <GameCard icon="🔄" title="Analogies"><StateMessage kind="error" title="The analogy didn’t load" text={analogyError} /></GameCard>;
        if (!analogyPuzzle) {
          return (
            <GameCard icon="🔄" title="Analogies">
              <StateMessage
                kind="done"
                title="You’re all caught up"
                text={analogyLocked ? 'You’ve solved every analogy. Check back tomorrow.' : 'No analogy available today.'}
              />
            </GameCard>
          );
        }
        return (
          <GameCard icon="🔄" title="Analogies" subtitle="Complete the comparison.">
            <p className="question">{analogyPuzzle.question}</p>
            {renderOptions({
              options: analogyPuzzle.options,
              selectedIndex: analogySelectedAnswerIndex,
              locked: analogyLocked || loadingAnalogy,
              resultText: analogyResult,
              onPick: handleAnalogyAnswer,
            })}
            {analogyPuzzle.hint && (
              <div className="hint-box">
                <span className="hint-label">Hint</span>
                {analogyPuzzle.hint}
              </div>
            )}
            <ResultBanner text={analogyResult} />
            {showNextAnalogyButton && (
              <div className="actions">
                <button className="btn btn-primary btn-block" onClick={loadNextAnalogy}>
                  Next analogy
                </button>
              </div>
            )}
          </GameCard>
        );
      }

      case 'scoreboard': {
        const mask = (p) => (p && p.length >= 4 ? `••• ${p.slice(-4)}` : '—');
        const myRank = leaderboard.findIndex((p) => p.phoneNumber === userPhoneNumber);
        return (
          <GameCard icon="🏆" title="Leaderboard" subtitle="The players with the most coins.">
            <div className="my-score">
              <div>
                <div className="my-score-label">Your coins</div>
                <div className="my-score-value">🪙 {coin}</div>
              </div>
              {myRank >= 0 && (
                <div className="my-rank">
                  <div className="my-score-label">Your rank</div>
                  <div className="my-score-value">#{myRank + 1}</div>
                </div>
              )}
            </div>

            {loadingLeaderboard ? (
              <StateMessage kind="loading" text="Loading the leaderboard…" />
            ) : leaderboardError ? (
              <StateMessage kind="error" title="The leaderboard didn’t load" text={leaderboardError} />
            ) : leaderboard.length === 0 ? (
              <StateMessage kind="empty" title="No scores yet" text="Solve a puzzle to be the first on the board." />
            ) : (
              <ol className="board">
                {leaderboard.slice(0, 10).map((player, index) => {
                  const isMe = player.phoneNumber === userPhoneNumber;
                  return (
                    <li key={player._id || index} className={`board-row rank-${index + 1} ${isMe ? 'is-me' : ''}`}>
                      <span className="board-rank">{MEDALS[index] || index + 1}</span>
                      <span className="board-name">{isMe ? `You (${mask(player.phoneNumber)})` : mask(player.phoneNumber)}</span>
                      <span className="board-coins">🪙 {player.coins}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </GameCard>
        );
      }

      case 'instructions':
        return (
          <GameCard icon="📖" title="How to play">
            <ul className="info-list">
              <li><strong>Crossword:</strong> read the clue and type the missing letters before the timer runs out. Gold tiles are letters given to you.</li>
              <li><strong>Sudoku:</strong> fill every empty cell so each row, column and 3×3 box has the numbers 1 to 9, then tap Check solution.</li>
              <li><strong>Tech quiz, synonyms, antonyms and analogies:</strong> tap the answer you think is right. You get one try per question.</li>
              <li><strong>Number sequence:</strong> work out the pattern and type the next number.</li>
              <li><strong>Coins:</strong> every correct answer earns coins. Collect the most to climb the leaderboard.</li>
            </ul>
          </GameCard>
        );

      case 'faq':
        return (
          <GameCard icon="❓" title="Questions and answers">
            <div className="faq">
              {FAQS.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </GameCard>
        );

      default:
        return null;
    }
  };

  const goTo = (tabId) => {
    setActiveTab(tabId);
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navButtons = (items, className) =>
    items.map((tab) => (
      <button
        key={tab.id}
        className={`${className} ${activeTab === tab.id ? 'active' : ''}`}
        onClick={() => goTo(tab.id)}
        aria-current={activeTab === tab.id ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden="true">{tab.icon}</span>
        <span>{tab.label}</span>
      </button>
    ));

  return (
    <div className="game-shell">
      <header className="topbar">
        <button className="icon-btn menu-btn" onClick={toggleSidebar} aria-label="Open menu">
          <span className="burger" />
        </button>
        <div className="wordmark" aria-label="IQsprint">
          <span className="wordmark-tile">IQ</span>
          <span className="wordmark-text">sprint</span>
        </div>
        <button className="coin-chip" onClick={() => goTo('scoreboard')} aria-label={`${coin} coins. Open leaderboard`}>
          🪙 <span>{coin}</span>
        </button>
      </header>

      <nav className="chip-nav" aria-label="Games" ref={chipNavRef}>
        {navButtons(GAME_TABS, 'chip')}
      </nav>

      <div className={`drawer-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar} />

      <aside className={`side-nav ${sidebarOpen ? 'open' : ''}`} aria-label="Menu">
        <div className="side-head">
          <div className="wordmark">
            <span className="wordmark-tile">IQ</span>
            <span className="wordmark-text">sprint</span>
          </div>
          <button className="icon-btn close-btn" onClick={closeSidebar} aria-label="Close menu">×</button>
        </div>
        <div className="side-group-title">Games</div>
        {navButtons(GAME_TABS, 'side-link')}
        <div className="side-group-title">More</div>
        {navButtons(HELP_TABS, 'side-link')}
        <button className="side-link logout" onClick={handleLogout}>
          <span className="nav-icon" aria-hidden="true">⎋</span>
          <span>Log out</span>
        </button>
      </aside>

      <main className="game-main">{renderContent()}</main>

      {showFirework && <Firework />}
    </div>
  );
};

// ---------------- Small presentational components ----------------
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const MEDALS = ['🥇', '🥈', '🥉'];

const GAME_TABS = [
  { id: 'crossword', label: 'Crossword', icon: '🧩' },
  { id: 'sudoku', label: 'Sudoku', icon: '🔢' },
  { id: 'tech', label: 'Tech quiz', icon: '💡' },
  { id: 'memory', label: 'Sequence', icon: '🧠' },
  { id: 'synonym', label: 'Synonyms', icon: '🔤' },
  { id: 'antonym', label: 'Antonyms', icon: '🔡' },
  { id: 'nback', label: 'Analogies', icon: '🔄' },
  { id: 'scoreboard', label: 'Leaderboard', icon: '🏆' },
];

const HELP_TABS = [
  { id: 'instructions', label: 'How to play', icon: '📖' },
  { id: 'faq', label: 'Questions', icon: '❓' },
];

const FAQS = [
  { q: 'How do I earn coins?', a: 'Answer any puzzle correctly. Each puzzle pays its coins once.' },
  { q: 'Can I try a question again?', a: 'Quiz questions lock after your answer. For the crossword, Sudoku and number sequence you can keep trying until you get it right.' },
  { q: 'What does IQsprint cost?', a: 'Your first three days are free. After that it costs 3 birr per day.' },
  { q: 'When are new puzzles added?', a: 'New puzzles are added regularly. When you’ve solved everything in a game, check back later.' },
  { q: 'Why was I logged out?', a: 'For your security, you’re logged out after 7 days. Log in again with your phone number and password.' },
];

function GameCard({ icon, title, subtitle, badge, children }) {
  return (
    <section className="game-card">
      <div className="game-head">
        <span className="game-icon" aria-hidden="true">{icon}</span>
        <div className="game-titles">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {badge}
      </div>
      <div className="game-body">{children}</div>
    </section>
  );
}

function StateMessage({ kind, title, text, action }) {
  const icons = { done: '🎉', error: '⚠️', empty: '🗂️' };
  return (
    <div className={`state state-${kind}`}>
      {kind === 'loading' ? <div className="spinner" /> : <div className="state-icon">{icons[kind]}</div>}
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

function ResultBanner({ text }) {
  if (!text) return null;
  const tone = text.startsWith('✅') ? 'good' : text.startsWith('❌') ? 'bad' : text.startsWith('⚠️') ? 'warn' : 'info';
  return <p className={`result result-${tone}`}>{text}</p>;
}

export default GameTabs;
