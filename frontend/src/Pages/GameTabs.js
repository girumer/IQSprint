import React, { useState, useEffect } from "react";
import "./GameTabs.css";
import gameBack from "../assets/gameback.png";
import Firework from "./Firework";
import Popup from "./Popup";
import axios from 'axios';
const GameTabs = () => {
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
    if (activeTab === 'antonym' || antonymPuzzle === null) {
        loadLatestAntonym();
    }
}, [activeTab]);
    // Add this useEffect at the VERY TOP of your GameTabs component, after the state declarations
useEffect(() => {
  // Request interceptor to add token to all requests
  const requestInterceptor = axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors
  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
// --- Handler for Tech Quiz Answer ---


  // Cleanup
  return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };
}, []);
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
}, []);
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
                alert(`🎉 Congratulations! You earned ${res.data.coinsAwarded} coin(s)!`); 
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
    
    fetchAnalogy();

    return () => { mounted = false; };
// ⚠️ Ensure 'phoneNumber' is in the dependency array if it can change over time
}, [userPhoneNumber]);
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
useEffect(() => {
  const phoneNumber = localStorage.getItem("phoneNumber");
  if (!phoneNumber) return;

  axios.get(`${process.env.REACT_APP_BACKENDURL}/api/user/coin?phoneNumber=${phoneNumber}`)
    .then(res => {
      setCoin(res.data.coins); // ✅ assuming backend returns { coins: number }
    })
    .catch(err => {
      console.error("Failed to fetch coin balance:", err);
    });
}, []);
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
                alert(`🎉 Congratulations! You earned ${coinsAwarded} coin(s)!`);
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
                alert(`🎉 Congratulations! You earned ${res.data.coinsAwarded} coin(s)!`);
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
                alert(`🎉 You earned ${res.data.coinsAwarded} coin(s)!`);
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
}, [requestNextTechQuiz]); // Runs on load and when the user requests the next one
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
}, []); // Dependency array is empty, runs once on mount

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
                alert(`🎉 You earned ${res.data.coinsAwarded} coin(s)!`);
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
                alert(`🎉 You earned ${coinsAwarded} coin(s)!`);
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
                alert(`🎉 Congratulations! You earned ${res.data.coinsAwarded} coin(s)!`); 
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
  const renderContent = () => {
    switch (activeTab) {
 // ... (inside the renderContent function)

case "crossword":
    // 1. CHECK FOR "ALL SOLVED" STATUS FIRST
    // This happens when the fetch useEffect sets crosswordCompleted=true AND currentCrosswordId=null
    if (crosswordCompleted && currentCrosswordId === null && !loading) {
        return (
            <div className="crossword-demo">
                <h1>🧪 Daily Scientific Crossword</h1>
                <div className="alert alert-success mt-3" style={{ fontSize: '20px', padding: '30px' }}>
                    {/* Display the success message set by the fetch logic */}
                    **{crosswordResult}** <p style={{ marginTop: '15px', color: '#666' }}>
                        You're caught up! No new puzzles are currently available.
                    </p>
                </div>
            </div>
        );
    }

    // 2. RENDER PUZZLE GRID NORMALLY (Loading or Unsolved Puzzle)
    return (
        <div className="crossword-demo">
            <h3>⏳ Time Left: {crosswordTimeLeft} seconds</h3>
            <h1>🧪 Daily Scientific Crossword</h1>
            <h1>Fill in the crossword below:</h1>

            {loading ? (
                <div>
                    <p>Loading crossword puzzle...</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        Puzzle ID: {currentCrosswordId || 'Initial load'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="crossword-grid">
                        {crosswordLetters.map((letter, index) => (
                            <input
                                key={index}
                                maxLength="1"
                                value={letter}
                                onChange={(e) => handleLetterChange(e, index)}
                                style={index === hintIndex ? { backgroundColor: "#abebebff" } : {}}
                                placeholder={index === hintIndex ? "?" : ""}
                                disabled={crosswordCompleted} // <--- Still locks input after correct solve
                            />
                        ))}
                    </div>

                    <div className="crossword-hints">
                        <h1>Hint: {crosswordHint}</h1>
                    </div>
                    
                    {crosswordResult && <p className="crossword-result">{crosswordResult}</p>}

                    {/* Submit Button: Hidden if crosswordCompleted is true (solved or all solved) */}
                    {!crosswordCompleted && crosswordLetters.length > 0 && (
                        <button 
                            onClick={() => submitCrosswordAnswer(crosswordLetters.join('').toUpperCase())}
                            disabled={loading || crosswordLetters.some(l => l === '')} 
                            className="submit-crossword-button"
                            style={{
                                padding: '12px 25px',
                                fontSize: '18px',
                                backgroundColor: '#FF6F00',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '20px',
                                marginBottom: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            🔍 Check Crossword Solution
                        </button>
                    )}


                    {/* Next Button: Only appears after a successful submission */}
                    {showNextButton && (
                        <div className="next-puzzle-section">
                            <button 
                                onClick={loadNextCrossword}
                                disabled={false}
                                className="next-puzzle-button"
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: '20px'
                                }}
                            >
                                🎯 Next Crossword Puzzle
                            </button>
                            <p style={{ marginTop: '10px', color: '#666' }}>
                                Ready for the next challenge?
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
  case "faq":
  return (
    <div className="faq-tab">
      <h1>❓ Frequently Asked Questions</h1>
      <ul>
        <li>
          <strong>Question:</strong> How do I play the crossword?
          <br />
          <strong>Answer:</strong> Fill in the letters in the grid using the hint provided.
        </li>
        <li>
          <strong>Question:</strong> How do I earn coins?
          <br />
          <strong>Answer:</strong> Solve quizzes, Sudoku, sequence, and analogy puzzles correctly to earn coins.
        </li>
        <li>
          <strong>Question:</strong> Can I redo a puzzle?
          <br />
          <strong>Answer:</strong> Only puzzles not marked as solved in localStorage can be retried.
        </li>
        <li>
          <strong>Question:</strong> How do I check my Sudoku solution?
          <br />
          <strong>Answer:</strong> Fill all cells and click the “Check Solution” button.
        </li>
        {/* Add more FAQs as needed */}
      </ul>
    </div>
  );

  case "instructions":
  return (
    <div className="instructions-tab">
      <h1>📖 Instructions</h1>
      <p>Welcome to the Daily Scientific Game Hub! Here’s how to play:</p>
      <ul>
        <li>🧪 <strong>Crossword:</strong> Fill in the daily crossword within the time limit. Use the hint if needed.</li>
        <li>📝 <strong>Synonym & Antonym Quiz:</strong> Select the correct answer. Earn coins for correct answers!</li>
        <li>🔢 <strong>Sudoku:</strong> Complete the 9x9 Sudoku grid. Check your solution with the button provided.</li>
        <li>🧩 <strong>Sequence & Analogy:</strong> Solve the sequence and analogy puzzles for bonus coins.</li>
        <li>🎯 Try to earn as many coins as possible by solving daily challenges.</li>
      </ul>
      <p>💡 Tip: Complete all games to maximize your rewards and climb the leaderboard!</p>
    </div>
  );

 // GameTabs.js - Inside the main return/switch block
      case "antonym":
        if (loadingAntonym) return <p>Loading Antonym Quiz...</p>;
        if (antonymError) return <p className="error-message">{antonymError}</p>;
        // If all solved, antonymPuzzle will be null, but antonymResult will hold the message.
        if (!antonymPuzzle && antonymLocked) return <p className="success-message">{antonymResult}</p>;
        if (!antonymPuzzle) return <p>No Antonym Quiz available today.</p>;


        const antonymOptionLabels = ['A', 'B', 'C', 'D'];

        return (
          <div className="antonym-quiz-container">
            <h2>📝 Daily Antonym Quiz</h2>
            <h2 className="quiz-prompt">
              opposite  word: 
            </h2>
            <h3>Word: <strong className="quiz-word-highlight">{antonymPuzzle.question}</strong></h3>
                   
            <div className="antonym-options-list">
              {antonymPuzzle.options.map((option, index) => {
                const optionLabel = `${antonymOptionLabels[index]}) ${option}`;
                const isSelected = antonymSelected === index;
                
                // Highlight the selected option as correct ONLY if it was correct and the puzzle is locked
                const isCorrectlySolved = antonymLocked && isSelected && antonymResult.startsWith('✅');

                return (
                  <button
                    key={index}
                    onClick={() => handleAntonymAnswer(index)}
                    // Apply classes for visual feedback
                    className={`option-button 
                      ${isSelected ? 'selected' : ''} 
                      ${isCorrectlySolved ? 'correct-answer-locked' : ''}
                    `}
                    disabled={antonymLocked}
                  >
                    {optionLabel}
                  </button>
                );
              })}
            </div>

            <div className="antonym-hint-box">
              **Hint:** {antonymPuzzle.hint}
            </div>

            {antonymResult && <p className={`antonym-result ${antonymLocked ? 'final-result' : ''}`}>{antonymResult}</p>}
          </div>
        );
 case "sudoku":
 if (loadingSudoku) return <p>Loading Sudoku...</p>;
 if (fetchError) return <p>Error: {fetchError}</p>;
 // ✅ Change this check to use userBoard instead of sudokuPuzzle
 if (!userBoard) return <p>No puzzle found for today.</p>; 

 return (
 <div className="sudoku-demo">
<h3>⏳ Time Left: 30 MINUTES</h3>
 <h1>🔢 Daily Sudoku Challenge</h1>
 <h2>Fill the 9x9 Sudoku Grid</h2>
 <div className="sudoku-grid">
 {/* Iterate over the userBoard (which is a 9x9 array) 
            We use a double map for easier row/col calculation
            */}
 {userBoard.map((rowArr, row) => ( 
              rowArr.map((num, col) => {
                const isPrefilled = initialBoard[row][col] !== 0;
                const displayValue = num === 0 ? "" : String(num); // Show empty string for 0
                
                return (
                  <input
                    key={`${row}-${col}`} // Better key for 2D array
                    type="text"
                    maxLength="1"
                    className={`sudoku-cell ${isPrefilled ? "prefilled" : ""}`}
                    // ✅ Use displayValue and the handler
                    value={displayValue} 
                    onChange={(e) => handleSudokuChange(e, row, col)} 
                    // ✅ Disable only the cells that were pre-filled
                    disabled={isPrefilled} 
                  />
                )
              })
            ))}
 </div>
 <div className="sudoku-controls">
        <button onClick={checkSudokuSolution} className="check-button">
            Check Solution
        </button>
        {sudokuResult && (
            <p className="sudoku-result">{sudokuResult}</p>
        )}
    </div>
 </div>
 );

case "synonym":
    // 1. Loading State
    if (loadingSynonym) return <p>Loading Synonym Quiz...</p>;
    
    // 2. Error State
    if (synonymError) return <p className="error">{synonymError}</p>;

    // 3. No Puzzle Found / All Solved State
    // If no puzzle is available, display the message from the backend (if any) or a default message.
    if (!synonymPuzzle) return <p>{synonymResult || "No Synonym Quiz available."}</p>; 

    const synonymOptionLetters = ['A', 'B', 'C', 'D'];

    return (
        <div className="synonym-quiz-demo">
            <h2>📝 Daily Synonym Quiz</h2>
            <h3>Word: <strong>{synonymPuzzle.question}</strong></h3>

            <div className="synonym-options-list">
                {synonymPuzzle.options.map((option, index) => {
                    const optionLabel = `${synonymOptionLetters[index]}) ${option}`;
                    const isSelected = synonymSelected === index;

                    return (
                        <button
                            key={index}
                            // Call the corrected handler
                            onClick={() => handleSynonymAnswer(index)} 
                            className={`option-button ${isSelected ? 'selected' : ''}`}
                            disabled={synonymLocked || loadingSynonym} // 💡 Added loading check
                        >
                            {optionLabel}
                        </button>
                    );
                })}
            </div>

            <div className="synonym-hint">
                **Hint:** {synonymPuzzle.hint || 'No hint provided.'} 
            </div>

            {/* 💡 Added class for result to style success/failure */}
            {synonymResult && 
                <p className={`synonym-result ${synonymResult.includes('Correct') ? 'success' : 'failure'}`}>
                    {synonymResult}
                </p>
            }
        </div>
    );



// ... inside renderContent()
case "tech":
    return (
        <div className="game-content">
            <h1 className="game-title">⚛️ Tech Quiz Challenge</h1>
           

            {loadingTech ? (
                <div className="loading-state">Loading latest quiz...</div>
            ) : techQuiz ? (
                <div className="quiz-container">
                    <h1 >{techQuiz.question}</h1>
                    <div className="quiz-options">
                        {techQuiz.options.map((option, index) => (
                            <button
                                key={index}
                                className={`quiz-option-button 
                                    ${techSelectedAnswerIndex === index ? 'selected' : ''} 
                                    ${techQuizLocked && techSelectedAnswerIndex === index && techQuizResult.startsWith('✅') ? 'correct' : ''}
                                `}
                                onClick={() => handleTechQuizAnswer(index)}
                                disabled={techQuizLocked}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <p className={`quiz-result ${techQuizResult.startsWith('❌') ? 'error' : ''}`}>
                        {techQuizResult}
                    </p>
                    {techQuizLocked && (
                        <button 
                            className="btn btn-primary mt-3" 
                            onClick={loadNextTechQuiz}
                        >
                            Next Tech Quiz ➡️
                        </button>
                    )}
                </div>
            ) : (
                <div className="alert alert-success mt-3" style={{ fontSize: '20px', padding: '30px' }}>
                    {techQuizResult || techError || "No tech quiz found."}
                    {techQuizLocked && (
                        <button 
                            className="btn btn-primary mt-3" 
                            onClick={loadNextTechQuiz}
                        >
                            Check for New Quizzes 🔄
                        </button>
                    )}
                </div>
            )}
        </div>
    );
 
  case "memory":
  if (loadingSequence) {
    return <p>Loading Number Sequence...</p>;
  }
  if (sequenceError) {
    return <p>Error: {sequenceError}</p>;
  }
  if (!sequencePuzzle) {
    return (
      <p className="all-solved-message">
        {sequenceResult || 'No Number Sequence available today.'}
      </p>
    );
  }

  const sequenceDisplay = Array.isArray(sequencePuzzle?.sequence)
    ? sequencePuzzle.sequence.join(', ')
    : '';
  const isLocked = sequenceLocked;
  const isButtonDisabled = isLocked || sequenceAnswer.trim() === '';

  return (
    <div className="number-sequence-demo">
      <h1>🔢 Daily Mathimatical Puzzle</h1>
   

      <div className="sequence-display">
        <span className="sequence-numbers">
          <h1>{sequenceDisplay}</h1>
        </span>
        <span className="sequence-blank">
        
          <input
            type="number"
            value={sequenceAnswer}
            onChange={(e) => setSequenceAnswer(e.target.value)}
            disabled={isLocked}
            placeholder="?"
            className="answer-input"
          />
        </span>
      </div>

      <div className="sequence-hint">
        <strong>Hint:</strong> {sequencePuzzle.hint}
      </div>

      <div className="sequence-controls">
        <button
          onClick={handleSequenceCheck}
          className="check-button"
          disabled={isButtonDisabled}
        >
          {loadingSequence ? 'Checking...' : 'Check Answer'}
        </button>
        {sequenceResult && (
          <p className="sequence-result">{sequenceResult}</p>
        )}
      </div>
    </div>
  );


case "nback":
    if (loadingAnalogy) return <p>Loading Analogy Quiz...</p>;
    if (analogyError) return <p>Error: {analogyError}</p>;
    // Check if all puzzles are solved, assuming loadLatestAnalogy sets analogyLocked=true
    // and analogyPuzzle=null if no new quiz is available.
    if (!analogyPuzzle && analogyLocked) { 
        return (
            <div className="analogy-quiz-demo">
                <h2>❓ Daily Analogy Puzzle</h2>
                <div className="alert alert-success mt-3" style={{ fontSize: '20px', padding: '30px' }}>
                    **✅ All daily Analogy puzzles solved!**
                    <p style={{ marginTop: '10px', color: '#666' }}>
                        You're caught up! Check back tomorrow for a new challenge.
                    </p>
                </div>
            </div>
        );
    }
    if (!analogyPuzzle) return <p>No Analogy Quiz available today.</p>;

    const { question, options, hint } = analogyPuzzle;
    const analogyIsLocked = analogyLocked || loadingAnalogy;
    const optionLetters = ['A', 'B', 'C', 'D']; 
    
    return (
        <div className="analogy-quiz-demo">
            <h1>❓ Daily Analogy Puzzle</h1>
            
            <div className="analogy-question-text">
              <h2>{question}</h2>
            </div>

            <div className="analogy-options-list">
                {options.map((option, index) => {
                    const optionLabel = `${option}`;
                    const isSelected = analogySelectedAnswerIndex === index;

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnalogyAnswer(index)}
                            className={`option-button ${isSelected ? 'selected' : ''}`}
                            disabled={analogyIsLocked}
                            
                        >
                            {optionLabel}
                        </button>
                    );
                })}
            </div>

            <div className="analogy-hint">
                **Hint:** {hint}
            </div>

            <div className="analogy-controls">
                {analogyResult && (
                    <p className="analogy-result">{analogyResult}</p>
                )}
                
                {/* 🎯 Next Puzzle Button - Rendered only after a correct solve */}
                {/* Assuming 'showNextAnalogyButton' state is available and set by handleAnalogyAnswer */}
                {showNextAnalogyButton && (
                    <div className="next-puzzle-section">
                        <button 
                            onClick={loadNextAnalogy} // <-- Assuming loadNextAnalogy is defined
                            className="next-puzzle-button"
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '20px'
                            }}
                        >
                            🎯 Next Analogy Puzzle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
// ...
// ...
// ...

  // ... inside renderContent function's switch statement ...
case "scoreboard":
    if (loadingLeaderboard) return <p>Loading Leaderboard...</p>;
    if (leaderboardError) return <p>Error: {leaderboardError}</p>;
    
    // Check if there are any players at all before proceeding
    if (leaderboard.length === 0) return <p>No players on the leaderboard yet. Play a game to get started!</p>;

    // Helper function to mask the phone number for privacy
    const maskPhoneNumber = (phoneNumber) => {
        if (!phoneNumber || phoneNumber.length < 4) {
            return 'N/A';
        }
        // Show a few asterisks and the last 4 digits
        return '***' + phoneNumber.slice(-4);
    };

    // 💡 CRITICAL CHANGE: Slice the array to get only the top 3 players
    const topThreePlayers = leaderboard.slice(0, 3);

    return (
        <div className="scoreboard-container">
            <h2>🏆 Top 3  IQ Sprint Players</h2>
            
            <ul className="scoreboard-list">
                {topThreePlayers.map((player, index) => { // Map over the reduced array
                    
                    // Assuming the key for the phone number is 'phoneNumber' based on the last fix attempt.
                    // If your actual key is different (e.g., 'userPhoneNumber'), change this line:
                    const playerPhoneNumber = player.phoneNumber; 
                    
                    const maskedNumber = maskPhoneNumber(playerPhoneNumber);
                    const isCurrentUser = playerPhoneNumber === userPhoneNumber;

                    return (
                        <li
                            key={index}
                            // Apply styling based on rank (1, 2, or 3)
                            className={`score-item ${index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : ""} ${isCurrentUser ? 'current-user-rank' : ''}`}
                        >
                            <span className="rank">
                                {/* Conditional Medal Icons */}
                                {index === 0 && '🥇 '}
                                {index === 1 && '🥈 '}
                                {index === 2 && '🥉 '}
                                {/* Display rank number after medals */}
                                <span className="rank-number">{index + 1}</span>
                            </span>
                            
                            {/* Display the masked phone number or 'You' */}
                            <span className="player-name">
                                {isCurrentUser ? `**You** (${maskedNumber})` : maskedNumber}
                            </span>
                            
                            {/* Display coins */}
                            <span className="player-score">**{player.coins}** Coins</span>
                        </li>
                    )
                })}
            </ul>

            ---

            <div className="current-user-score">
                <h3>✨ Your Coin Balance</h3>
                <div className="user-score-box">
                    <span className="player-name">Phone: **{userPhoneNumber}**</span>
                    <span className="player-score">Balance: **{coin} Coins**</span>
                </div>
            </div>
            <div className="tabs-dropdown-wrapper">
  <div className="tabs-dropdown">
    <select
      value={activeTab}
      onChange={(e) => setActiveTab(e.target.value)}
      aria-label="Select Game Tab"
    >
      <option value="crossword">Daily Crossword</option>
      <option value="sudoku">Daily Sudoku</option>
      <option value="tech">Daily Tech Quiz</option>
      <option value="memory">Analytical</option>
      <option value="nback">Analogy</option>
      <option value="scoreboard">My Scoreboard</option>
    </select>
  </div>
</div>
        </div>
    );
// ... rest of renderContent function ...
      default:
        return null;
    }
  };

  return (
    <div
      className="tabs-container"
      style={{
        backgroundImage: `url(${gameBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      <button className="mobile-menu-button" onClick={toggleSidebar}>
      ☰
    </button>

    {/* Sidebar Overlay */}
    <div 
      className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
      onClick={closeSidebar}
    />

    {/* Mobile Sidebar */}
    <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">Mind Hub Games</div>
        <button className="close-sidebar" onClick={closeSidebar}>
          ×
        </button>
      </div>
   <div className="sidebar-tabs">

  <button className={`sidebar-tab ${activeTab === "crossword" ? "active" : ""}`} onClick={() => handleTabClick("crossword")}>
    🧩 Daily Crossword
  </button>
  <button className={`sidebar-tab ${activeTab === "sudoku" ? "active" : ""}`} onClick={() => handleTabClick("sudoku")}>
    🔢 Daily Sudoku
  </button>
  <button className={`sidebar-tab ${activeTab === "tech" ? "active" : ""}`} onClick={() => handleTabClick("tech")}>
    💡 Tech Quiz
  </button>
  <button className={`sidebar-tab ${activeTab === "memory" ? "active" : ""}`} onClick={() => handleTabClick("memory")}>
    🧠 Analytical
  </button>
   <button className={`sidebar-tab ${activeTab === "synonym" ? "active" : ""}`} onClick={() => setActiveTab("synonym")}>
    🔤 Synonym Puzzle
  </button>
  <button className={`sidebar-tab ${activeTab === "antonym" ? "active" : ""}`}  onClick={() => setActiveTab("antonym")}>
    🔡 Antonym Puzzle
  </button>
  <button className={`sidebar-tab ${activeTab === "nback" ? "active" : ""}`} onClick={() => handleTabClick("nback")}>
  🔄 Analogy
</button>
 <button className={`sidebar-tab ${activeTab === "instructions" ? "active" : ""}`}  onClick={() => setActiveTab("instructions")}>
    📖 Instructions
  </button>
  <button className={`sidebar-tab ${activeTab === "faq" ? "active" : ""}`} onClick={() => setActiveTab("faq")}>
    ❓ F&Q
  </button>
  <button className={`sidebar-tab ${activeTab === "scoreboard" ? "active" : ""}`} onClick={() => handleTabClick("scoreboard")}>
    🏆 Scoreboard
  </button>
   <button className={`sidebar-tab ${activeTab === "scoreboard" ? "active" : ""}`} onClick={handleLogout}>
    🔓 Logout
  </button>
</div>
    </div>

 


      <div className="tabs">
  <button className={activeTab === "crossword" ? "active" : ""} onClick={() => setActiveTab("crossword")}>
    🧩 Daily Crossword
  </button>
  <button className={activeTab === "sudoku" ? "active" : ""} onClick={() => setActiveTab("sudoku")}>
    🔢 Daily Sudoku
  </button>
  <button className={activeTab === "tech" ? "active" : ""} onClick={() => setActiveTab("tech")}>
    💡 Tech Quiz
  </button>
  <button className={activeTab === "memory" ? "active" : ""} onClick={() => setActiveTab("memory")}>
    🧠 Analytical
  </button>
   <button className={activeTab === "synonym" ? "active" : ""} onClick={() => setActiveTab("synonym")}>
    🔤 Synonym Puzzle
  </button>

  <button className={activeTab === "antonym" ? "active" : ""} onClick={() => setActiveTab("antonym")}>
    🔡 Antonym Puzzle
  </button>
  <button className={activeTab === "nback" ? "active" : ""} onClick={() => setActiveTab("nback")}>
    🔄 Analogy
  </button>
  <button className={activeTab === "instructions" ? "active" : ""} onClick={() => setActiveTab("instructions")}>
    📖 Instructions
  </button>
  <button className={activeTab === "faq" ? "active" : ""} onClick={() => setActiveTab("faq")}>
    ❓ F&Q
  </button>
  <button className={activeTab === "scoreboard" ? "active" : ""} onClick={() => setActiveTab("scoreboard")}>
    🏆 Scoreboard
  </button>
   <button className="logout-button" onClick={handleLogout}>
    🔓 Logout
  </button>
</div>
      <div className="tab-content">{renderContent()}</div>
      {showFirework && <Firework />}

    </div>
  );
};

export default GameTabs;