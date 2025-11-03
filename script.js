// DOM Elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote');
const shareButtons = document.querySelectorAll('.share-btn');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

// State variables
let currentQuote = {};

// Initialize the app
function init() {
    // Set up event listeners
    newQuoteBtn.addEventListener('click', getRandomQuote);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', handleShare);
    });
    
    // Load initial quote
    getRandomQuote();
}

// Get a random quote from API
async function getRandomQuote() {
    showLoading();
    hideError();
    
    try {
        // Using a reliable quotes API
        const response = await fetch('https://api.quotable.io/random');
        
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        
        currentQuote = {
            text: data.content,
            author: data.author
        };
        
        displayQuote(currentQuote);
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        showError();
        // Fallback to a local quote if API fails
        fallbackToLocalQuote();
    } finally {
        hideLoading();
    }
}

// Fallback to local quotes if API fails
function fallbackToLocalQuote() {
    const localQuotes = [
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        },
        {
            text: "Innovation distinguishes between a leader and a follower.",
            author: "Steve Jobs"
        },
        {
            text: "Your time is limited, so don't waste it living someone else's life.",
            author: "Steve Jobs"
        },
        {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "It is during our darkest moments that we must focus to see the light.",
            author: "Aristotle"
        },
        {
            text: "Whoever is happy will make others happy too.",
            author: "Anne Frank"
        },
        {
            text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
            author: "Ralph Waldo Emerson"
        },
        {
            text: "You will face many defeats in life, but never let yourself be defeated.",
            author: "Maya Angelou"
        },
        {
            text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
            author: "Nelson Mandela"
        },
        {
            text: "In the end, it's not the years in your life that count. It's the life in your years.",
            author: "Abraham Lincoln"
        }
    ];
    
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    currentQuote = localQuotes[randomIndex];
    
    displayQuote(currentQuote);
}

// Display the quote
function displayQuote(quote) {
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `— ${quote.author}`;
    
    // Add animation effect
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;
    
    setTimeout(() => {
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
    }, 300);
}

// Show loading state
function showLoading() {
    loadingElement.style.display = 'block';
    quoteText.style.display = 'none';
    quoteAuthor.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingElement.style.display = 'none';
    quoteText.style.display = 'block';
    quoteAuthor.style.display = 'block';
}

// Show error message
function showError() {
    errorElement.style.display = 'block';
}

// Hide error message
function hideError() {
    errorElement.style.display = 'none';
}

// Handle sharing
function handleShare(e) {
    const platform = e.target.closest('.share-btn').classList[1];
    const quote = `"${currentQuote.text}" — ${currentQuote.author}`;
    let url = '';
    
    switch (platform) {
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(quote)}`;
            break;
        case 'linkedin':
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(quote)}`;
            break;
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(quote)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(quote).then(() => {
                // Show temporary success message
                const originalIcon = e.target.closest('.share-btn').innerHTML;
                e.target.closest('.share-btn').innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    e.target.closest('.share-btn').innerHTML = originalIcon;
                }, 1500);
            });
            return;
    }
    
    if (url) {
        window.open(url, '_blank', 'width=600,height=400');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);