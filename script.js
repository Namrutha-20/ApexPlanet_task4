

document.addEventListener('DOMContentLoaded', () => {

  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-text">${message}</span>
    `;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, 3000);
  }

  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = htmlElement.getAttribute('data-theme');
    const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    
    showToast(`Switched to ${targetTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });

  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', !isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let currentActive = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 120) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  });

  const todoForm = document.getElementById('todo-form');
  const todoTitleInput = document.getElementById('todo-title');
  const todoCategoryInput = document.getElementById('todo-category');
  const todoDueDateInput = document.getElementById('todo-due-date');
  const todoSubmitBtn = document.getElementById('todo-submit-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const editTaskIdInput = document.getElementById('edit-task-id');
  
  const todoList = document.getElementById('todo-list');
  const todoCountAll = document.getElementById('todo-count-all');
  const todoCountPending = document.getElementById('todo-count-pending');
  const todoCountCompleted = document.getElementById('todo-count-completed');
  const todoClearBtn = document.getElementById('todo-clear-btn');
  const todoFilterButtons = document.querySelectorAll('.todo-filter-btn');

  const defaultTasks = [
    {
      id: 1,
      title: 'Design high-fidelity homepage mockup',
      category: 'Work',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], 
      completed: false
    },
    {
      id: 2,
      title: 'Review catalog product layout performance',
      category: 'Work',
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], 
      completed: false
    },
    {
      id: 3,
      title: 'Research CSS Variable theme configurations',
      category: 'Study',
      dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
      completed: true
    }
  ];

  todoDueDateInput.value = new Date().toISOString().split('T')[0];

  let tasks = JSON.parse(localStorage.getItem('tasks'));
  if (!tasks) {
    tasks = defaultTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  let currentTodoFilter = 'all';

  renderTasks();
  updateTodoStats();

  function updateTodoStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    todoCountAll.textContent = total;
    todoCountPending.textContent = pending;
    todoCountCompleted.textContent = completed;
  }

  function formatDueDate(dateStr) {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function isOverdue(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj < today;
  }

  function renderTasks() {
    todoList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentTodoFilter === 'pending') {
      filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentTodoFilter === 'completed') {
      filteredTasks = tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
      todoList.innerHTML = `
        <li class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line><line x1="9" y1="19" x2="13" y2="19"></line></svg>
          <p>No ${currentTodoFilter !== 'all' ? currentTodoFilter : ''} tasks found.</p>
        </li>
      `;
      return;
    }

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;
      
      const categoryClass = `badge-${task.category.toLowerCase()}`;
      const overdueClass = (!task.completed && isOverdue(task.dueDate)) ? 'overdue' : '';
      
      li.innerHTML = `
        <div class="todo-item-left">
          <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
          <div class="todo-item-info">
            <span class="todo-item-title" title="${task.title}">${task.title}</span>
            <div class="todo-item-meta">
              <span class="todo-badge ${categoryClass}">${task.category}</span>
              <span class="todo-date ${overdueClass}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${formatDueDate(task.dueDate)} ${overdueClass ? '(Overdue)' : ''}
              </span>
            </div>
          </div>
        </div>
        <div class="todo-item-right">
          <button class="action-btn edit-btn" title="Edit Task">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="action-btn delete-btn" title="Delete Task">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      `;

      const checkbox = li.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        li.classList.toggle('completed', task.completed);
        updateTodoStats();
        
        if (task.completed) {
          showToast('Task completed! Great job.', 'success');
        } else {
          showToast('Task marked active.', 'info');
        }

        if (currentTodoFilter !== 'all') {
          setTimeout(() => renderTasks(), 300);
        }
      });

      li.querySelector('.edit-btn').addEventListener('click', () => {
        enterEditMode(task);
      });

      li.querySelector('.delete-btn').addEventListener('click', () => {
        
        li.style.transform = 'translateX(100%)';
        li.style.opacity = '0';
        li.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          tasks = tasks.filter(t => t.id !== task.id);
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTasks();
          updateTodoStats();
          showToast('Task deleted successfully.', 'info');
        }, 300);
      });

      todoList.appendChild(li);
    });
  }

  todoFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      todoFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTodoFilter = btn.getAttribute('data-filter');
      renderTasks();
    });
  });

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = todoTitleInput.value.trim();
    const category = todoCategoryInput.value;
    const dueDate = todoDueDateInput.value;
    const isEditMode = editTaskIdInput.value !== '';

    if (!title || !dueDate) return;

    if (isEditMode) {
      
      const taskId = parseInt(editTaskIdInput.value);
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].category = category;
        tasks[taskIndex].dueDate = dueDate;
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        showToast('Task updated successfully!', 'success');
        exitEditMode();
      }
    } else {
      
      const newTask = {
        id: Date.now(),
        title,
        category,
        dueDate,
        completed: false
      };
      
      tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      showToast('New task added!', 'success');
    }

    todoTitleInput.value = '';
    todoDueDateInput.value = new Date().toISOString().split('T')[0];
    renderTasks();
    updateTodoStats();
  });

  function enterEditMode(task) {
    todoTitleInput.value = task.title;
    todoCategoryInput.value = task.category;
    todoDueDateInput.value = task.dueDate;
    editTaskIdInput.value = task.id;
    
    todoSubmitBtn.textContent = 'Update Task';
    todoSubmitBtn.className = 'btn btn-secondary btn-block';
    cancelEditBtn.classList.remove('hidden');
    todoTitleInput.focus();
  }

  function exitEditMode() {
    todoTitleInput.value = '';
    todoCategoryInput.value = 'Work';
    todoDueDateInput.value = new Date().toISOString().split('T')[0];
    editTaskIdInput.value = '';
    
    todoSubmitBtn.textContent = 'Add Task';
    todoSubmitBtn.className = 'btn btn-primary btn-block';
    cancelEditBtn.classList.add('hidden');
  }

  cancelEditBtn.addEventListener('click', () => {
    exitEditMode();
    showToast('Editing cancelled.', 'info');
  });

  todoClearBtn.addEventListener('click', () => {
    if (tasks.length === 0) {
      showToast('No tasks to clear.', 'error');
      return;
    }
    
    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
      tasks = [];
      localStorage.setItem('tasks', JSON.stringify(tasks));
      exitEditMode();
      renderTasks();
      updateTodoStats();
      showToast('All tasks cleared.', 'info');
    }
  });

  const productGrid = document.getElementById('product-grid');
  const productSearch = document.getElementById('product-search');
  const productSort = document.getElementById('product-sort');
  const priceSlider = document.getElementById('price-slider');
  const priceSliderValue = document.getElementById('price-slider-value');
  const categoryChips = document.querySelectorAll('.chip-btn');

  const products = [
    {
      id: 101,
      name: 'Vortex Mechanical Keyboard',
      category: 'Office',
      price: 129.99,
      rating: 4.8,
      featured: true,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="12" x="2" y="6" rx="2" stroke-width="1.5"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M10 14h4" stroke-width="2" stroke-linecap="round"/></svg>`
    },
    {
      id: 102,
      name: 'Acoustic Aura ANC Headphones',
      category: 'Audio',
      price: 189.99,
      rating: 4.9,
      featured: true,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9v3a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h1V14a6 6 0 0 0-12 0v2h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3z" stroke-width="1.5"/></svg>`
    },
    {
      id: 103,
      name: 'Pulse Pro Smart Fitness Watch',
      category: 'Wearables',
      price: 149.50,
      rating: 4.6,
      featured: false,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="5" width="12" height="14" rx="3" stroke-width="1.5"/><path d="M9 5V2h6v3M9 19v3h6v-3M12 9v3h2" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    {
      id: 104,
      name: 'Swift Glide Wireless Gaming Mouse',
      category: 'Office',
      price: 69.99,
      rating: 4.5,
      featured: false,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="6" y="3" width="12" height="18" rx="6" stroke-width="1.5"/><path d="M12 3v7M6 10h12" stroke-width="1.5"/></svg>`
    },
    {
      id: 105,
      name: 'Helix GaN Multi-Port Fast Charger',
      category: 'Power',
      price: 49.00,
      rating: 4.7,
      featured: true,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="5" y="4" width="14" height="14" rx="2" stroke-width="1.5"/><path d="M11 22v-4M13 22v-4M9 10h6M12 7v6" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    {
      id: 106,
      name: 'Zenith Studio XLR Microphone',
      category: 'Audio',
      price: 219.00,
      rating: 4.8,
      featured: false,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="3" width="6" height="12" rx="3" stroke-width="1.5"/><path d="M5 10c0 4.42 3.58 8 8 8s8-3.58 8-8M12 18v4M9 22h6" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    {
      id: 107,
      name: 'Orbit Wireless Charging Pad',
      category: 'Power',
      price: 34.99,
      rating: 4.3,
      featured: false,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="1.5"/><circle cx="12" cy="12" r="5" stroke-width="1.5"/><path d="M12 9v3h2" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    {
      id: 108,
      name: 'Apex Comfort Ergonomic Wrist Rest',
      category: 'Office',
      price: 24.99,
      rating: 4.4,
      featured: false,
      svg: `<svg class="product-svg-art" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10c4 0 5 4 9 4s5-4 9-4 3.58 4 3 4H0c-.58 0-1-4 3-4z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="2" y="14" width="20" height="4" rx="1" stroke-width="1.5"/></svg>`
    }
  ];

  let selectedCategory = 'all';
  let maxPrice = 250;
  let searchQuery = '';
  let sortBy = 'featured';

  renderProducts();

  function renderProducts() {
    productGrid.innerHTML = '';

    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesSearch;
    });

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'alpha') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      
      filtered.sort((a, b) => (b.featured - a.featured) || (a.id - b.id));
    }

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="product-empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto var(--spacing-sm);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <p>No products match your filter configurations.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      let starsHtml = '';
      const fullStars = Math.floor(product.rating);
      const hasHalfStar = product.rating % 1 !== 0;
      
      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          starsHtml += '★';
        } else if (i === fullStars && hasHalfStar) {
          starsHtml += '☆'; 
        } else {
          starsHtml += '☆';
        }
      }

      card.innerHTML = `
        <div class="product-image-container">
          <span class="product-cat-badge">${product.category}</span>
          ${product.svg}
        </div>
        <div class="product-details">
          <div class="product-rating">
            <span class="star-rating" title="Rating: ${product.rating}">${starsHtml}</span>
            <span class="rating-value">${product.rating}</span>
          </div>
          <h4 class="product-name" title="${product.name}">${product.name}</h4>
          <div class="product-footer">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button class="product-buy-btn" title="Add to Cart" aria-label="Add ${product.name} to cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      `;

      card.querySelector('.product-buy-btn').addEventListener('click', () => {
        showToast(`Added "${product.name}" to shopping cart!`, 'success');
      });

      productGrid.appendChild(card);
    });
  }

  productSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  productSort.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderProducts();
  });

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedCategory = chip.getAttribute('data-category');
      renderProducts();
    });
  });

  priceSlider.addEventListener('input', (e) => {
    maxPrice = parseInt(e.target.value);
    priceSliderValue.textContent = `$${maxPrice}`;
    renderProducts();
  });

  const contactForm = document.getElementById('contact-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all fields first.', 'error');
      return;
    }

    showToast(`Thanks, ${name}! Your email request was simulated successfully.`, 'success');
    contactForm.reset();
  });

});
