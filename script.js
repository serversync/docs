// DOM Elements
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Toggle mobile menu
const toggleMenu = () => {
    $('.sidebar').classList.toggle('active');
    $('.overlay').classList.toggle('active');
};

// Show section
const showSection = (sectionId, fromClick = false) => {
    $$('.section').forEach(s => s.classList.remove('active'));
    $$('.nav-link').forEach(l => l.classList.remove('active'));

    $(`#${sectionId}`).classList.add('active');
    $(`[data-section="${sectionId}"]`).classList.add('active');
    
    history.pushState({ section: sectionId }, '', sectionId === 'inicio' ? '/' : `/${sectionId}`);
    
    if (fromClick && window.innerWidth <= 1024) toggleMenu();
};

// Handle browser navigation
const handlePopState = () => {
    const path = location.pathname;
    showSection(path === '/' ? 'inicio' : path.substring(1), false);
};

// Load initial section based on URL
const loadInitialSection = () => {
    const path = location.pathname;
    const section = path === '/' ? 'inicio' : path.substring(1);
    
    if ($(`#${section}`)) {
        showSection(section, false);
    } else {
        history.replaceState({ section: 'inicio' }, '', '/');
        showSection('inicio', false);
    }
};

// Copy code
const copyCode = icon => {
    const code = icon.previousElementSibling.innerText
        .split('\n')
        .map(line => line.trim())
        .join('\n');

    navigator.clipboard.writeText(code)
        .then(() => {
            icon.classList.add('copied');
            setTimeout(() => icon.classList.remove('copied'), 1000);
        })
        .catch(err => console.error('Error copying code:', err));
};

// Event Listeners
$$('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showSection(link.getAttribute('data-section'), true);
    });
});

window.addEventListener('popstate', handlePopState);
loadInitialSection();

// Botão Voltar ao Topo
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        $('.backToTop').classList.add('visible');
    } else {
        $('.backToTop').classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Pesquisa na documentação
function searchDocs(query) {
    const normalizedQuery = query.toLowerCase();
    
    $$('.section').forEach(section => {
        const content = section.textContent.toLowerCase();
        const matches = content.includes(normalizedQuery);
        
        if (matches) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

const searchInput = $('.searchDocs');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 2) {
        searchDocs(query);
    } else {
        $$('.section').forEach(section => {
            section.style.display = '';
        });
        const activeSection = $('.section.active');
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }
});

