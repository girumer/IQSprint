const express = require('express');
const router = express.Router();
const Crossword = require('../models/Crossword');
const User = require('../models/users');
const Sudoku= require('../models/sudoku');
const TechQuiz = require('../models/TechQuiz');
const SynonymQuiz=require('../models/SynonymQuiz');
const AntonymQuiz = require('../models/AntonymQuiz');// Correct spelling
const NumberSequence = require('../models/NumberSequence');
const AnalogyQuiz = require('../models/AnalogyQuiz'); 
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/authMiddleware');
// Temporary in-memory storage (replace with DB later)


// POST /api/crossword/create
 // adjust path if needed
router.post('/dashboard/upload-sudoku', authMiddleware, requireAdmin, async (req, res) => {
  const { puzzle, solution } = req.body;

  if (!puzzle || !solution) {
    return res.status(400).json({ error: 'Puzzle and solution are required' });
  }

  try {
    const sudoku = new Sudoku({ puzzle, solution });
    await sudoku.save();
    res.status(201).json({ msg: 'Sudoku uploaded successfully', sudoku });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload Sudoku' });
  }
});
router.get('/dashboard/latest-sudoku', authMiddleware, async (req, res) => {
  try {
    const latest = await Sudoku.findOne().sort({ createdAt: -1 }).lean();
    if (!latest) return res.status(404).json({ error: 'No Sudoku found' });
    res.json({ puzzle: latest.puzzle });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch Sudoku' });
  }
});
// --- BACKEND CODE (Example Node.js/Express) ---
// POST endpoint to check the user's Sudoku solution
router.post('/sudoku/check-solution', authMiddleware, async (req, res) => {
    const { userBoard } = req.body;
    const phoneNumber = req.user.phoneNumber; // from the login token
    
    // --- Basic Input Validation ---
    if (!phoneNumber || !userBoard || !Array.isArray(userBoard) || userBoard.length !== 9) {
        return res.status(400).json({ error: 'Invalid request data. Requires phoneNumber and a 9x9 userBoard.' });
    }

    try {
        // 1. Fetch the latest puzzle and its SOLUTION from the database
        //    (Your model allows this!)
        const latestSudoku = await Sudoku.findOne().sort({ createdAt: -1 });
        
        if (!latestSudoku) {
            return res.status(404).json({ error: 'No active Sudoku puzzle found.' });
        }
        
        const puzzleSolution = latestSudoku.solution; 
        const puzzleId = latestSudoku._id.toString();

        // 2. Perform Validation
        //    The simplest way to compare two deep 2D arrays in Node.js is to stringify them.
        const isCorrect = JSON.stringify(userBoard) === JSON.stringify(puzzleSolution);

        if (isCorrect) {
            // 3. Find the user to check if they've already solved it
            const user = await User.findOne({ phoneNumber });

            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            
            // Check if this specific puzzle ID is in the user's solved list
            const alreadySolved = user.solvedPuzzles && user.solvedPuzzles.includes(puzzleId);

            if (alreadySolved) {
                // Return success, but award 0 coins
                return res.json({ isCorrect: true, coinsAwarded: 0, message: "Puzzle already solved." });
            }

            // 4. Award coin and mark as solved
            const awardedCoins = 1; 
            await User.updateOne(
                { phoneNumber },
                { 
                    $inc: { coins: awardedCoins }, 
                    $addToSet: { solvedPuzzles: puzzleId } // Add the ID to prevent re-awarding
                }
            );

            return res.json({ isCorrect: true, coinsAwarded: awardedCoins, message: "Solution correct! Coins awarded." });
        } else {
            // Incorrect solution
            return res.json({ isCorrect: false, message: "Incorrect solution. Try again." });
        }
    } catch (err) {
        console.error('Error checking Sudoku solution:', err);
        res.status(500).json({ error: 'Server error during validation.' });
    }
});

 // Ensure you export the router
router.post('/crossword/create', authMiddleware, requireAdmin, async (req, res) => {
  const { correctWord, initialLetters, hint } = req.body;

  if (!correctWord || !initialLetters || !hint) {
    return res.status(400).json({ error: 'Missing crossword data' });
  }

  // Save the new crossword
  const puzzle = new Crossword({ correctWord, initialLetters, hint });
  await puzzle.save();

  // Count total puzzles
  const total = await Crossword.countDocuments();

  // If more than 5, delete only the oldest one
  if (total > 5) {
    const oldest = await Crossword.findOne().sort({ createdAt: 1 });
    if (oldest) {
      await Crossword.deleteOne({ _id: oldest._id });
    }
  }

  res.status(201).json({ msg: 'Crossword saved' });
});


// GET /api/crossword
// GET /api/crossword?phoneNumber=...
router.get('/crossword', authMiddleware, async (req, res) => {
    const phoneNumber = req.user.phoneNumber; // from the login token

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const solvedIds = user.solvedCrosswords || [];

        // 1. Find the oldest crossword whose ID is NOT in the user's solved list
        const nextPuzzle = await Crossword.findOne({
            _id: { $nin: solvedIds }
        }).sort({ createdAt: 1 }); // Get the oldest unsolved one

        if (!nextPuzzle) {
            return res.json({ 
                puzzle: null, 
                message: "Congratulations! You have solved all current crosswords." 
            });
        }
        
        // 2. Hide the correct word before sending to the frontend
        const { correctWord, ...puzzleData } = nextPuzzle.toObject();

        res.json(puzzleData);

    } catch (err) {
        console.error("Error fetching unsolved crossword:", err);
        res.status(500).json({ error: "Server error" });
    }
});
router.post("/saveSolvedCrossword", authMiddleware, async (req, res) => {
  const { userId, crosswordId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicate save
    if (!user.solvedCrosswords.includes(crosswordId)) {
      user.solvedCrosswords.push(crosswordId);
      await user.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/getSolvedCrosswords/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ solvedCrosswords: user.solvedCrosswords });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/synonym/create', authMiddleware, requireAdmin, async (req, res) => {
    const { question, options, answer, explanation, hint } = req.body;

    if (!question || !options || answer == null || !explanation) {
        return res.status(400).json({ error: 'All fields except hint are required' });
    }

    try {
        const quiz = new SynonymQuiz({ question, options, answer, explanation, hint });
        await quiz.save();
        res.status(201).json({ msg: "Synonym quiz created", quiz });
    } catch (err) {
        console.error("Synonym upload error:", err);
        res.status(500).json({ error: "Server error saving synonym quiz" });
    }
});
router.get('/synonym', authMiddleware, async (req, res) => {
    const phoneNumber = req.user.phoneNumber; // from the login token

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 1. Get the list of quizzes this user has solved
        // ⚠️ Requires 'solvedSynonyms' field in the User model
        const solvedIds = user.solvedSynonyms || []; 

        // 2. Find the oldest quiz whose ID is NOT in the user's solved list
        const nextQuiz = await SynonymQuiz.findOne({
            _id: { $nin: solvedIds } // Find ID NOT IN the solved list
        }).sort({ createdAt: 1 }).lean(); // Get the oldest unsolved one

        if (!nextQuiz) {
            // Case 1: All available quizzes are solved
            return res.json({ 
                quiz: null, // Critical flag for the frontend
                message: "🎉 You've completed all available synonym quizzes! Check back later for new challenges." 
            });
        }
        
        // 3. Hide the correct answer index before sending
        const { answer, ...quizData } = nextQuiz; 
        
        // Case 2: Unsolved puzzle found
        res.json({ quiz: quizData });

    } catch (err) {
        console.error("Error fetching unsolved synonym quiz:", err);
        res.status(500).json({ error: "Server error" });
    }
});
router.post('/synonym/check', authMiddleware, async (req, res) => {
    const { quizId, selectedAnswer } = req.body;
    const phoneNumber = req.user.phoneNumber; // from the login token

    // 🎯 Step 1: Parse the incoming answer index to a number
    const selectedIndex = parseInt(selectedAnswer);

    if (!quizId || !phoneNumber || isNaN(selectedIndex)) {
        return res.status(400).json({ error: 'Missing required fields or invalid answer format.' });
    }

    try {
        const quiz = await SynonymQuiz.findById(quizId);
        const user = await User.findOne({ phoneNumber }); // Fetch user to check solved status
        
        if (!quiz || !user) return res.status(404).json({ error: "Quiz or User not found" });

        // Check if already solved
        const alreadySolved = user.solvedSynonyms && user.solvedSynonyms.includes(quizId);
        if (alreadySolved) {
             return res.json({ isCorrect: true, coinsAwarded: 0, message: "Quiz already solved." });
        }

        // 🎯 Step 2: Compare the numeric index (selectedIndex vs quiz.answer)
        const isCorrect = quiz.answer === selectedIndex; 

        let coinsAwarded = 0;

        if (isCorrect) {
            coinsAwarded = 1;

            // 🎯 Step 3: Award coin AND mark as solved
            await User.updateOne(
                { phoneNumber },
                { 
                    $inc: { coins: coinsAwarded },
                    $addToSet: { solvedSynonyms: quizId } // Mark as solved
                }
            );
            
            return res.json({ 
                isCorrect: true, 
                coinsAwarded: coinsAwarded, 
                explanation: quiz.explanation,
                message: "Solution correct! Coin awarded."
            });
        }

        res.json({ isCorrect: false, message: "Incorrect answer." });
        
    } catch (err) {
        console.error("Synonym check error:", err);
        res.status(500).json({ error: "Server error checking synonym" });
    }
});
router.post('/antonym/create', authMiddleware, requireAdmin, async (req, res) => {
    const { question, options, answer, explanation, hint } = req.body;
    
    // Parse the answer index to ensure it's a number
    const answerIndex = parseInt(answer);

    if (!question || !options || isNaN(answerIndex) || !explanation || !Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({ error: 'Question, 4 options, numeric answer index, and explanation are required' });
    }

    try {
        const quiz = new AntonymQuiz({ question, options, answer: answerIndex, explanation, hint });
        await quiz.save();
        // Changed msg to reflect Antonym
        res.status(201).json({ msg: "Antonym quiz created successfully", quiz }); 
    } catch (err) {
        console.error("Antonym upload error:", err);
        res.status(500).json({ error: "Server error saving antonym quiz" });
    }
});
// ✅ NEW: GET /antonyum - Load oldest UNSOLVED Antonym quiz for the user
router.get('/antonym', authMiddleware, async (req, res) => {
    const phoneNumber = req.user.phoneNumber; // from the login token

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const solvedIds = user.solvedAntonyms || []; // Use the new solvedAntonyms field

        // 1. Find the oldest quiz whose ID is NOT in the user's solved list
        const nextQuiz = await AntonymQuiz.findOne({
            _id: { $nin: solvedIds }
        }).sort({ createdAt: 1 }).lean(); // Get the oldest unsolved one

        if (!nextQuiz) {
            return res.json({ 
                quiz: null, // Signal to the frontend that all are solved
                message: "🎉 You've completed all available antonym quizzes! Check back later for new challenges." 
            });
        }
        
        // 2. Hide the correct answer index before sending
        const { answer, ...quizData } = nextQuiz; 
        
        res.json({ quiz: quizData }); // Return the puzzle data without the answer

    } catch (err) {
        console.error("Error fetching unsolved Antonym quiz:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// ✅ NEW: POST /antonyum/check - Check answer, award coin, and mark as solved
router.post('/antonym/check', authMiddleware, async (req, res) => {
    const { quizId, selectedAnswer } = req.body;
    const phoneNumber = req.user.phoneNumber; // from the login token
    
    // Parse the incoming answer index to a number
    const selectedIndex = parseInt(selectedAnswer);

    if (!quizId || !phoneNumber || isNaN(selectedIndex)) {
        return res.status(400).json({ error: 'Missing required fields or invalid answer format.' });
    }

    try {
        const quiz = await AntonymQuiz.findById(quizId);
        const user = await User.findOne({ phoneNumber });
        
        if (!quiz || !user) {
            return res.status(404).json({ error: "Quiz or User not found" });
        }

        // 1. Check if already solved
        const alreadySolved = user.solvedAntonyms && user.solvedAntonyms.includes(quizId);
        if (alreadySolved) {
            return res.json({ isCorrect: true, coinsAwarded: 0, message: "Quiz already solved." });
        }

        // 2. Check the answer (comparing number to number)
        const isCorrect = selectedIndex === quiz.answer;

        if (isCorrect) {
            // 3. Award coin and mark as solved
            const awardedCoins = 1;
            await User.updateOne(
                { phoneNumber },
                { 
                    $inc: { coins: awardedCoins },
                    $addToSet: { solvedAntonyms: quizId } // Mark as solved
                }
            );

            return res.json({ 
                isCorrect: true, 
                coinsAwarded: awardedCoins, 
                explanation: quiz.explanation,
                message: "Solution correct! Coin awarded."
            });
        } else {
            // 4. Incorrect answer
            return res.json({ isCorrect: false, message: "Incorrect answer." });
        }
    } catch (err) {
        console.error("Antonym check error:", err);
        res.status(500).json({ error: "Server error checking antonym" });
    }
});
// 🔄 Updated: POST /api/tech-quiz/create
router.post('/tech-quiz/create', authMiddleware, requireAdmin, async (req, res) => {
 // 🛑 CHANGE: Expect correctAnswerIndex instead of 'answer' string
 const { question, options, correctAnswerIndex } = req.body; 
 
 // Validate options length implicitly validates index if index is checked against options array length
 if (!question || !options || correctAnswerIndex == null || options.length <= correctAnswerIndex) { 
 return res.status(400).json({ error: 'Missing required fields or invalid answer index.' });
 }

 try {
 const newQuiz = new TechQuiz({
 question,
 options,
 correctAnswerIndex // Storing the index
 });
 await newQuiz.save();
 res.status(201).json({ message: 'Tech Quiz saved successfully!' });
 } catch (err) {
 console.error(err);
 res.status(500).json({ error: 'Failed to save Tech Quiz' });
 }
});
// Remember to import the models at the top:
// const TechQuiz = require('../models/TechQuiz');
// const User = require('../models/User'); // Assuming you use a User model

// POST /api/tech-quiz/check-answer
// 🔄 Updated: POST /api/tech-quiz/check-answer
router.post('/tech-quiz/check-answer', authMiddleware, async (req, res) => {
    // 🛑 CHANGE: Expect selectedAnswerIndex (0, 1, 2...) instead of 'selectedAnswer' string
    const { quizId, selectedAnswerIndex } = req.body;
    const phoneNumber = req.user.phoneNumber; // from the login token 

    if (!phoneNumber || !quizId || selectedAnswerIndex == null) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // 1. Fetch the quiz and the user
        const quiz = await TechQuiz.findById(quizId);
        const user = await User.findOne({ phoneNumber });

        if (!quiz || !user) {
            return res.status(404).json({ error: 'Quiz or User not found.' });
        }
        
        // 2. Check if already solved
        // 🛑 Ensure you use the new field: solvedTechQuizzes
        const alreadySolved = user.solvedTechQuizzes && user.solvedTechQuizzes.includes(quizId);
        if (alreadySolved) {
            return res.json({ isCorrect: true, coinsAwarded: 0, message: "Quiz already solved." });
        }
        
        // 3. Check if the answer is correct
        // 🛑 Compare the submitted index to the stored index
        const isCorrect = Number(selectedAnswerIndex) === quiz.correctAnswerIndex; 

        if (isCorrect) {
            // 4. Award coin and mark as solved
            const awardedCoins = 1; 
            await User.updateOne(
                { phoneNumber },
                { 
                    $inc: { coins: awardedCoins }, 
                    $addToSet: { solvedTechQuizzes: quizId } 
                }
            );

            return res.json({ isCorrect: true, coinsAwarded: awardedCoins, message: "Solution correct! Coin awarded." });
        } else {
            // 5. Incorrect answer
            return res.json({ isCorrect: false, message: "Incorrect answer." });
        }
    } catch (err) {
        console.error('Error checking Tech Quiz answer:', err);
        res.status(500).json({ error: 'Server error during validation.' });
    }
});
// Add these routes to your existing backend file

// (Coin balance is served by userRoutes.js: GET /api/user/coin)

router.get('/crossword/next', authMiddleware, async (req, res) => {
  try {
    const { currentPuzzleId } = req.query;

    // If no current ID, return the first puzzle (oldest)
    if (!currentPuzzleId) {
      const firstPuzzle = await Crossword.findOne().sort({ createdAt: 1 });
      return res.json(firstPuzzle);
    }

    // Get current puzzle
    const currentPuzzle = await Crossword.findById(currentPuzzleId);
    if (!currentPuzzle) {
      return res.status(404).json({ error: "Current puzzle not found" });
    }

    // Get the next puzzle by createdAt
    const nextPuzzle = await Crossword.findOne({
      createdAt: { $gt: currentPuzzle.createdAt }
    }).sort({ createdAt: 1 });

    if (!nextPuzzle) {
      return res.status(404).json({ error: "No more crossword puzzles" });
    }

    res.json(nextPuzzle);

  } catch (err) {
    console.error("Error fetching next crossword:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// POST /api/crossword/check-solution
router.post('/crossword/check-solution', authMiddleware, async (req, res) => {
    const { crosswordId, submittedWord } = req.body;
    const phoneNumber = req.user.phoneNumber; // from the login token
    
    // 1. Validate Input
    if (!phoneNumber || !crosswordId || !submittedWord) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // 2. Fetch the puzzle and the user
        const puzzle = await Crossword.findById(crosswordId);
        const user = await User.findOne({ phoneNumber });

        if (!puzzle || !user) {
            return res.status(404).json({ error: 'Puzzle or User not found.' });
        }
        
        // 3. Check if already solved
        const alreadySolved = user.solvedCrosswords && user.solvedCrosswords.includes(crosswordId);
        if (alreadySolved) {
            return res.json({ isCorrect: true, coinsAwarded: 0, message: "Puzzle already solved." });
        }
        
        // 4. Check the solution
        const isCorrect = submittedWord.toUpperCase() === puzzle.correctWord.toUpperCase();

        if (isCorrect) {
            // 5. Award coin and mark as solved
            const awardedCoins = 1; 
            await User.updateOne(
                { phoneNumber },
                { 
                    $inc: { coins: awardedCoins }, 
                    $addToSet: { solvedCrosswords: crosswordId } 
                }
            );

            return res.json({ isCorrect: true, coinsAwarded: awardedCoins, message: "Solution correct! Coin awarded." });
        } else {
            // 6. Incorrect answer
            return res.json({ isCorrect: false, message: "Incorrect answer." });
        }
    } catch (err) {
        console.error('Error checking crossword solution:', err);
        res.status(500).json({ error: 'Server error during validation.' });
    }
});
// GET /api/tech-quiz (For Frontend to fetch the latest quiz)
// 🔄 Updated: GET /api/tech-quiz
router.get('/tech-quiz', authMiddleware, async (req, res) => {
 const phoneNumber = req.user.phoneNumber; // from the login token

 if (!phoneNumber) {
 // Should not happen if frontend sends it, but good practice
 return res.status(400).json({ error: "Phone number is required" });
 }
 
 try {
 const user = await User.findOne({ phoneNumber });
 if (!user) {
 return res.status(404).json({ error: "User not found" });
 }

 // IDs the user has already solved for this quiz type
 const solvedIds = user.solvedTechQuizzes || [];

 // 1. Find the oldest quiz whose ID is NOT in the user's solved list
 const nextQuiz = await TechQuiz.findOne({
 _id: { $nin: solvedIds }
 }).sort({ createdAt: 1 }).lean(); 

 if (!nextQuiz) {
 // Case 1: All puzzles solved
 return res.json({ 
 quiz: null, // Critical flag for frontend to lock the view
 message: "🎉 You've completed all available tech quizzes! Check back later for new challenges." 
 });
 }
 
 // 2. Hide the correct answer index before sending to the frontend
 const { correctAnswerIndex, ...quizData } = nextQuiz;
 
 // Case 2: Unsolved puzzle found
 res.json({ quiz: quizData });

 } catch (err) {
 console.error("Error fetching unsolved tech quiz:", err);
 res.status(500).json({ error: "Server error" });
 }
});
// Import the new model

// POST /api/sequence/create (For Admin Upload)
router.post('/sequence/create', authMiddleware, requireAdmin, async (req, res) => {
    const { sequence, correctAnswer, hint } = req.body;
    
    if (!sequence || !correctAnswer || !hint) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newSequence = new NumberSequence({
            sequence,
            correctAnswer,
            hint
        });
        await newSequence.save();
        res.status(201).json({ message: 'Number Sequence saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save number sequence' });
    }
});

// GET /api/sequence (For Frontend to fetch the latest quiz)
router.get('/sequence', authMiddleware, async (req, res) => {
    const phoneNumber = req.user.phoneNumber; // from the login token

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const solvedIds = user.solvedSequences || []; 

        const nextQuiz = await NumberSequence.findOne({
            _id: { $nin: solvedIds } 
        }).sort({ createdAt: 1 }).lean(); 
        
        if (!nextQuiz) {
            return res.json({ 
                quiz: null, 
                message: "🎉 You've completed all available number sequences! Check back later for new challenges." 
            });
        }
        
        const { correctAnswer, ...puzzleData } = nextQuiz; 
        
        res.json({ quiz: puzzleData });

    } catch (err) {
        console.error("Error fetching unsolved number sequence:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// 🆕 POST /sequence/check-solution (This route is currently missing, causing the 404 error)
router.post('/sequence/check-solution', authMiddleware, async (req, res) => {
    const { quizId, selectedAnswer } = req.body;
    const phoneNumber = req.user.phoneNumber; // from the login token

    // --- Input Validation ---
    if (!phoneNumber || !quizId || selectedAnswer === undefined) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // 1. Fetch the sequence and the user
        const sequence = await NumberSequence.findById(quizId);
        const user = await User.findOne({ phoneNumber });

        if (!sequence || !user) {
            return res.status(404).json({ error: 'Sequence or User not found.' });
        }
        
        // 2. Check if the answer is correct
        // Note: selectedAnswer comes as a string and needs to be converted to a number for comparison
        const isCorrect = Number(selectedAnswer) === sequence.correctAnswer;

        if (isCorrect) {
            // Check if this specific quiz ID is already solved by the user
            const alreadySolved = user.solvedSequences && user.solvedSequences.includes(quizId);

            if (alreadySolved) {
                return res.json({ isCorrect: true, coinsAwarded: 0, message: "Puzzle already solved." });
            }

            // 3. Award coin and mark as solved
            const awardedCoins = 1; 
            await User.updateOne(
                { phoneNumber },
                { 
                    $inc: { coins: awardedCoins }, 
                    // ⚠️ You must ensure 'solvedSequences: [String]' is in your User model
                    $addToSet: { solvedSequences: quizId } 
                }
            );

            return res.json({ isCorrect: true, coinsAwarded: awardedCoins, message: "Solution correct! Coin awarded." });
        } else {
            // Incorrect answer
            return res.json({ isCorrect: false, message: "Incorrect answer." });
        }
    } catch (err) {
        console.error('Error checking Sequence answer:', err);
        res.status(500).json({ error: 'Server error during validation.' });
    }
});
// Add to your imports:

// Assuming User model is already imported:
// const User = require('../models/users'); 

// 1. POST /analogy/create (Admin Upload)
router.get('/top-players', authMiddleware, async (req, res) => {
    try {
        // 1. Query the database for users
        const topPlayers = await User.find(
            // Optional: You can filter here if needed, e.g., { coins: { $gt: 0 } }
        )
        .select('phoneNumber coins') // 2. Select only the necessary fields
        .sort({ coins: -1 })         // 3. Sort in descending order (-1) by coins
        .limit(50);                  // 4. Limit the results (e.g., top 50)
        
        // 5. Send the sorted list back to the frontend
        res.json(topPlayers);

    } catch (err) {
        console.error("Leaderboard fetch error:", err);
        res.status(500).json({ message: "Failed to fetch leaderboard data." });
    }
});
// Analogy Route Fix 1: POST /analogy/create
router.post('/analogy/create', authMiddleware, requireAdmin, async (req, res) => {
 const { question, options, answer, explanation, hint } = req.body; // <-- Destructure 'hint'

 // The 'hint' is optional based on your model, so we only check the required fields.
 if (!question || !options || answer == null || !explanation) {
 // Check that options is an array of length 4, which is handled by the model's validator on save, 
    // but a quick check here improves error handling.
    if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({ error: 'Question, 4 options, answer index, and explanation are required.' });
    }
    return res.status(400).json({ error: 'Question, options, answer index, and explanation are required.' });
 }

 try {
 // Pass 'hint' to the AnalogyQuiz constructor
 const analogy = new AnalogyQuiz({ question, options, answer, explanation, hint: hint || '' }); 
 await analogy.save();
 res.status(201).json({ msg: 'Analogy uploaded successfully', analogy });
 } catch (err) {
 console.error('Upload error:', err.message); // Log the specific Mongoose error
 // Mongoose validation errors will often be status 400
 if (err.name === 'ValidationError') {
 return res.status(400).json({ error: err.message });
 }
 res.status(500).json({ error: 'Failed to upload analogy' });
 }
});
// 2. GET /analogy (Fetch for Frontend)
// Analogy Route Fix 2: GET /analogy (Load oldest UNSOLVED quiz)
router.get('/analogy', authMiddleware, async (req, res) => {
 const phoneNumber = req.user.phoneNumber; // from the login token

 if (!phoneNumber) {
 return res.status(400).json({ error: "Phone number is required" });
 }

 try {
 const user = await User.findOne({ phoneNumber });
 if (!user) {
 return res.status(404).json({ error: "User not found" });
 }

 // IDs the user has already solved for this quiz type
 // ⚠️ IMPORTANT: Ensure 'solvedAnalogies' field exists in your User model!
 const solvedIds = user.solvedAnalogies || [];

 // 1. Find the oldest quiz whose ID is NOT in the user's solved list
 const nextPuzzle = await AnalogyQuiz.findOne({
 _id: { $nin: solvedIds }
 }).sort({ createdAt: 1 }).lean(); // Get the oldest unsolved one

 if (!nextPuzzle) {
 // Case 1: All puzzles solved
 return res.json({ 
 puzzle: null, // Critical flag for frontend to lock the view
 message: "🎉 You've completed all available analogy quizzes! Check back later for new challenges." 
 });
 }
 
 // 2. Hide the correct answer index before sending to the frontend
 const { answer, ...puzzleData } = nextPuzzle; // 'answer' is the correct index
 
 // Case 2: Unsolved puzzle found
 res.json({ puzzle: puzzleData });

 } catch (err) {
 console.error("Error fetching unsolved analogy quiz:", err);
 res.status(500).json({ error: "Server error" });
 }
});

// 3. POST /analogy/check-solution (Validation and Coin Award)
// POST /analogy/check-solution (Validation and Coin Award)
// Analogy Route Fix 3: POST /analogy/check-solution (Complete logic)
router.post('/analogy/check-solution', authMiddleware, async (req, res) => {
    // Note: selectedAnswer will now be the index (0, 1, 2, 3)
    const { quizId, selectedAnswer } = req.body;
    const phoneNumber = req.user.phoneNumber; // from the login token 
    
    // Convert selectedAnswer to a number for comparison
    const selectedIndex = parseInt(selectedAnswer); 

    if (!phoneNumber || !quizId || isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
        return res.status(400).json({ error: 'Invalid request data or missing fields.' });
    }

    try {
        const quiz = await AnalogyQuiz.findById(quizId);
        const user = await User.findOne({ phoneNumber });

        if (!quiz || !user) {
            return res.status(404).json({ error: 'Quiz or User not found.' });
        }
        
        // 1. Check if already solved
        const alreadySolved = user.solvedAnalogies && user.solvedAnalogies.includes(quizId);
        if (alreadySolved) {
            return res.json({ isCorrect: true, coinsAwarded: 0, message: "Puzzle already solved." });
        }

        // 2. Check the answer
        const isCorrect = selectedIndex === quiz.answer;

        if (isCorrect) {
            // 3. Award coin and mark as solved
            const awardedCoins = 1; 
            await User.updateOne(
                { phoneNumber },
 { 
 $inc: { coins: awardedCoins }, 
 // ⚠️ Ensure 'solvedAnalogies: [String]' is in your User model
 $addToSet: { solvedAnalogies: quizId } 
 }
 );

 return res.json({ 
 isCorrect: true, 
 coinsAwarded: awardedCoins, 
 explanation: quiz.explanation, // Provide explanation on success
 message: "Solution correct! Coin awarded." 
 });
 } else {
 // 4. Incorrect answer
 return res.json({ isCorrect: false, message: "Incorrect answer." });
 }
 } catch (err) {
 console.error('Error checking Analogy answer:', err);
 res.status(500).json({ error: 'Server error during validation.' });
 }
});
module.exports = router;
