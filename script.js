// Function to fetch and parse the YAML file
async function loadMenu() {
    try {
        // Load the YAML file
        const response = await fetch('menu.yml');
        const yamlText = await response.text();

        // Parse the YAML to JSON
        const menuData = jsyaml.load(yamlText);

        // Generate HTML for the menu
        renderMenu(menuData);

        // Generate sticky menu
        setupStickyMenu(menuData);
    } catch (error) {
        console.error("Error loading menu:", error);
    }
}

// Function to render the menu
function renderMenu(menuData) {
    const container = document.getElementById('menu-container');
    menuData.sections.forEach((section, index) => {
        // Create section title and icon
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'menu-container-title';

        const title = document.createElement('h2');
        title.className = 'menu-title';
        title.textContent = section.title;
        title.id = `section-${index}`; // Assign an ID to each section

        const icon = document.createElement('img');
        icon.src = section.icon;
        icon.alt = section.title;

        sectionDiv.appendChild(title);
        sectionDiv.appendChild(icon);
        container.appendChild(sectionDiv);

        // Create menu items
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'menu-section';
        itemsDiv.id = `menu-section-${index}`; // Assign ID for each menu section

        section.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';

            // Create a wrapper for name and description
            const itemInfoDiv = document.createElement('div');
            itemInfoDiv.className = 'item-info';

            const itemName = document.createElement('span');
            itemName.textContent = item.name;
            itemName.className = 'item-name';

            const itemDescription = document.createElement('span'); // توضیحات
            itemDescription.textContent = item.description != undefined && item.description && item.description != null && item.description != "" ? '( ' + item.description + ' )':'';
            itemDescription.className = 'item-description';

            // Add name and description to the wrapper
            itemInfoDiv.appendChild(itemName);
            itemInfoDiv.appendChild(itemDescription);

            const itemPrice = document.createElement('span');
            itemPrice.textContent = item.price;
            itemPrice.className = 'item-price';

            // Add everything to the menu item
            itemDiv.appendChild(itemInfoDiv); // Add wrapper for name and description
            itemDiv.appendChild(itemPrice);
            itemsDiv.appendChild(itemDiv);
        });

        container.appendChild(itemsDiv);
    });
}

// Function to setup the sticky menu
function setupStickyMenu(menuData) {
    const stickyMenu = document.getElementById('sticky-menu');
    const sections = document.querySelectorAll('.menu-container-title');
    const menuItems = [];

    menuData.sections.forEach((section, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'sticky-menu-item';

        const icon = document.createElement('img');
        icon.src = section.icon;
        icon.alt = section.title;

        const text = document.createElement('span');
        text.textContent = section.title;

        menuItem.appendChild(icon);
        menuItem.appendChild(text);

        // Add click event to scroll to section
        menuItem.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
            updateActiveMenuItem(index);
        });

        stickyMenu.appendChild(menuItem);
        menuItems.push(menuItem);
    });

    function updateActiveMenuItem(activeIndex) {
        menuItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
        });
        scrollToActiveItem(activeIndex);
    }

    function scrollToActiveItem(activeIndex) {
        const activeItem = menuItems[activeIndex];
        const stickyMenuRect = stickyMenu.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();

        if (activeItemRect.left < stickyMenuRect.left || activeItemRect.right > stickyMenuRect.right) {
            activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }

    // Scroll tracking with IntersectionObserver
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Array.from(sections).indexOf(entry.target);
                    updateActiveMenuItem(index);
                }
            });
        },
        { threshold: 0.6 }
    );

    sections.forEach(section => observer.observe(section));
}

// Load the menu on page load
loadMenu();
