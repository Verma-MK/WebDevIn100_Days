const QuestionDatabase = {
    math: {
        easy: [
            {
                question: "What is 12 + 15?",
                options: ["25", "27", "29", "31"],
                correct: 1,
                points: 10
            },
            {
                question: "What is 8 × 7?",
                options: ["54", "56", "58", "60"],
                correct: 1,
                points: 10
            },
            {
                question: "What is 64 ÷ 8?",
                options: ["6", "7", "8", "9"],
                correct: 2,
                points: 10
            },
            {
                question: "What is 25% of 80?",
                options: ["15", "20", "25", "30"],
                correct: 1,
                points: 15
            },
            {
                question: "What is the square root of 144?",
                options: ["10", "11", "12", "13"],
                correct: 2,
                points: 15
            },
            {
                question: "If x + 5 = 12, what is x?",
                options: ["5", "6", "7", "8"],
                correct: 2,
                points: 15
            },
            {
                question: "What is 2³ (2 to the power of 3)?",
                options: ["6", "8", "9", "12"],
                correct: 1,
                points: 20
            },
            {
                question: "What is the area of a rectangle with length 8 and width 5?",
                options: ["35", "40", "45", "50"],
                correct: 1,
                points: 20
            },
            {
                question: "What is 15% of 200?",
                options: ["25", "30", "35", "40"],
                correct: 1,
                points: 15
            },
            {
                question: "What is 7 × 9?",
                options: ["61", "63", "65", "67"],
                correct: 1,
                points: 10
            }
        ],
        medium: [
            {
                question: "Solve: 3x + 7 = 22",
                options: ["x = 3", "x = 4", "x = 5", "x = 6"],
                correct: 2,
                points: 25
            },
            {
                question: "What is the value of π (pi) rounded to 2 decimal places?",
                options: ["3.12", "3.14", "3.16", "3.18"],
                correct: 1,
                points: 20
            },
            {
                question: "If a triangle has angles of 60°, 60°, and x°, what is x?",
                options: ["40°", "50°", "60°", "70°"],
                correct: 2,
                points: 25
            },
            {
                question: "What is the slope of the line y = 2x + 3?",
                options: ["1", "2", "3", "5"],
                correct: 1,
                points: 30
            },
            {
                question: "What is the circumference of a circle with radius 7? (Use π ≈ 3.14)",
                options: ["42.98", "43.96", "44.94", "45.92"],
                correct: 1,
                points: 30
            }
        ]
    },

    science: {
        matches: [
            { item: "H2O", target: "Water", category: "chemistry" },
            { item: "CO2", target: "Carbon Dioxide", category: "chemistry" },
            { item: "NaCl", target: "Salt", category: "chemistry" },
            { item: "O2", target: "Oxygen", category: "chemistry" },
            { item: "Heart", target: "Pumps Blood", category: "biology" },
            { item: "Lungs", target: "Exchange Gases", category: "biology" },
            { item: "Brain", target: "Controls Body", category: "biology" },
            { item: "Liver", target: "Filters Toxins", category: "biology" },
            { item: "Mercury", target: "Closest to Sun", category: "astronomy" },
            { item: "Venus", target: "Hottest Planet", category: "astronomy" },
            { item: "Mars", target: "Red Planet", category: "astronomy" },
            { item: "Jupiter", target: "Largest Planet", category: "astronomy" },
            { item: "Force", target: "F = ma", category: "physics" },
            { item: "Energy", target: "E = mc²", category: "physics" },
            { item: "Power", target: "P = VI", category: "physics" },
            { item: "Velocity", target: "v = d/t", category: "physics" }
        ]
    },

    english: {
        words: [
            {
                word: "EDUCATION",
                scrambled: "NOITACUDE",
                hint: "The process of learning and acquiring knowledge",
                difficulty: "medium",
                points: 20
            },
            {
                word: "KNOWLEDGE",
                scrambled: "EGDELWONK",
                hint: "Information and understanding gained through experience",
                difficulty: "medium",
                points: 20
            },
            {
                word: "STUDENT",
                scrambled: "TNEDUTS",
                hint: "A person who is learning at a school or university",
                difficulty: "easy",
                points: 15
            },
            {
                word: "TEACHER",
                scrambled: "REHCAET",
                hint: "A person who instructs students",
                difficulty: "easy",
                points: 15
            },
            {
                word: "MATHEMATICS",
                scrambled: "SCITAMEHTAM",
                hint: "The study of numbers, quantities, and shapes",
                difficulty: "hard",
                points: 25
            },
            {
                word: "SCIENCE",
                scrambled: "ECNEICS",
                hint: "The study of the natural world through observation",
                difficulty: "easy",
                points: 15
            },
            {
                word: "LIBRARY",
                scrambled: "YRARBIL",
                hint: "A place where books are kept for reading",
                difficulty: "medium",
                points: 20
            },
            {
                word: "COMPUTER",
                scrambled: "RETUPMOC",
                hint: "An electronic device for processing data",
                difficulty: "easy",
                points: 15
            },
            {
                word: "UNIVERSITY",
                scrambled: "YTISREVINU",
                hint: "An institution of higher education",
                difficulty: "hard",
                points: 25
            },
            {
                word: "HOMEWORK",
                scrambled: "KROWEMOH",
                hint: "School assignments done at home",
                difficulty: "easy",
                points: 15
            },
            {
                word: "EXPERIMENT",
                scrambled: "TNEMIREPXE",
                hint: "A scientific test to discover something",
                difficulty: "hard",
                points: 25
            },
            {
                word: "CLASSROOM",
                scrambled: "MOORSALC",
                hint: "A room where lessons take place",
                difficulty: "medium",
                points: 20
            }
        ],
        vocabulary: [
            {
                word: "AMBITIOUS",
                definition: "Having a strong desire for success or achievement",
                options: ["Lazy", "Determined", "Confused", "Tired"],
                correct: 1,
                points: 20
            },
            {
                word: "ELOQUENT",
                definition: "Fluent and persuasive in speaking or writing",
                options: ["Silent", "Articulate", "Rude", "Boring"],
                correct: 1,
                points: 25
            },
            {
                word: "RESILIENT",
                definition: "Able to recover quickly from difficulties",
                options: ["Weak", "Strong", "Fragile", "Broken"],
                correct: 1,
                points: 20
            }
        ]
    },

    trivia: [
        {
            question: "What is the capital of Australia?",
            options: ["Sydney", "Melbourne", "Canberra", "Perth"],
            correct: 2,
            category: "Geography",
            points: 15
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
            correct: 1,
            category: "Art",
            points: 15
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: 3,
            category: "Geography",
            points: 10
        },
        {
            question: "In which year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correct: 2,
            category: "History",
            points: 15
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2,
            category: "Science",
            points: 20
        },
        {
            question: "Which planet is known as the 'Morning Star'?",
            options: ["Mars", "Venus", "Jupiter", "Mercury"],
            correct: 1,
            category: "Science",
            points: 20
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correct: 1,
            category: "Literature",
            points: 15
        },
        {
            question: "What is the smallest country in the world?",
            options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
            correct: 2,
            category: "Geography",
            points: 25
        },
        {
            question: "Which element has the atomic number 1?",
            options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
            correct: 1,
            category: "Science",
            points: 20
        },
        {
            question: "In which country would you find Machu Picchu?",
            options: ["Chile", "Bolivia", "Peru", "Ecuador"],
            correct: 2,
            category: "Geography",
            points: 20
        },
        {
            question: "What is the longest river in the world?",
            options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
            correct: 1,
            category: "Geography",
            points: 20
        },
        {
            question: "Who developed the theory of relativity?",
            options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
            correct: 1,
            category: "Science",
            points: 15
        },
        {
            question: "What is the currency of Japan?",
            options: ["Yuan", "Won", "Yen", "Rupee"],
            correct: 2,
            category: "Geography",
            points: 10
        },
        {
            question: "Which vitamin is produced when skin is exposed to sunlight?",
            options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
            correct: 3,
            category: "Science",
            points: 15
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Iron", "Diamond", "Quartz", "Granite"],
            correct: 1,
            category: "Science",
            points: 15
        }
    ]
};

// Utility functions for question management
const QuestionUtils = {
    // Get random questions from a category
    getRandomQuestions(category, count = 10) {
        const questions = QuestionDatabase[category];
        if (!questions) return [];

        if (Array.isArray(questions)) {
            return this.shuffleArray([...questions]).slice(0, count);
        }

        // For math questions with difficulty levels
        if (questions.easy && questions.medium) {
            const allQuestions = [...questions.easy, ...(questions.medium || [])];
            return this.shuffleArray(allQuestions).slice(0, count);
        }

        return [];
    },

    // Get random science matches
    getRandomMatches(count = 8) {
        const matches = QuestionDatabase.science.matches;
        return this.shuffleArray([...matches]).slice(0, count);
    },

    // Get random words for word game
    getRandomWords(count = 5) {
        const words = QuestionDatabase.english.words;
        return this.shuffleArray([...words]).slice(0, count);
    },

    // Get vocabulary questions
    getVocabularyQuestions(count = 5) {
        const vocab = QuestionDatabase.english.vocabulary;
        return this.shuffleArray([...vocab]).slice(0, count);
    },

    // Shuffle array utility
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Get questions by difficulty
    getQuestionsByDifficulty(category, difficulty, count = 5) {
        const questions = QuestionDatabase[category];
        if (!questions || !questions[difficulty]) return [];
        
        return this.shuffleArray([...questions[difficulty]]).slice(0, count);
    },

    // Mix different difficulty levels
    getMixedDifficultyQuestions(category, easyCount = 3, mediumCount = 2) {
        const easy = this.getQuestionsByDifficulty(category, 'easy', easyCount);
        const medium = this.getQuestionsByDifficulty(category, 'medium', mediumCount);
        
        return this.shuffleArray([...easy, ...medium]);
    }
};

// Export for use in other modules
window.QuestionDatabase = QuestionDatabase;
window.QuestionUtils = QuestionUtils;
