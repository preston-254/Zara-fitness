/**
 * Zara – Reminders & Meal Prep Companion
 * All data stored in localStorage. Zara chatbot with memory and meal-plan awareness.
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    todos: 'zara_todos',
    mealPlan: 'zara_meal_plan',
    chat: 'zara_chat_history',
    userName: 'zara_user_name',
    userCountry: 'zara_user_country',
    fitnessGoal: 'zara_fitness_goal',
    exerciseApiKey: 'zara_exercise_api_key',
    diary: 'zara_food_diary',
    weekOffset: 'zara_week_offset',
    calendarMonthOffset: 'zara_calendar_month_offset',
    signup: 'zara_signup',
  };

  const FITNESS_GOALS = [
    { value: 'reduce_weight', label: 'Reducing weight' },
    { value: 'bulking', label: 'Bulking' },
    { value: 'glutes', label: 'Adding glutes' }
  ];

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  /* Exercise library: name, image, duration required. Optional for detail page: targetMuscle, equipment, difficulty, instructions[], secondaryMuscles[], videoUrl (external). */
  var EXERCISE_LIBRARY = {
    bench_press: { name: 'Bench Press', image: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=400&h=300&fit=crop', duration: 45, targetMuscle: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate', instructions: ['Lie on bench with feet flat. Grip bar slightly wider than shoulder-width.', 'Unrack and hold bar over chest with arms extended.', 'Lower bar to mid-chest with control, then press up to start.'], secondaryMuscles: ['Triceps', 'Shoulders'], videoUrl: '' },
    barbell_squat: { name: 'Barbell Squat', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', duration: 45, targetMuscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Intermediate', instructions: ['Set bar on upper back. Stand with feet shoulder-width apart.', 'Brace core and push hips back, bending knees.', 'Descend until thighs at least parallel, then drive up to stand.'], secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'], videoUrl: '' },
    deadlift: { name: 'Deadlift', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149e?w=400&h=300&fit=crop', duration: 45, targetMuscle: 'Lower back', equipment: 'Barbell', difficulty: 'Intermediate', instructions: ['Stand with bar over mid-foot. Hinge at hips and grip bar.', 'Keep back flat, drive through heels and extend hips and knees.', 'Stand tall, then lower with control.'], secondaryMuscles: ['Hamstrings', 'Glutes', 'Traps'], videoUrl: '' },
    hip_thrust: { name: 'Hip Thrust', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', duration: 45, targetMuscle: 'Glutes', equipment: 'Barbell', difficulty: 'Beginner', instructions: ['Sit with upper back on bench, bar over hips.', 'Drive through heels and squeeze glutes to extend hips.', 'Lower with control and repeat.'], secondaryMuscles: ['Hamstrings', 'Core'], videoUrl: '' },
    shoulder_press: { name: 'Shoulder Press', image: 'https://images.unsplash.com/photo-1583454110551-21fd2e774299?w=400&h=300&fit=crop', duration: 45, targetMuscle: 'Shoulders', equipment: 'Barbell', difficulty: 'Intermediate', instructions: ['Hold bar at shoulder height, palms forward.', 'Press bar overhead until arms are extended.', 'Lower with control to shoulders.'], secondaryMuscles: ['Triceps', 'Upper chest'], videoUrl: '' },
    lunges: { name: 'Lunges', image: 'https://images.unsplash.com/photo-1517836351153-17feac71832c?w=400&h=300&fit=crop', duration: 40, targetMuscle: 'Quadriceps', equipment: 'Bodyweight', difficulty: 'Beginner', instructions: ['Stand tall. Step one leg forward and lower back knee toward floor.', 'Keep front knee over ankle. Push through front heel to return.', 'Alternate legs or complete one side at a time.'], secondaryMuscles: ['Glutes', 'Hamstrings'], videoUrl: '' },
    glute_bridge: { name: 'Glute Bridge', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop', duration: 40, targetMuscle: 'Glutes', equipment: 'Bodyweight', difficulty: 'Beginner', instructions: ['Lie on back, knees bent, feet flat. Arms by sides.', 'Drive through heels and lift hips until body forms a line.', 'Squeeze glutes at top, then lower with control.'], secondaryMuscles: ['Hamstrings', 'Core'], videoUrl: '' },
    treadmill: { name: 'Treadmill / Run', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=300&fit=crop', duration: 300, targetMuscle: 'Full body', equipment: 'Treadmill', difficulty: 'Beginner', instructions: ['Set speed and incline. Start walking or jogging.', 'Maintain good posture and arm swing.', 'Cool down by reducing speed gradually.'], secondaryMuscles: [], videoUrl: '' },
    row: { name: 'Barbell Row', image: 'https://images.unsplash.com/photo-1593079852290-6ad1af9b2d8a?w=400&h=300&fit=crop', duration: 45, targetMuscle: 'Back', equipment: 'Barbell', difficulty: 'Intermediate', instructions: ['Hinge at hips, bar hanging at arms’ length.', 'Pull bar to lower chest, squeezing shoulder blades.', 'Lower with control and repeat.'], secondaryMuscles: ['Biceps', 'Rear delts'], videoUrl: '' },
    leg_press: { name: 'Leg Press', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=300&fit=crop', duration: 45, targetMuscle: 'Quadriceps', equipment: 'Machine', difficulty: 'Beginner', instructions: ['Sit with back flat, feet on platform shoulder-width apart.', 'Release safety and lower weight by bending knees.', 'Press through heels to extend legs; do not lock knees.'], secondaryMuscles: ['Glutes', 'Hamstrings'], videoUrl: '' },
    cable_kickback: { name: 'Cable Kickback', image: 'https://images.unsplash.com/photo-1583454110551-21fd2e774299?w=400&h=300&fit=crop', duration: 40, targetMuscle: 'Glutes', equipment: 'Cable', difficulty: 'Beginner', instructions: ['Attach ankle strap to low cable. Stand facing machine.', 'Kick one leg back, squeezing the glute at the top.', 'Return with control and repeat.'], secondaryMuscles: ['Hamstrings'], videoUrl: '' },
    burpees: { name: 'Burpees', image: 'https://images.unsplash.com/photo-1517836351153-17feac71832c?w=400&h=300&fit=crop', duration: 60, targetMuscle: 'Full body', equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: ['From standing, drop into a squat and place hands on floor.', 'Jump feet back to plank, then do a push-up (optional).', 'Jump feet to hands and jump up; repeat.'], secondaryMuscles: ['Core', 'Chest', 'Legs'], videoUrl: '' }
  };

  var WEEKLY_WORKOUT_PLANS = {
    reduce_weight: [
      ['treadmill', 'burpees', 'lunges'],
      ['treadmill', 'burpees'],
      ['lunges', 'treadmill'],
      ['burpees', 'lunges'],
      ['treadmill', 'burpees', 'lunges'],
      ['treadmill'],
      []
    ],
    bulking: [
      ['bench_press', 'barbell_squat', 'deadlift'],
      ['shoulder_press', 'row', 'lunges'],
      ['barbell_squat', 'bench_press', 'hip_thrust'],
      ['deadlift', 'row', 'shoulder_press'],
      ['bench_press', 'barbell_squat', 'leg_press'],
      ['row', 'shoulder_press', 'lunges'],
      []
    ],
    glutes: [
      ['hip_thrust', 'glute_bridge', 'cable_kickback'],
      ['barbell_squat', 'lunges', 'glute_bridge'],
      ['hip_thrust', 'cable_kickback', 'deadlift'],
      ['glute_bridge', 'lunges', 'hip_thrust'],
      ['barbell_squat', 'hip_thrust', 'cable_kickback'],
      ['lunges', 'glute_bridge'],
      []
    ]
  };

  function getWorkoutForDay(goal, dayIndex) {
    var plan = WEEKLY_WORKOUT_PLANS[goal];
    if (!plan) plan = WEEKLY_WORKOUT_PLANS.reduce_weight;
    var ids = plan[dayIndex] || [];
    return ids.map(function (id) {
      var ex = EXERCISE_LIBRARY[id];
      return ex ? { id: id, name: ex.name, image: ex.image, duration: ex.duration, videoUrl: ex.videoUrl || '' } : null;
    }).filter(Boolean);
  }

  /* Registered shops – only Eastnat. productUrl opens in new tab (e.g. Instagram). */
  var REGISTERED_SHOPS = [
    { id: 'eastnat', name: 'Eastnat', description: 'Organic materials and natural products.', image: 'https://tse2.mm.bing.net/th/id/OIP.c7GhEgzB0C0oPeS44JiuKAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', productUrl: 'https://www.instagram.com/eastnat/' }
  ];

  var RECIPES = {
    'oatmeal with berries': { title: 'Oatmeal with berries', ingredients: ['Rolled oats', 'Milk or water', 'Mixed berries (fresh or frozen)', 'Honey or maple syrup', 'Pinch of salt'], steps: ['Bring liquid to a boil, add oats and salt. Simmer 5 min.', 'Stir in berries. Top with extra berries and drizzle of honey.'] },
    'ugali & sukuma wiki': { title: 'Ugali & sukuma wiki', ingredients: ['Maize flour', 'Kale or collard greens', 'Onion', 'Tomato', 'Oil', 'Salt'], steps: ['Sauté onion and tomato; add chopped greens and a little water. Cook until tender.', 'In another pot, boil water, add maize flour and stir until thick. Shape and serve with sukuma wiki.'] },
    'jollof rice & chicken': { title: 'Jollof rice & chicken', ingredients: ['Rice', 'Chicken', 'Tomato paste', 'Onions', 'Bell peppers', 'Scotch bonnet', 'Oil', 'Spices'], steps: ['Fry tomato paste in oil; add blended peppers and onions. Add chicken and stock.', 'Add washed rice, reduce heat, cover and cook until rice is done.'] },
    'mandazi & chai': { title: 'Mandazi & chai', ingredients: ['Flour', 'Sugar', 'Milk', 'Yeast or baking powder', 'Tea leaves', 'Milk', 'Ginger'], steps: ['Knead dough from flour, sugar, milk, yeast. Rest, then cut and fry until golden.', 'Boil water with tea leaves and ginger; add milk and sugar. Serve with mandazi.'] },
    'chapati & ndengu': { title: 'Chapati & ndengu', ingredients: ['Flour', 'Water', 'Oil', 'Lentils (ndengu)', 'Onion', 'Tomato', 'Coconut milk'], steps: ['Cook lentils with onion, tomato, coconut until soft. Season.', 'Make chapati dough, roll and cook on a hot pan with a little oil.'] },
    'idli & sambar': { title: 'Idli & sambar', ingredients: ['Idli batter (rice & urad dal)', 'Toor dal', 'Vegetables', 'Sambar powder', 'Tamarind'], steps: ['Steam idli batter in idli moulds until cooked.', 'Cook dal and vegetables with sambar powder and tamarind; serve as soup with idli.'] },
    'dal & rice': { title: 'Dal & rice', ingredients: ['Red or yellow lentils', 'Onion', 'Tomato', 'Turmeric', 'Cumin', 'Rice'], steps: ['Cook lentils with turmeric; temper with cumin and onion-tomato.', 'Cook rice separately. Serve dal over or beside rice.'] },
    'baked salmon & greens': { title: 'Baked salmon & greens', ingredients: ['Salmon fillet', 'Lemon', 'Olive oil', 'Leafy greens', 'Garlic'], steps: ['Season salmon with oil, lemon, salt. Bake at 400°F (200°C) for 12–15 min.', 'Sauté greens with garlic; serve with salmon.'] },
    'grilled chicken wrap': { title: 'Grilled chicken wrap', ingredients: ['Chicken breast', 'Tortilla', 'Lettuce', 'Tomato', 'Sauce'], steps: ['Grill or pan-fry chicken; slice.', 'Fill tortilla with greens, tomato, chicken and sauce. Roll and serve.'] },
    'smoothie bowl': { title: 'Smoothie bowl', ingredients: ['Frozen fruit (e.g. banana, berries)', 'Milk or yogurt', 'Toppings: granola, seeds, fruit'], steps: ['Blend frozen fruit with a little liquid until thick.', 'Pour into a bowl and top with granola, seeds and fresh fruit.'] },
    'avocado toast': { title: 'Avocado toast', ingredients: ['Bread', 'Ripe avocado', 'Lemon', 'Salt', 'Pepper'], steps: ['Toast bread. Mash avocado with lemon, salt and pepper.', 'Spread on toast. Add optional toppings (egg, seeds).'] },
    'scrambled eggs & veggies': { title: 'Scrambled eggs & veggies', ingredients: ['Eggs', 'Bell pepper', 'Onion', 'Butter or oil'], steps: ['Sauté chopped veggies briefly.', 'Add beaten eggs, stir gently over low heat until set.'] },
    'greek yogurt & granola': { title: 'Greek yogurt & granola', ingredients: ['Greek yogurt', 'Granola', 'Honey', 'Fruit (optional)'], steps: ['Spoon yogurt into a bowl.', 'Top with granola, drizzle honey and add fruit if desired.'] },
    'waakye': { title: 'Waakye', ingredients: ['Rice', 'Black-eyed peas', 'Sorghum leaves (or baking soda for colour)', 'Tomato stew', 'Spaghetti (optional)'], steps: ['Cook rice and beans together with leaves or soda for colour.', 'Serve with tomato stew, spaghetti, and sides like salad and protein.'] },
    'injera & wot': { title: 'Injera & wot', ingredients: ['Teff flour', 'Lentils or meat', 'Berbere', 'Onion', 'Oil'], steps: ['Ferment teff batter; pour in a spiral on a large pan, cover and steam.', 'Cook wot (stew) with berbere and onion; serve on injera.'] },
    'full english': { title: 'Full English breakfast', ingredients: ['Eggs', 'Bacon', 'Sausages', 'Beans', 'Tomatoes', 'Toast', 'Butter'], steps: ['Fry eggs, bacon, sausages and tomato halves.', 'Heat beans. Serve with buttered toast.'] },
    'huevos rancheros': { title: 'Huevos rancheros', ingredients: ['Eggs', 'Tortillas', 'Tomato salsa', 'Beans', 'Avocado'], steps: ['Warm tortillas. Fry eggs.', 'Place eggs on tortillas; top with salsa, beans and avocado.'] },
  };

  function normalizeMealName(name) {
    return (name || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function getRecipeForMeal(mealName) {
    var key = normalizeMealName(mealName);
    if (RECIPES[key]) return RECIPES[key];
    for (var r in RECIPES) {
      if (key.indexOf(r) !== -1 || r.indexOf(key) !== -1) return RECIPES[r];
    }
    return { title: mealName, ingredients: ['Ingredients depend on your version. Check a local recipe or adjust to taste.'], steps: ['Prepare ' + mealName + ' using your preferred method and local ingredients.', 'Season and serve.'] };
  }

  function showRecipeModal(mealName) {
    var recipe = getRecipeForMeal(mealName);
    var titleEl = document.getElementById('recipeModalTitle');
    var bodyEl = document.getElementById('recipeModalBody');
    if (!titleEl || !bodyEl) return;
    titleEl.textContent = recipe.title;
    bodyEl.innerHTML = '<p class="recipe-ingredients-label">Ingredients</p><ul class="recipe-ingredients">' +
      recipe.ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') +
      '</ul><p class="recipe-steps-label">Steps</p><ol class="recipe-steps">' +
      recipe.steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>';
    document.getElementById('recipeModal').hidden = false;
  }

  /* ----- Navigation ----- */
  function openChatSidebar() {
    var sidebar = document.getElementById('chatSidebar');
    if (sidebar) sidebar.classList.add('is-open');
    var input = document.getElementById('chatInput');
    if (input) setTimeout(function () { input.focus(); }, 300);
  }

  function closeChatSidebar() {
    var sidebar = document.getElementById('chatSidebar');
    if (sidebar) sidebar.classList.remove('is-open');
  }

  function openSideMenu() {
    var sideMenu = document.getElementById('sideMenu');
    var toggle = document.getElementById('menuToggle');
    if (sideMenu) sideMenu.classList.add('is-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Close menu'); }
  }

  function closeSideMenu() {
    var sideMenu = document.getElementById('sideMenu');
    var toggle = document.getElementById('menuToggle');
    if (sideMenu) sideMenu.classList.remove('is-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); }
  }

  function goToSection(section) {
    document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
    var panel = document.getElementById(section);
    if (panel) panel.classList.add('active');
    if (section === 'shop') showShopMain();
    if (section === 'todos' && typeof renderWorkout === 'function') renderWorkout();
    document.querySelectorAll('.bottom-nav-item').forEach(function (item) {
      if (item.getAttribute('data-section') === section) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  function initNav() {
    document.querySelectorAll('.nav-btn, .link-more[data-section], .side-menu-link, .side-menu-logo, .bottom-nav-item').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var action = el.getAttribute('data-action');
        if (action === 'open-chat') {
          openChatSidebar();
          closeSideMenu();
          return;
        }
        if (action === 'open-signin') {
          var signInModal = document.getElementById('signInModal');
          if (signInModal) signInModal.hidden = false;
          closeSideMenu();
          return;
        }
        var section = el.getAttribute('data-section');
        if (section === 'chat') {
          openChatSidebar();
          closeSideMenu();
          return;
        }
        if (section) {
          goToSection(section);
          if (section === 'profile') fillProfilePage();
          closeSideMenu();
        }
      });
    });
    var chatFab = document.getElementById('chatFab');
    if (chatFab) chatFab.addEventListener('click', function () { openChatSidebar(); });
    var sidebarClose = document.getElementById('chatSidebarClose');
    var backdrop = document.getElementById('chatSidebarBackdrop');
    if (sidebarClose) sidebarClose.addEventListener('click', closeChatSidebar);
    if (backdrop) backdrop.addEventListener('click', closeChatSidebar);
    var sideMenu = document.getElementById('sideMenu');
    var sideMenuClose = document.getElementById('sideMenuClose');
    var sideMenuBackdrop = document.getElementById('sideMenuBackdrop');
    if (sideMenuClose) sideMenuClose.addEventListener('click', closeSideMenu);
    if (sideMenuBackdrop) sideMenuBackdrop.addEventListener('click', closeSideMenu);
    var profileBtn = document.getElementById('profileBtn');
    if (profileBtn) profileBtn.addEventListener('click', function () { goToSection('profile'); closeSideMenu(); });
    var profilePageForm = document.getElementById('profilePageForm');
    if (profilePageForm) {
      profilePageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('profilePageName').value || '').trim();
        var countryEl = document.getElementById('profilePageCountry');
        var country = countryEl ? countryEl.value : '';
        var goalEl = document.getElementById('profilePageFitnessGoal');
        var goal = goalEl ? goalEl.value : '';
        var apiKeyEl = document.getElementById('profilePageExerciseApiKey');
        var apiKey = apiKeyEl ? apiKeyEl.value : '';
        setUserName(name);
        setUserCountry(country);
        setFitnessGoal(goal);
        setExerciseApiKey(apiKey);
        updateProfileLabel(name);
        updateWelcomeText(name);
      });
    }
    initAuth();
  }

  function initAuth() {
    var signInBtn = document.getElementById('signInBtn');
    var signUpBtn = document.getElementById('signUpBtn');
    var signInModal = document.getElementById('signInModal');
    var signUpModal = document.getElementById('signUpModal');
    var signInCloseBtn = document.getElementById('signInCloseBtn');
    var signUpCloseBtn = document.getElementById('signUpCloseBtn');
    var signInSubmitBtn = document.getElementById('signInSubmitBtn');
    var signUpSubmitBtn = document.getElementById('signUpSubmitBtn');
    function closeSignIn() { signInModal.hidden = true; }
    function closeSignUp() { signUpModal.hidden = true; }
    if (signInBtn) signInBtn.addEventListener('click', function () { closeSideMenu(); signInModal.hidden = false; });
    if (signUpBtn) signUpBtn.addEventListener('click', function () { closeSideMenu(); signUpModal.hidden = false; });
    if (signInCloseBtn) signInCloseBtn.addEventListener('click', closeSignIn);
    if (signUpCloseBtn) signUpCloseBtn.addEventListener('click', closeSignUp);
    signInModal.addEventListener('click', function (e) { if (e.target === signInModal) closeSignIn(); });
    signUpModal.addEventListener('click', function (e) { if (e.target === signUpModal) closeSignUp(); });
    function doSignUp() {
      var name = (document.getElementById('signUpName').value || '').trim();
      var email = (document.getElementById('signUpEmail').value || '').trim();
      var password = (document.getElementById('signUpPassword').value || '').trim();
      if (!name || !email || !password) return;
      try {
        localStorage.setItem(STORAGE_KEYS.signup, JSON.stringify({ name: name, email: email, password: password }));
        setUserName(name);
        updateProfileLabel(name);
        updateWelcomeText(name);
        closeSignUp();
        closeSideMenu();
        document.getElementById('signUpName').value = '';
        document.getElementById('signUpEmail').value = '';
        document.getElementById('signUpPassword').value = '';
      } catch (_) {}
    }
    function doSignIn() {
      var email = (document.getElementById('signInEmail').value || '').trim();
      var password = (document.getElementById('signInPassword').value || '').trim();
      try {
        var raw = localStorage.getItem(STORAGE_KEYS.signup);
        var data = raw ? JSON.parse(raw) : null;
        if (data && data.email === email && data.password === password) {
          setUserName(data.name || '');
          updateProfileLabel(data.name || '');
          updateWelcomeText(data.name || '');
          closeSignIn();
          closeSideMenu();
          document.getElementById('signInEmail').value = '';
          document.getElementById('signInPassword').value = '';
        }
      } catch (_) {}
    }
    var signUpForm = document.getElementById('signUpForm');
    var signInForm = document.getElementById('signInForm');
    if (signUpForm) signUpForm.addEventListener('submit', function (e) { e.preventDefault(); doSignUp(); });
    if (signInForm) signInForm.addEventListener('submit', function (e) { e.preventDefault(); doSignIn(); });
    if (signUpSubmitBtn) signUpSubmitBtn.addEventListener('click', doSignUp);
    if (signInSubmitBtn) signInSubmitBtn.addEventListener('click', doSignIn);
  }

  function openChatWithRecipeRequest(mealName) {
    openChatSidebar();
    var input = document.getElementById('chatInput');
    if (input) {
      input.value = 'Recipe for ' + (mealName || '').trim();
      sendChat();
    }
  }

  /* ----- To-Dos ----- */
  function getTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.todos);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
    renderTodoList();
    renderDashboardTodos();
  }

  function addTodo(text, dueISO) {
    const todos = getTodos();
    const newTodo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text: text.trim(),
      due: dueISO || null,
      done: false,
      createdAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    saveTodos(todos);
    if (newTodo.due) scheduleReminder(newTodo);
  }

  function toggleTodo(id) {
    const todos = getTodos().map(function (t) {
      return t.id === id ? { ...t, done: !t.done } : t;
    });
    saveTodos(todos);
  }

  function removeTodo(id) {
    saveTodos(getTodos().filter(function (t) { return t.id !== id; }));
  }

  function getTodoFilter() {
    const active = document.querySelector('.filter-btn.active');
    return (active && active.getAttribute('data-filter')) || 'all';
  }

  function renderTodoList() {
    const list = document.getElementById('todoList');
    if (!list) return;
    const filter = getTodoFilter();
    const todos = getTodos();
    const today = new Date().toDateString();

    let filtered = todos;
    if (filter === 'today') {
      filtered = todos.filter(function (t) {
        return t.due && new Date(t.due).toDateString() === today;
      });
    } else if (filter === 'upcoming') {
      filtered = todos.filter(function (t) {
        return !t.done && t.due && new Date(t.due) > new Date();
      });
    } else if (filter === 'done') {
      filtered = todos.filter(function (t) { return t.done; });
    }

    list.innerHTML = filtered.length
      ? filtered.map(function (t) {
          const dueStr = t.due ? formatDue(t.due) : '';
          return (
            '<li class="todo-item' + (t.done ? ' done' : '') + '" data-id="' + t.id + '">' +
            '<input type="checkbox" ' + (t.done ? 'checked' : '') + ' aria-label="Mark done">' +
            '<span class="todo-text">' + escapeHtml(t.text) + '</span>' +
            (dueStr ? '<span class="todo-due">' + escapeHtml(dueStr) + '</span>' : '') +
            '<button type="button" class="btn-remove" aria-label="Remove">×</button>' +
            '</li>'
          );
        }).join('')
      : '<li class="empty-state">No to-dos here. Add one above!</li>';

    list.querySelectorAll('.todo-item').forEach(function (item) {
      const id = item.getAttribute('data-id');
      item.querySelector('input[type="checkbox"]').addEventListener('change', function () {
        toggleTodo(id);
      });
      item.querySelector('.btn-remove').addEventListener('click', function () {
        removeTodo(id);
      });
    });
  }

  function formatDue(iso) {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return 'Today ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function renderDashboardTodos() {
    const countEl = document.getElementById('dashboardTodoCount');
    const today = new Date().toDateString();
    const todos = getTodos().filter(function (t) {
      return !t.done && (!t.due || new Date(t.due).toDateString() <= today);
    });
    if (countEl) countEl.textContent = todos.length;
  }

  function generateShoppingListFromMealPlan() {
    var plan = getMealPlan();
    var start = getWeekStart(getWeekOffset());
    var seen = {};
    var items = [];
    var i, d, dateStr, slot, mealName, recipe, ing, key;
    for (i = 0; i < 7; i++) {
      d = new Date(start);
      d.setDate(start.getDate() + i);
      dateStr = d.toISOString().slice(0, 10);
      for (slot = 0; slot < MEAL_SLOTS.length; slot++) {
        mealName = (plan[mealPlanKey(dateStr, MEAL_SLOTS[slot])] || '').trim();
        if (!mealName) continue;
        recipe = getRecipeForMeal(mealName);
        if (recipe && recipe.ingredients) {
          for (ing = 0; ing < recipe.ingredients.length; ing++) {
            key = recipe.ingredients[ing].toLowerCase().replace(/\s+/g, ' ').trim();
            if (key && !seen[key]) {
              seen[key] = true;
              items.push(recipe.ingredients[ing]);
            }
          }
        }
      }
    }
    var healthyExtras = ['Fresh fruits (e.g. bananas, apples, berries)', 'Fresh vegetables (e.g. leafy greens, carrots, tomatoes)', 'Olive oil or cooking oil', 'Salt & pepper', 'Honey or maple syrup'];
    healthyExtras.forEach(function (item) {
      key = item.toLowerCase();
      if (!seen[key]) {
        seen[key] = true;
        items.push(item);
      }
    });
    if (items.length === 0) {
      items = ['Fresh fruits', 'Fresh vegetables', 'Whole grains', 'Lean protein', 'Dairy or alternatives', 'Healthy snacks'];
    }
    var nextSat = new Date();
    nextSat.setDate(nextSat.getDate() + (6 - nextSat.getDay()));
    nextSat.setHours(12, 0, 0, 0);
    var dueISO = nextSat.toISOString().slice(0, 16);
    items.forEach(function (text) {
      addTodo('Shopping: ' + text, dueISO);
    });
    renderTodoList();
    renderDashboardTodos();
  }

  function initTodos() {
    var addBtn = document.getElementById('addTodoBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        const input = document.getElementById('todoInput');
        const due = document.getElementById('todoDue');
        const text = input && input.value ? input.value.trim() : '';
        if (!text) return;
        addTodo(text, due && due.value ? due.value : null);
        if (input) input.value = '';
        if (due) due.value = '';
      });
    }
    var shoppingBtn = document.getElementById('generateShoppingListBtn');
    if (shoppingBtn) shoppingBtn.addEventListener('click', generateShoppingListFromMealPlan);
    var todoInput = document.getElementById('todoInput');
    if (todoInput) todoInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && addBtn) addBtn.click();
    });
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderTodoList();
      });
    });
    var listEl = document.getElementById('todoList');
    if (listEl) renderTodoList();
    renderDashboardTodos();
  }

  var workoutTimerInterval = null;
  var selectedWorkoutDate = null;
  var exerciseGifCache = {};

  function getWorkoutCalendarMonthOffset() {
    var n = localStorage.getItem('zara_workout_calendar_month_offset');
    return n === null ? 0 : parseInt(n, 10);
  }

  function setWorkoutCalendarMonthOffset(delta) {
    var next = getWorkoutCalendarMonthOffset() + delta;
    localStorage.setItem('zara_workout_calendar_month_offset', String(next));
    renderWorkoutCalendarMonthLabel();
    renderWorkoutCalendar();
  }

  function getWorkoutDisplayMonthDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + getWorkoutCalendarMonthOffset();
    var year = y + Math.floor(m / 12);
    var month = ((m % 12) + 12) % 12;
    return new Date(year, month, 1);
  }

  function getYouTubeSearchUrl(exerciseName) {
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(exerciseName + ' workout form');
  }

  function fetchExerciseGif(exerciseName, callback) {
    var key = getExerciseApiKey();
    if (!key || !exerciseName) { if (callback) callback(null); return; }
    var cached = exerciseGifCache[exerciseName.toLowerCase()];
    if (cached !== undefined) { if (callback) callback(cached); return; }
    var nameSlug = exerciseName.replace(/\s+/g, '%20');
    fetch('https://exercisedb.p.rapidapi.com/exercises/name/' + nameSlug, {
      headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com' }
    }).then(function (res) { return res.ok ? res.json() : []; }).then(function (arr) {
      var id = Array.isArray(arr) && arr[0] && arr[0].id ? arr[0].id : null;
      var imgUrl = null;
      if (id) imgUrl = 'https://exercisedb.p.rapidapi.com/image?exerciseId=' + id + '&resolution=360&rapidapi-key=' + encodeURIComponent(key);
      exerciseGifCache[exerciseName.toLowerCase()] = imgUrl;
      if (callback) callback(imgUrl);
    }).catch(function () {
      exerciseGifCache[exerciseName.toLowerCase()] = null;
      if (callback) callback(null);
    });
  }

  function renderWorkoutCalendarMonthLabel() {
    var d = getWorkoutDisplayMonthDate();
    var el = document.getElementById('workoutMonthLabel');
    if (el) el.textContent = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  function renderWorkoutCalendar() {
    var grid = document.getElementById('workoutCalendarGrid');
    if (!grid) return;
    var first = getWorkoutDisplayMonthDate();
    var year = first.getFullYear();
    var month = first.getMonth();
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var startWeekday = firstDay.getDay();
    var daysInMonth = lastDay.getDate();
    var todayStr = new Date().toISOString().slice(0, 10);
    var goal = getFitnessGoal();
    grid.innerHTML = '';
    for (var i = 0; i < startWeekday; i++) {
      var empty = document.createElement('div');
      empty.className = 'workout-calendar-cell workout-calendar-cell-empty';
      empty.setAttribute('aria-hidden', 'true');
      grid.appendChild(empty);
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var dateStr = date.toISOString().slice(0, 10);
      var isToday = dateStr === todayStr;
      var dayIndex = date.getDay();
      var exercises = goal ? getWorkoutForDay(goal, dayIndex) : [];
      var hasWorkout = exercises.length > 0;
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'workout-calendar-cell workout-calendar-cell-day' + (isToday ? ' workout-calendar-cell-today' : '') + (hasWorkout ? ' has-workout' : '');
      cell.setAttribute('data-date', dateStr);
      cell.innerHTML = '<span class="workout-calendar-day-num">' + d + '</span>' + (hasWorkout ? '<span class="workout-calendar-badge">' + exercises.length + '</span>' : '');
      cell.addEventListener('click', function () {
        var dt = this.getAttribute('data-date');
        selectedWorkoutDate = dt;
        renderWorkoutDayDetail(dt);
        var panel = document.getElementById('workoutDayDetailPanel');
        if (panel) panel.classList.remove('hidden');
      });
      grid.appendChild(cell);
    }
  }

  function renderWorkoutDayDetail(dateStr) {
    var titleEl = document.getElementById('workoutDayDetailTitle');
    var containerEl = document.getElementById('workoutDayDetailExercises');
    if (!titleEl || !containerEl) return;
    var d = new Date(dateStr + 'T12:00:00');
    var dayIndex = d.getDay();
    var label = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    titleEl.textContent = 'Workout for ' + label;
    var goal = getFitnessGoal();
    var list = goal ? getWorkoutForDay(goal, dayIndex) : [];
    if (list.length === 0) {
      containerEl.innerHTML = '<p class="workout-empty">Rest day. No exercises planned for this day.</p>';
      return;
    }
    containerEl.innerHTML = list.map(function (ex, idx) {
      var ytUrl = getYouTubeSearchUrl(ex.name);
      var mediaHtml;
      var videoUrl = (ex.videoUrl || '').trim();
      if (videoUrl) {
        mediaHtml = '<video class="workout-card-media workout-card-video" poster="' + escapeHtml(ex.image || '') + '" muted loop playsinline preload="metadata" aria-label="' + escapeHtml(ex.name) + '"><source src="' + escapeHtml(videoUrl) + '" type="video/mp4"></video>';
      } else {
        mediaHtml = '<img class="workout-card-media" src="' + (ex.image || '') + '" alt="" data-ex-name="' + escapeHtml(ex.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%233d4048%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%239ca3af%22 font-size=%2216%22 x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EExercise%3C/text%3E%3C/svg%3E\';" />';
      }
      return '<article class="workout-card workout-day-detail-card" data-idx="' + idx + '" data-ex-id="' + escapeHtml(ex.id || '') + '">' +
        '<div class="workout-card-image">' + mediaHtml + '</div>' +
        '<p class="workout-card-name">' + escapeHtml(ex.name) + '</p>' +
        '<p class="workout-card-meta">' + ex.duration + ' sec</p>' +
        '<button type="button" class="btn btn-ghost workout-view-detail" data-ex-id="' + escapeHtml(ex.id || '') + '">View</button>' +
        '<a href="' + ytUrl + '" target="_blank" rel="noopener" class="btn btn-secondary workout-watch-video">Watch video</a>' +
        '<div class="workout-card-timer hidden" aria-live="polite"></div>' +
        '<button type="button" class="btn btn-primary workout-start-btn" data-idx="' + idx + '">Start timer</button>' +
        '</article>';
    }).join('');
    containerEl.querySelectorAll('.workout-view-detail').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-ex-id');
        if (id) goToExerciseDetail(id);
      });
    });
    list.forEach(function (ex, idx) {
      fetchExerciseGif(ex.name, function (gifUrl) {
        if (!gifUrl) return;
        var img = containerEl.querySelector('.workout-card[data-idx="' + idx + '"] .workout-card-image img');
        if (img) img.src = gifUrl;
      });
    });
    containerEl.querySelectorAll('.workout-start-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        var card = containerEl.querySelector('.workout-card[data-idx="' + idx + '"]');
        if (!card || !list[idx]) return;
        var duration = list[idx].duration;
        var timerEl = card.querySelector('.workout-card-timer');
        var btnLabel = btn;
        if (workoutTimerInterval) clearInterval(workoutTimerInterval);
        if (timerEl) timerEl.classList.remove('hidden');
        var secsLeft = duration;
        function tick() {
          if (secsLeft <= 0) {
            clearInterval(workoutTimerInterval);
            workoutTimerInterval = null;
            if (timerEl) { timerEl.textContent = 'Done!'; timerEl.classList.add('workout-timer-done'); }
            btnLabel.textContent = 'Start timer';
            return;
          }
          if (timerEl) timerEl.textContent = secsLeft + ' s';
          secsLeft--;
        }
        tick();
        workoutTimerInterval = setInterval(tick, 1000);
        btnLabel.textContent = 'Running…';
      });
    });
  }

  function renderWorkout() {
    var goal = getFitnessGoal();
    var hintEl = document.getElementById('workoutGoalHint');
    var contentEl = document.getElementById('workoutContent');
    var grid = document.getElementById('workoutCalendarGrid');
    if (!grid) return;
    if (!goal) {
      if (hintEl) hintEl.classList.remove('hidden');
      if (contentEl) contentEl.classList.add('hidden');
      return;
    }
    if (hintEl) hintEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');
    renderWorkoutCalendarMonthLabel();
    renderWorkoutCalendar();
  }

  function initWorkout() {
    renderWorkout();
    var monthPrev = document.getElementById('workoutMonthPrev');
    var monthNext = document.getElementById('workoutMonthNext');
    if (monthPrev) monthPrev.addEventListener('click', function () { setWorkoutCalendarMonthOffset(-1); });
    if (monthNext) monthNext.addEventListener('click', function () { setWorkoutCalendarMonthOffset(1); });
    var closeBtn = document.getElementById('workoutDayDetailClose');
    if (closeBtn) closeBtn.addEventListener('click', function () {
      var panel = document.getElementById('workoutDayDetailPanel');
      if (panel) panel.classList.add('hidden');
      selectedWorkoutDate = null;
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden' && workoutTimerInterval) {
        clearInterval(workoutTimerInterval);
        workoutTimerInterval = null;
      }
    });
  }

  /* ----- Exercise detail page (premium single-exercise view) ----- */
  function getExerciseById(id) {
    return (id && EXERCISE_LIBRARY[id]) ? EXERCISE_LIBRARY[id] : null;
  }

  function goToExerciseDetail(exerciseId) {
    if (!exerciseId || !getExerciseById(exerciseId)) return;
    renderExerciseDetail(exerciseId);
    goToSection('exerciseDetail');
    document.body.classList.add('exercise-detail-open');
  }

  function renderExerciseDetail(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var nameEl = document.getElementById('exDetailName');
    var targetText = document.getElementById('exDetailTargetText');
    var equipmentText = document.getElementById('exDetailEquipmentText');
    var difficultyText = document.getElementById('exDetailDifficultyText');
    var durationEl = document.getElementById('exDetailDuration');
    var stepsEl = document.getElementById('exDetailSteps');
    var stepsEmpty = document.getElementById('exDetailStepsEmpty');
    var muscleBadges = document.getElementById('exDetailMuscleBadges');
    var videoSrc = document.getElementById('exDetailVideoSource');
    var videoEl = document.getElementById('exDetailVideo');
    var skeleton = document.getElementById('exDetailVideoSkeleton');
    var videoContainer = document.getElementById('exDetailVideoContainer');
    var placeholder = '—';
    if (nameEl) nameEl.textContent = ex.name || placeholder;
    if (targetText) targetText.textContent = ex.targetMuscle || placeholder;
    if (equipmentText) equipmentText.textContent = ex.equipment || placeholder;
    if (difficultyText) difficultyText.textContent = ex.difficulty || placeholder;
    if (durationEl) durationEl.textContent = (ex.duration ? ex.duration + ' sec' : '') + (ex.duration ? ' per set' : '');
    var instructions = Array.isArray(ex.instructions) ? ex.instructions : [];
    if (stepsEl) {
      stepsEl.innerHTML = instructions.map(function (step) { return '<li>' + escapeHtml(step) + '</li>'; }).join('');
      stepsEl.classList.toggle('hidden', instructions.length === 0);
    }
    if (stepsEmpty) stepsEmpty.classList.toggle('hidden', instructions.length > 0);
    var muscles = [].concat(ex.targetMuscle ? [ex.targetMuscle] : [], Array.isArray(ex.secondaryMuscles) ? ex.secondaryMuscles : []);
    muscles = muscles.filter(Boolean);
    if (muscleBadges) {
      muscleBadges.innerHTML = muscles.map(function (m) { return '<span class="ex-detail-muscle-pill">' + escapeHtml(m) + '</span>'; }).join('');
    }
    var videoUrl = (ex.videoUrl || '').trim();
    var videoContainer = document.getElementById('exDetailVideoContainer');
    var placeholderBox = document.getElementById('exDetailVideoPlaceholder');
    var placeholderImg = document.getElementById('exDetailVideoPlaceholderImg');
    if (videoSrc) videoSrc.src = videoUrl;
    if (videoContainer) videoContainer.classList.toggle('hidden', !videoUrl);
    if (placeholderBox) placeholderBox.classList.toggle('hidden', !!videoUrl);
    if (placeholderImg && ex.image) placeholderImg.src = ex.image;
    if (skeleton) {
      skeleton.classList.remove('hidden');
      if (videoUrl) {
        videoEl && videoEl.addEventListener('loadeddata', function onLoad() {
          skeleton.classList.add('hidden');
        }, { once: true });
        setTimeout(function () { skeleton.classList.add('hidden'); }, 4000);
      } else {
        setTimeout(function () { skeleton.classList.add('hidden'); }, 600); }
    }
    if (videoUrl && videoEl) videoEl.load();
  }

  function initExerciseDetail() {
    var backBtn = document.getElementById('exerciseDetailBack');
    if (backBtn) backBtn.addEventListener('click', function () { document.body.classList.remove('exercise-detail-open'); goToSection('todos'); });
    var playBtn = document.getElementById('exDetailPlayPause');
    var muteBtn = document.getElementById('exDetailMute');
    var videoEl = document.getElementById('exDetailVideo');
    if (playBtn && videoEl) {
      playBtn.addEventListener('click', function () {
        if (videoEl.paused) { videoEl.play(); playBtn.setAttribute('aria-label', 'Pause'); playBtn.classList.add('is-playing'); }
        else { videoEl.pause(); playBtn.setAttribute('aria-label', 'Play'); playBtn.classList.remove('is-playing'); }
      });
      videoEl.addEventListener('play', function () { playBtn.classList.add('is-playing'); });
      videoEl.addEventListener('pause', function () { playBtn.classList.remove('is-playing'); });
    }
    if (muteBtn && videoEl) {
      muteBtn.addEventListener('click', function () {
        videoEl.muted = !videoEl.muted;
        muteBtn.classList.toggle('is-muted', videoEl.muted);
        muteBtn.setAttribute('aria-label', videoEl.muted ? 'Unmute' : 'Mute');
      });
    }
    var startBtn = document.getElementById('exDetailStartBtn');
    var addBtn = document.getElementById('exDetailAddToWorkout');
    var favBtn = document.getElementById('exDetailFavorite');
    if (startBtn) startBtn.addEventListener('click', function () { /* Start exercise / timer – could open timer or same as workout Start timer */ });
    if (addBtn) addBtn.addEventListener('click', function () { goToSection('todos'); });
    if (favBtn) favBtn.addEventListener('click', function () { favBtn.classList.toggle('is-saved'); favBtn.setAttribute('aria-label', favBtn.classList.contains('is-saved') ? 'Unsave' : 'Save or favorite'); });
  }

  /* ----- Notifications (reminders) ----- */
  function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  function scheduleReminder(todo) {
    if (!todo.due || todo.done || !('Notification' in window) || Notification.permission !== 'granted') return;
    const at = new Date(todo.due).getTime() - Date.now();
    if (at <= 0) return;
    setTimeout(function () {
      try {
        new Notification('Zara reminds you', {
          body: todo.text,
          icon: '/favicon.ico',
        });
      } catch (_) {}
    }, Math.min(at, 2147483647));
  }

  function scheduleAllReminders() {
    getTodos().filter(function (t) { return !t.done && t.due; }).forEach(scheduleReminder);
  }

  /* ----- Meal plan (calendar) ----- */
  var selectedCalendarDate = null;

  function getWeekOffset() {
    const n = localStorage.getItem(STORAGE_KEYS.weekOffset);
    return n === null ? 0 : parseInt(n, 10);
  }

  function getWeekStart(offset) {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (offset * 7);
    const start = new Date(d);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  function getCalendarMonthOffset() {
    const n = localStorage.getItem(STORAGE_KEYS.calendarMonthOffset);
    return n === null ? 0 : parseInt(n, 10);
  }

  function setCalendarMonthOffset(delta) {
    const next = getCalendarMonthOffset() + delta;
    localStorage.setItem(STORAGE_KEYS.calendarMonthOffset, String(next));
    renderCalendarMonthLabel();
    renderCalendar();
  }

  function getDisplayMonthDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + getCalendarMonthOffset();
    const year = y + Math.floor(m / 12);
    const month = ((m % 12) + 12) % 12;
    return new Date(year, month, 1);
  }

  function getMealPlan() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.mealPlan);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function saveMealPlan(plan) {
    localStorage.setItem(STORAGE_KEYS.mealPlan, JSON.stringify(plan));
    renderCalendar();
    renderDashboardMeals();
    if (selectedCalendarDate) renderDayDetail(selectedCalendarDate);
  }

  function mealPlanKey(dateStr, slot) {
    return dateStr + '|' + slot;
  }

  function countMealsForDate(plan, dateStr) {
    return MEAL_SLOTS.filter(function (slot) {
      return (plan[mealPlanKey(dateStr, slot)] || '').trim().length > 0;
    }).length;
  }

  var DEFAULT_SUGGESTIONS = {
    Breakfast: ['Oatmeal with berries', 'Eggs & whole-grain toast', 'Greek yogurt & granola', 'Smoothie bowl', 'Avocado toast', 'Scrambled eggs & veggies', 'Overnight oats'],
    Lunch: ['Quinoa salad', 'Grilled chicken wrap', 'Lentil soup', 'Buddha bowl', 'Turkey & hummus sandwich', 'Veggie stir-fry', 'Mediterranean plate'],
    Dinner: ['Baked salmon & greens', 'Chicken & roasted veg', 'Bean chili', 'Grilled fish & salad', 'Turkey meatballs', 'Veggie curry', 'Lean steak & broccoli'],
    Snacks: ['Apple & almonds', 'Carrots & hummus', 'Greek yogurt', 'Handful of nuts', 'Fruit', 'Rice cakes', 'Veggie sticks'],
  };

  var COUNTRY_SUGGESTIONS = {
    KE: {
      Breakfast: ['Mandazi & chai', 'Uji (porridge) & banana', 'Eggs & chapati', 'Oatmeal with mango', 'Sweet potato & tea', 'Bread & avocado', 'Fruit & yogurt'],
      Lunch: ['Ugali & sukuma wiki', 'Rice & beans', 'Chapati & ndengu', 'Pilau & kachumbari', 'Githeri', 'Mukimo & stew', 'Rice & vegetables'],
      Dinner: ['Ugali & fish', 'Chapati & beef stew', 'Rice & chicken', 'Mukimo & greens', 'Ndengu & chapati', 'Vegetable curry & rice', 'Grilled tilapia & salad'],
      Snacks: ['Fruit', 'Mandazi', 'Groundnuts', 'Banana', 'Biscuits & chai', 'Yogurt', 'Boiled egg'],
    },
    NG: {
      Breakfast: ['Pap & akara', 'Yam & egg sauce', 'Oatmeal & banana', 'Bread & tea', 'Moi moi', 'Plantain & eggs', 'Custard & biscuits'],
      Lunch: ['Jollof rice & chicken', 'Efo riro & eba', 'Beans & plantain', 'Fried rice', 'Egusi soup & pounded yam', 'Ofada rice & ayamase', 'Okra soup & eba'],
      Dinner: ['Jollof & coleslaw', 'Pepper soup & agidi', 'Beans & pap', 'Vegetable soup & swallow', 'Fried fish & yam', 'Edikang ikong & fufu', 'Suya & salad'],
      Snacks: ['Fruit', 'Groundnuts', 'Chin chin', 'Puff-puff', 'Boli (roast plantain)', 'Suya', 'Akara'],
    },
    IN: {
      Breakfast: ['Idli & sambar', 'Poha', 'Upma', 'Paratha & curd', 'Dosa & chutney', 'Oats upma', 'Pongal'],
      Lunch: ['Dal & rice', 'Roti & sabzi', 'Biryani', 'Rajma chawal', 'Curry & rice', 'Khichdi', 'Thali'],
      Dinner: ['Dal & roti', 'Chicken curry & rice', 'Palak paneer & naan', 'Vegetable pulao', 'Chole & bhature', 'Fish curry & rice', 'Kadhi chawal'],
      Snacks: ['Fruit', 'Chai & biscuits', 'Pakora', 'Cut fruit', 'Nuts', 'Yogurt', 'Poha'],
    },
    ZA: {
      Breakfast: ['Oats & fruit', 'Eggs & toast', 'Yogurt & muesli', 'Smoothie', 'Pap & banana', 'Avocado on bread', 'Boiled egg & tomato'],
      Lunch: ['Chakalaka & pap', 'Salad & protein', 'Sandwich', 'Bean curry & rice', 'Vetkoek & mince', 'Wrap', 'Soup & bread'],
      Dinner: ['Braai & salad', 'Bobotie & rice', 'Chicken curry', 'Fish & vegetables', 'Potjie', 'Bunny chow', 'Grilled meat & pap'],
      Snacks: ['Fruit', 'Biltong', 'Nuts', 'Rusks', 'Yogurt', 'Biscuits', 'Dried fruit'],
    },
    GH: {
      Breakfast: ['Hausa koko & koose', 'Oatmeal & banana', 'Bread & egg', 'Tom brown', 'Waakye (breakfast style)', 'Fruit & yogurt', 'Tea & biscuits'],
      Lunch: ['Jollof & chicken', 'Waakye', 'Banku & okra soup', 'Fufu & light soup', 'Red red (beans & plantain)', 'Rice & kontomire', 'Kenkey & fish'],
      Dinner: ['Jollof & salad', 'Banku & tilapia', 'Fufu & palm nut soup', 'Tuwo & soup', 'Rice & stew', 'Yam & kontomire', 'Grilled fish & vegetables'],
      Snacks: ['Fruit', 'Kelewele', 'Groundnuts', 'Bofrot', 'Chin chin', 'Roasted plantain', 'Bread & groundnut'],
    },
    ET: {
      Breakfast: ['Injera & shiro', 'Ful & bread', 'Oatmeal & banana', 'Eggs & injera', 'Genfo', 'Chechebsa', 'Fruit'],
      Lunch: ['Injera & wot', 'Tibs & injera', 'Kitfo & greens', 'Shiro & injera', 'Lentils & injera', 'Vegetable wot', 'Rice & stew'],
      Dinner: ['Doro wot & injera', 'Tibs & salad', 'Shiro & injera', 'Lentil wot', 'Fish & vegetables', 'Vegetable combo', 'Injera & keysir'],
      Snacks: ['Fruit', 'Kolo', 'Biscuits', 'Nuts', 'Bread', 'Popcorn', 'Dabo kolo'],
    },
    GB: {
      Breakfast: ['Porridge & fruit', 'Full English (eggs, beans, toast)', 'Cereal & milk', 'Scrambled eggs & avocado', 'Overnight oats', 'Toast & jam', 'Yogurt & granola'],
      Lunch: ['Sandwich & salad', 'Soup & bread', 'Jacket potato & filling', 'Ploughman\'s', 'Pasta salad', 'Wrap', 'Leftover dinner'],
      Dinner: ['Roast & vegetables', 'Fish & chips', 'Shepherd\'s pie', 'Curry & rice', 'Bangers & mash', 'Stir-fry', 'Pasta & salad'],
      Snacks: ['Fruit', 'Biscuits', 'Crisps', 'Yogurt', 'Cheese & crackers', 'Tea & cake', 'Nuts'],
    },
    MX: {
      Breakfast: ['Huevos rancheros', 'Chilaquiles', 'Oatmeal & fruit', 'Pan dulce & café', 'Eggs & beans', 'Smoothie', 'Yogurt & granola'],
      Lunch: ['Tacos & salsa', 'Pozole', 'Enchiladas', 'Ceviche', 'Torta', 'Rice & beans', 'Quesadilla & salad'],
      Dinner: ['Tacos al pastor', 'Mole & rice', 'Grilled fish & vegetables', 'Chicken tinga', 'Bean soup', 'Carnitas & tortillas', 'Vegetable stir-fry'],
      Snacks: ['Fruit', 'Jícama & lime', 'Cacahuates', 'Elote', 'Chips & guacamole', 'Paletas', 'Yogurt'],
    },
  };

  function getSuggestionsForCountry(countryCode) {
    if (!countryCode || countryCode === 'OTHER') return DEFAULT_SUGGESTIONS;
    return COUNTRY_SUGGESTIONS[countryCode] || DEFAULT_SUGGESTIONS;
  }

  function generateZaraMealPlan() {
    const plan = getMealPlan();
    const start = getWeekStart(getWeekOffset());
    const suggestions = getSuggestionsForCountry(getUserCountry());

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      MEAL_SLOTS.forEach(function (slot) {
        const options = suggestions[slot];
        const pick = options[i % options.length];
        plan[mealPlanKey(dateStr, slot)] = pick;
      });
    }
    saveMealPlan(plan);
    return plan;
  }

  function renderCalendarMonthLabel() {
    const d = getDisplayMonthDate();
    const el = document.getElementById('calendarMonthLabel');
    if (el) el.textContent = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    const plan = getMealPlan();
    const first = getDisplayMonthDate();
    const year = first.getFullYear();
    const month = first.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const todayStr = new Date().toISOString().slice(0, 10);

    grid.innerHTML = '';
    var cells = [];
    var leadingEmpty = startWeekday;
    for (var i = 0; i < leadingEmpty; i++) {
      var empty = document.createElement('div');
      empty.className = 'calendar-cell calendar-cell-empty';
      empty.setAttribute('aria-hidden', 'true');
      grid.appendChild(empty);
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var dateStr = date.toISOString().slice(0, 10);
      var isToday = dateStr === todayStr;
      var mealCount = countMealsForDate(plan, dateStr);
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'calendar-cell calendar-cell-day' + (isToday ? ' calendar-cell-today' : '') + (mealCount > 0 ? ' has-meals' : '');
      cell.setAttribute('data-date', dateStr);
      cell.innerHTML = '<span class="calendar-day-num">' + d + '</span>' + (mealCount > 0 ? '<span class="calendar-meal-badge">' + mealCount + '</span>' : '');
      cell.addEventListener('click', function () {
        var dt = this.getAttribute('data-date');
        selectedCalendarDate = dt;
        renderDayDetail(dt);
        document.getElementById('dayDetailPanel').classList.remove('hidden');
      });
      grid.appendChild(cell);
    }
  }

  function renderDayDetail(dateStr) {
    var titleEl = document.getElementById('dayDetailTitle');
    var slotsEl = document.getElementById('dayDetailSlots');
    if (!titleEl || !slotsEl) return;
    var d = new Date(dateStr + 'T12:00:00');
    var dayName = DAYS[d.getDay()];
    var label = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    titleEl.textContent = label;
    var plan = getMealPlan();
    slotsEl.innerHTML = MEAL_SLOTS.map(function (slot) {
      var key = mealPlanKey(dateStr, slot);
      var value = (plan[key] || '').trim();
      var recipeBtn = value ? ' <button type="button" class="btn-recipe" data-meal="' + escapeHtml(value) + '" title="Get recipe">Recipe</button>' : '';
      return '<label class="day-detail-slot"><span class="day-detail-slot-name">' + escapeHtml(slot) + '</span><div class="day-detail-slot-row"><input type="text" class="meal-slot-input" data-key="' + escapeHtml(key) + '" placeholder="' + escapeHtml(slot) + '" value="' + escapeHtml(value) + '">' + recipeBtn + '</div></label>';
    }).join('');
    slotsEl.querySelectorAll('.btn-recipe').forEach(function (btn) {
      btn.addEventListener('click', function () { openChatWithRecipeRequest(this.getAttribute('data-meal')); });
    });
    slotsEl.querySelectorAll('.meal-slot-input').forEach(function (input) {
      input.addEventListener('change', function () {
        var plan = getMealPlan();
        plan[input.getAttribute('data-key')] = input.value.trim();
        saveMealPlan(plan);
      });
    });
  }

  function renderDashboardMeals() {
    const countEl = document.getElementById('dashboardMealCount');
    const today = new Date().toISOString().slice(0, 10);
    const plan = getMealPlan();
    const count = MEAL_SLOTS.filter(function (slot) {
      return (plan[mealPlanKey(today, slot)] || '').trim().length > 0;
    }).length;
    if (countEl) countEl.textContent = count;
  }

  function initMealPlan() {
    document.getElementById('zaraPlanBtn').addEventListener('click', function () {
      generateZaraMealPlan();
      const result = document.createElement('div');
      result.className = 'zara-plan-result';
      result.innerHTML = '<h3>Zara planned your week</h3><p>I’ve filled in healthy ideas for breakfast, lunch, dinner, and snacks. Click any day on the calendar to edit.</p>';
      var wrap = document.getElementById('calendarWrap');
      if (wrap && wrap.parentNode) wrap.parentNode.insertBefore(result, wrap);
      setTimeout(function () { if (result.parentNode) result.remove(); }, 6000);
    });
    document.getElementById('clearMealPlanBtn').addEventListener('click', function () {
      if (confirm('Clear the whole meal plan? You can still ask Zara to plan again.')) {
        saveMealPlan({});
      }
    });
    var monthPrev = document.getElementById('monthPrev');
    var monthNext = document.getElementById('monthNext');
    if (monthPrev) monthPrev.addEventListener('click', function () { setCalendarMonthOffset(-1); });
    if (monthNext) monthNext.addEventListener('click', function () { setCalendarMonthOffset(1); });
    var dayDetailClose = document.getElementById('dayDetailClose');
    if (dayDetailClose) dayDetailClose.addEventListener('click', function () {
      document.getElementById('dayDetailPanel').classList.add('hidden');
      selectedCalendarDate = null;
    });
    renderCalendarMonthLabel();
    renderCalendar();
    renderDashboardMeals();
  }

  /* ----- Food diary (AI scan via TensorFlow.js MobileNet) ----- */
  var foodModelCache = null;

  function loadFoodModel() {
    if (foodModelCache) return Promise.resolve(foodModelCache);
    if (typeof mobilenet === 'undefined') return Promise.resolve(null);
    return mobilenet.load({ version: 2, alpha: 1.0 }).then(function (model) {
      foodModelCache = model;
      return model;
    });
  }

  function classifyFoodImage(img) {
    return loadFoodModel().then(function (model) {
      if (!model) return null;
      return model.classify(img, 10);
    });
  }

  function imageFromDataUrl(dataUrl) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  function buildFoodFeedback(predictions, mealLabel, plannedStr) {
    if (!predictions || predictions.length === 0) {
      return 'Zara says: I could not scan this image. Make sure the food is well lit and in focus, then try again. I still logged your ' + mealLabel + '.';
    }
    var top = predictions.slice(0, 5);
    var labels = top.map(function (p) { return p.className.replace(/_/g, ' '); });
    var primary = top[0];
    var confidence = Math.round(primary.probability * 100);
    var sentence;
    if (confidence >= 50) {
      sentence = 'I see this looks like **' + labels[0] + '** (' + confidence + '% confidence).';
      if (labels.length > 1) {
        sentence += ' I also picked up: **' + labels.slice(1, 4).join('**, **') + '**.';
      }
    } else {
      sentence = 'I scanned your plate and detected: **' + labels.join('**, **') + '**.';
    }
    var planTip = '';
    if (plannedStr) {
      var planWords = plannedStr.split(/\s+/);
      var match = planWords.some(function (word) {
        return labels.some(function (l) {
          var w = word.toLowerCase();
          var lab = l.toLowerCase();
          return lab.indexOf(w) !== -1 || w.indexOf(lab) !== -1;
        });
      });
      planTip = match ? ' This aligns well with your meal plan.' : ' Compare with your meal plan and adjust if needed.';
    } else {
      planTip = ' Add a meal plan so I can compare future meals.';
    }
    var vegFruit = /broccoli|cauliflower|cabbage|lettuce|spinach|carrot|peas|bean|tomato|pepper|zucchini|cucumber|apple|banana|orange|strawberry|grape|fruit|vegetable|potato|corn/i;
    var hasProduce = labels.some(function (l) { return vegFruit.test(l); });
    var healthTip = hasProduce ? ' Good to see produce on your plate.' : ' Consider adding veggies or fruit for balance.';
    return 'Zara says: ' + sentence + planTip + healthTip + ' Stay hydrated.';
  }

  function analyzeFoodImage(dataUrl, mealLabel) {
    var plan = getMealPlan();
    var today = new Date().toISOString().slice(0, 10);
    var plannedStr = MEAL_SLOTS.map(function (s) {
      var v = plan[mealPlanKey(today, s)];
      return v ? v.toLowerCase() : '';
    }).filter(Boolean).join(' ');
    return imageFromDataUrl(dataUrl).then(function (img) {
      return classifyFoodImage(img);
    }).then(function (predictions) {
      return buildFoodFeedback(predictions, mealLabel, plannedStr);
    }).catch(function (err) {
      console.warn('Food scan failed:', err);
      return 'Zara says: I could not scan this image right now (try again or check your connection). I still logged your ' + mealLabel + '. Stick to your meal plan when you can.';
    });
  }

  function getDiary() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.diary);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveDiary(entries) {
    localStorage.setItem(STORAGE_KEYS.diary, JSON.stringify(entries));
    renderDiaryEntries();
  }

  function renderDiaryEntries() {
    const container = document.getElementById('diaryEntries');
    const entries = getDiary();
    container.innerHTML = entries.length
      ? entries.slice().reverse().map(function (entry) {
          return (
            '<div class="diary-entry">' +
            (entry.dataUrl ? '<img src="' + entry.dataUrl + '" alt="Meal">' : '') +
            '<div><div class="entry-meta">' + escapeHtml(entry.mealLabel) + ' · ' + escapeHtml(entry.date) + '</div>' +
            '<div class="entry-feedback">' + escapeHtml(entry.feedback) + '</div></div></div>'
          );
        }).join('')
      : '<p class="empty-state">No diary entries yet. Upload a photo above!</p>';
  }

  function initFoodDiary() {
    const zone = document.getElementById('uploadZone');
    const input = document.getElementById('foodPhotoInput');
    const analysisEl = document.getElementById('foodAnalysis');

    function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = function () {
        const dataUrl = reader.result;
        const now = new Date();
        const mealLabels = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
        const hour = now.getHours();
        const mealLabel = hour < 11 ? mealLabels[0] : hour < 15 ? mealLabels[1] : hour < 20 ? mealLabels[2] : mealLabels[3];
        analysisEl.classList.remove('hidden');
        analysisEl.innerHTML = '<h3>Zara is scanning…</h3><p class="food-scanning">Analyzing your food with AI. One moment.</p>';
        analyzeFoodImage(dataUrl, mealLabel).then(function (feedback) {
          var entries = getDiary();
          entries.push({
          dataUrl: dataUrl.length > 100000 ? '' : dataUrl,
          mealLabel,
          date: now.toLocaleString(),
          feedback,
        });
        if (entries[entries.length - 1].dataUrl === '' && dataUrl.length > 100000) {
          entries[entries.length - 1].feedback += ' (Image too large to store; feedback still saved.)';
        }
        saveDiary(entries);
        var text = feedback.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        analysisEl.innerHTML = '<h3>Zara\'s take</h3><p>' + text + '</p>';
        renderDiaryEntries();
        });
      };
      reader.readAsDataURL(file);
    }

    zone.addEventListener('click', function () { input.click(); });
    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
      zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', function () { zone.classList.remove('dragover'); });
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.classList.remove('dragover');
      handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', function () {
      handleFile(input.files[0]);
      input.value = '';
    });
    renderDiaryEntries();
  }

  /* ----- Chat with Zara (remembers everything, reminds you) ----- */
  function getChatHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.chat);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveChatMessage(role, text) {
    const history = getChatHistory();
    history.push({ role, text, at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.chat, JSON.stringify(history.slice(-200)));
  }

  function getUserName() {
    return localStorage.getItem(STORAGE_KEYS.userName) || '';
  }

  function getUserCountry() {
    return localStorage.getItem(STORAGE_KEYS.userCountry) || '';
  }

  function getFitnessGoal() {
    return localStorage.getItem(STORAGE_KEYS.fitnessGoal) || '';
  }

  function setFitnessGoal(goal) {
    localStorage.setItem(STORAGE_KEYS.fitnessGoal, (goal || '').trim());
  }

  function getExerciseApiKey() {
    return localStorage.getItem(STORAGE_KEYS.exerciseApiKey) || '';
  }

  function setExerciseApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.exerciseApiKey, (key || '').trim());
  }

  function setUserCountry(code) {
    localStorage.setItem(STORAGE_KEYS.userCountry, (code || '').trim());
  }

  function setUserName(name) {
    var n = (name || '').trim();
    localStorage.setItem(STORAGE_KEYS.userName, n);
    if (typeof updateWelcomeText === 'function') updateWelcomeText(n);
    if (typeof updateProfileLabel === 'function') updateProfileLabel(n);
    const el = document.getElementById('welcomeName');
    if (el) el.textContent = (name ? name + ', ' : '') + 'here’s your day at a glance.';
  }

  function getZaraReply(userMessage) {
    const lower = userMessage.toLowerCase().trim();
    const todos = getTodos().filter(function (t) { return !t.done; });
    const plan = getMealPlan();
    const today = new Date().toISOString().slice(0, 10);
    const todayMeals = MEAL_SLOTS.map(function (s) {
      const v = plan[mealPlanKey(today, s)];
      return v ? s + ': ' + v : null;
    }).filter(Boolean);
    const history = getChatHistory();
    const userName = getUserName();

    if (/my name is (.+)/i.test(userMessage)) {
      const name = userMessage.replace(/my name is (.+)/i, '$1').trim();
      setUserName(name);
      return 'Nice to meet you, ' + name + '! I’ll remember that.';
    }
    if (/what('s| is) my name/i.test(userMessage) && userName) {
      return 'Your name is ' + userName + '.';
    }
    if (/remind|reminder|to-?do|todo/i.test(lower)) {
      if (todos.length === 0) {
        return 'You don’t have any to-dos right now. Add some in the To-Dos section and I’ll help you remember them!';
      }
      const list = todos.slice(0, 5).map(function (t) {
        return '• ' + t.text + (t.due ? ' (' + formatDue(t.due) + ')' : '');
      }).join('\n');
      return 'Here are things you asked to be reminded about:\n' + list + (todos.length > 5 ? '\n… and ' + (todos.length - 5) + ' more. Check the To-Dos page!' : '');
    }
    if (/meal|food|eat|plan|prep|diet|healthy/i.test(lower)) {
      if (todayMeals.length > 0) {
        return 'Today you have: ' + todayMeals.join(' · ') + '. Want me to plan your whole week? Go to Meal Plan and click “Ask Zara to plan my week”.';
      }
      return 'You don’t have today’s meals planned yet. Go to Meal Plan and I can fill in a whole week of healthy ideas for you!';
    }
    if (/plan my week|plan week|generate plan/i.test(lower)) {
      generateZaraMealPlan();
      return 'I’ve filled in a healthy meal plan for this week. Check the Meal Plan tab!';
    }
    var recipeMatch = lower.match(/(?:recipe for|how to make|how do i make)\s+(.+)/i) || lower.match(/recipe\s+(.+)/i);
    if (recipeMatch && recipeMatch[1]) {
      var recipe = getRecipeForMeal(recipeMatch[1].trim());
      var lines = [recipe.title, '', 'Ingredients: ' + recipe.ingredients.join(', '), '', 'Steps: ' + recipe.steps.map(function (s, i) { return (i + 1) + '. ' + s; }).join(' ')];
      return lines.join('\n');
    }
        if (/hello|hi|hey|good morning|good evening/i.test(lower)) {
      return (userName ? 'Hi ' + userName + '! ' : 'Hi! ') + 'I’m Zara. I remember what you tell me and I’ll remind you about your to-dos and meals. What do you need?';
    }
    if (/who are you|what are you/i.test(lower)) {
      return 'I’m Zara, your reminder and meal prep companion. I remember our chats, remind you about your to-dos, and help you stick to your meal plan. You can add food photos and I’ll help you stay on track!';
    }
    if (/thank|thanks/i.test(lower)) {
      return 'You’re welcome!';
    }
    if (/help/i.test(lower)) {
      return 'You can ask me: “What are my reminders?”, “Plan my week”, “What’s for dinner today?”, or tell me “My name is …” so I remember. I also remind you when your to-dos are due if you allow notifications.';
    }
        if (/how are you|how do you feel|how're you/i.test(lower)) {
      return (userName ? 'I\'m here for you, ' + userName + '. ' : '') + 'I\'m doing great—and I\'m here whenever you need to talk or need a reminder. How are you feeling today?';
    }
    if (/how am i|how do i feel/i.test(lower)) {
      return (userName ? userName + ', ' : '') + 'only you know how you really feel. I\'m here to listen. Tell me what\'s on your mind—I\'m here for you.';
    }
    if (/sad|down|depressed|lonely|unhappy|blue/i.test(lower)) {
      return (userName ? userName + ', ' : '') + 'I\'m sorry you\'re feeling that way. Small steps help: stick to your meal plan and to-dos when you can. I\'m here to remind you and chat whenever you need.';
    }
    if (/stressed|stress|overwhelmed|anxious|worry|worried/i.test(lower)) {
      return (userName ? userName + ', ' : '') + 'stress is tough. Break things into small tasks and add them as to-dos—I\'ll remind you. Eating well and taking one thing at a time helps. I\'m here for you.';
    }
    if (/tired|exhausted|sleepy|no energy/i.test(lower)) {
      return (userName ? userName + ', ' : '') + 'when you\'re tired, rest matters. Add a reminder to wind down or prep something simple from your meal plan. I\'ll keep reminding you—take care of yourself.';
    }
    if (/motivation|motivated|can\'t get started/i.test(lower)) {
      return (userName ? userName + ', ' : '') + 'you\'ve got this! Start with one small task or one meal from your plan. I\'ll remind you of your to-dos. Every step counts.';
    }
    if (/goal|goals|resolution|want to/i.test(lower)) {
      return (userName ? userName + ', ' : '') + 'I love that you\'re thinking about goals. Add reminders so I can nudge you. For eating better, I can plan your week in Meal Plan. What do you want to focus on first?';
    }
    if (/advice|what should i do/i.test(lower)) {
      return (userName ? userName + ', ' : '') + 'I\'m best at reminders and meal planning! Add tasks as to-dos and I\'ll remind you. For food, use the meal plan and food diary. You can also tell me what\'s on your mind—I\'ll remember.';
    }
    if (/miss you|thinking of you|good to talk/i.test(lower)) {
      return (userName ? 'That\'s so sweet, ' + userName + '! ' : '') + 'I\'m always here. Chat anytime.';
    }
    if (/love you|like you|appreciate you/i.test(lower)) {
      return (userName ? 'Thanks, ' + userName + '! ' : '') + 'I care about you too. Let\'s keep your reminders and meals on track together.';
    }
    if (/good night|goodnight|sleep|going to bed/i.test(lower)) {
      return (userName ? 'Good night, ' + userName + '! ' : 'Good night! ') + 'Sleep well. I\'ll be here with your reminders when you\'re back.';
    }
    if (/good day|have a good day|great day/i.test(lower)) {
      return (userName ? 'You too, ' + userName + '! ' : 'You too! ') + 'Have a great day. Check your to-dos and meal plan—I\'ll remind you!';
    }
    return (userName ? userName + ', ' : '') + 'I\'ll remember that. If it\'s something to do, add it in To-Dos and I\'ll remind you. For meals, ask me to plan your week or tell me how you\'re feeling—I\'m here for you.';
  }

  function getWelcomeChatMessage() {
    var userName = getUserName();
    if (userName) return 'Hi ' + userName + "! I'm Zara. I remember everything you say and I'll call you by name. Ask about reminders, meal plans, or tell me how you're feeling—I'm here for you.";
    return "Hi! I'm Zara. I remember everything you say and I'll remind you about your to-dos and meals. Set your name in Profile or say \"My name is …\" so I can call you by name. Ask about reminders, plan your week, or just say how you feel!";
  }
    function renderChatHistory() {
    const container = document.getElementById('chatMessages');
    const history = getChatHistory();
    container.innerHTML = history.length
      ? history.map(function (msg) {
          const isUser = msg.role === 'user';
          return (
            '<div class="chat-msg ' + (isUser ? 'user' : 'zara') + '">' +
            '<div class="sender">' + (isUser ? 'You' : 'Zara') + '</div>' +
            '<div class="bubble">' + escapeHtml(msg.text).replace(/\n/g, '<br>') + '</div></div>'
          );
        }).join('')
      : '<div class="chat-msg zara"><div class="sender">Zara</div><div class="bubble">' + escapeHtml(getWelcomeChatMessage()) + '</div></div>';
    container.scrollTop = container.scrollHeight;
  }

  function sendChat() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    saveChatMessage('user', text);
    renderChatHistory();
    input.value = '';

    const reply = getZaraReply(text);
    setTimeout(function () {
      saveChatMessage('zara', reply);
      renderChatHistory();
    }, 400);
  }

  function initProfile() {
    var modal = document.getElementById('profileModal');
    var nameInput = document.getElementById('profileNameInput');
    var saveBtn = document.getElementById('profileSaveBtn');
    var closeBtn = document.getElementById('profileCloseBtn');
    if (!modal) return;
    var countrySelect = document.getElementById('profileCountrySelect');
    function closeModal() { modal.hidden = true; }
    closeBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', function () {
      var n = nameInput.value.trim();
      setUserName(n);
      if (countrySelect) setUserCountry(countrySelect.value);
      updateProfileLabel(n);
      updateWelcomeText(n);
      closeModal();
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') saveBtn.click(); });
    updateProfileLabel(getUserName());
  }
  function updateProfileLabel(name) {
    var label = name ? name : 'Guest';
    var el = document.getElementById('profileLabel');
    if (el) el.textContent = name ? name : 'Profile';
    var sideEl = document.getElementById('sideMenuProfileLabel');
    if (sideEl) sideEl.textContent = label;
    updateProfileAvatarLetter(name);
  }

  function updateProfileAvatarLetter(name) {
    var el = document.getElementById('profileAvatarLetter');
    if (el) el.textContent = (name && name.trim()) ? name.trim().charAt(0) : '?';
  }

  function fillProfilePage() {
    var nameEl = document.getElementById('profilePageName');
    var countryEl = document.getElementById('profilePageCountry');
    var goalEl = document.getElementById('profilePageFitnessGoal');
    var apiKeyEl = document.getElementById('profilePageExerciseApiKey');
    if (nameEl) nameEl.value = getUserName();
    if (countryEl) countryEl.value = getUserCountry() || '';
    if (goalEl) goalEl.value = getFitnessGoal() || '';
    if (apiKeyEl) apiKeyEl.value = getExerciseApiKey() || '';
    updateProfileAvatarLetter(getUserName());
  }
  function updateWelcomeText(name) {
    var el = document.getElementById('welcomeName');
    if (el) el.textContent = (name ? name + ', ' : '') + "here's your day at a glance.";
  }

  function initChat() {
    renderChatHistory();
    document.getElementById('chatSendBtn').addEventListener('click', sendChat);
    document.getElementById('chatInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChat();
      }
    });
    if (getUserName()) {
      var _w = document.getElementById('welcomeName'); if (_w) _w.textContent = getUserName() + ', here’s your day at a glance.';
    }
  }

  /* ----- Voice: "Hey Zara" / "Hello Zara" → auto-detect, reply by voice (no button) ----- */
  var voiceZaraSpeaking = false;
  var wakeWordRecognition = null;
  var wakeWordRestartTimeout = null;
  var wakeWordJustResponded = false;
  var wakeWordStarted = false;

  function isMainAppVisible() {
    var main = document.getElementById('mainApp');
    return main && !main.classList.contains('hidden');
  }

  function speakWithZara(text) {
    if (!text || typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();
    var forSpeech = text.replace(/\s*·\s*/g, ', ').replace(/\n+/g, '. ');
    var u = new SpeechSynthesisUtterance(forSpeech);
    u.rate = 0.95;
    u.pitch = 1;
    u.volume = 1;
    var voices = speechSynthesis.getVoices();
    var preferred = voices.filter(function (v) { return v.lang.startsWith('en'); });
    if (preferred.length) u.voice = preferred[0];
    u.onstart = function () { voiceZaraSpeaking = true; };
    u.onend = u.onerror = function () { voiceZaraSpeaking = false; };
    speechSynthesis.speak(u);
  }

  function normalizeVoiceCommand(transcript) {
    var t = (transcript || '').toLowerCase().trim();
    t = t.replace(/^(hey\s+|hello\s+)?(zara|xara)\s*,?\s*/i, '').trim();
    if (!t) t = 'help';
    return t;
  }

  function stopWakeWordListening() {
    if (wakeWordRestartTimeout) {
      clearTimeout(wakeWordRestartTimeout);
      wakeWordRestartTimeout = null;
    }
    if (wakeWordRecognition) {
      try { wakeWordRecognition.abort(); } catch (_) {}
      wakeWordRecognition = null;
    }
  }

  function startWakeWordListening() {
    if (!isMainAppVisible()) return;
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (wakeWordRecognition) return;
    wakeWordRecognition = new SpeechRecognition();
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.interimResults = true;
    wakeWordRecognition.lang = 'en-US';

    wakeWordRecognition.onresult = function (event) {
      var transcript = '';
      for (var i = event.results.length - 1; i >= 0; i--) {
        if (event.results[i].isFinal) {
          transcript = (event.results[i][0].transcript || '').trim();
          break;
        }
      }
      if (!transcript) return;
      var lower = transcript.toLowerCase().replace(/\s+/g, ' ');
      if (!/(hey|hello)\s*,?\s*(zara|xara)/.test(lower)) return;
      wakeWordJustResponded = true;
      var command = normalizeVoiceCommand(transcript);
      var reply = getZaraReply(command);
      saveChatMessage('user', transcript);
      saveChatMessage('zara', reply);
      renderChatHistory();
      setTimeout(function () { speakWithZara(reply); }, 200);
      stopWakeWordListening();
    };

    wakeWordRecognition.onend = function () {
      wakeWordRecognition = null;
      if (!isMainAppVisible()) return;
      var delay = wakeWordJustResponded ? 2800 : (voiceZaraSpeaking ? 2500 : 600);
      if (wakeWordJustResponded) wakeWordJustResponded = false;
      wakeWordRestartTimeout = setTimeout(function () {
        wakeWordRestartTimeout = null;
        startWakeWordListening();
      }, delay);
    };

    wakeWordRecognition.onerror = function (e) {
      wakeWordRecognition = null;
      if (!isMainAppVisible()) return;
      wakeWordRestartTimeout = setTimeout(function () {
        wakeWordRestartTimeout = null;
        startWakeWordListening();
      }, 2000);
    };

    try {
      wakeWordRecognition.start();
      wakeWordStarted = true;
    } catch (err) {
      wakeWordRecognition = null;
      if (isMainAppVisible()) {
        wakeWordRestartTimeout = setTimeout(function () {
          wakeWordRestartTimeout = null;
          startWakeWordListening();
        }, 3000);
      }
    }
  }

  function tryStartWakeWordOnUserGesture() {
    if (wakeWordStarted || !isMainAppVisible()) return;
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    startWakeWordListening();
  }

  function initVoiceZara() {
    var main = document.getElementById('mainApp');
    if (main) {
      main.addEventListener('click', tryStartWakeWordOnUserGesture, { once: true, capture: true });
      main.addEventListener('touchstart', tryStartWakeWordOnUserGesture, { once: true, capture: true, passive: true });
    }
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', function () {});
    }
  }

  function startWakeWordWhenReady() {
    if (!isMainAppVisible()) return;
    if (wakeWordRecognition) return;
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    startWakeWordListening();
  }

  function escapeHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  /* ----- Init ----- */
  function initRecipeModal() {
    var modal = document.getElementById('recipeModal');
    var closeBtn = document.getElementById('recipeModalClose');
    if (closeBtn) closeBtn.addEventListener('click', function () { modal.hidden = true; });
    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) modal.hidden = true; });
  }

  function enterMainApp() {
    var gate = document.getElementById('authGate');
    var main = document.getElementById('mainApp');
    if (gate) gate.hidden = true;
    if (main) main.classList.remove('hidden');
    setTimeout(function () { startWakeWordWhenReady(); }, 400);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopWakeWordListening();
    } else if (isMainAppVisible()) {
      setTimeout(function () { startWakeWordWhenReady(); }, 500);
    }
  }

  /* ----- Shop: registered shops only (Eastnat) ----- */
  function renderShopShops() {
    var grid = document.getElementById('shopShopsGrid');
    var section = document.getElementById('shopShopsSection');
    if (!grid) return;
    if (section) section.classList.toggle('hidden', REGISTERED_SHOPS.length === 0);
    grid.innerHTML = REGISTERED_SHOPS.map(function (shop) {
      return '<article class="shop-card shop-store-card" data-shop-id="' + escapeHtml(shop.id) + '">' +
        '<div class="shop-card-image">' +
          '<img src="' + (shop.image || '') + '" alt="" loading="lazy">' +
          '<span class="shop-card-overlay" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="shop-card-body">' +
          '<h3 class="shop-store-name">' + escapeHtml(shop.name) + '</h3>' +
          '<p class="shop-store-desc">' + escapeHtml(shop.description || '') + '</p>' +
          '<button type="button" class="btn btn-primary shop-view-btn shop-store-view-btn" data-shop-id="' + escapeHtml(shop.id) + '">View products</button>' +
        '</div></article>';
    }).join('');
    grid.querySelectorAll('.shop-store-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-shop-id');
        var shop = REGISTERED_SHOPS.filter(function (s) { return s.id === id; })[0];
        if (shop && shop.productUrl) window.open(shop.productUrl, '_blank', 'noopener,noreferrer');
      });
    });
  }

  function showShopMain() {
    var main = document.getElementById('shopMain');
    if (main) main.classList.remove('hidden');
    renderShopShops();
  }

  function initShop() {
    /* Shop view is just Eastnat; View products opens productUrl (Instagram) in new tab – wired in renderShopShops() */
  }

  function initSplash() {
    var splash = document.getElementById('splashScreen');
    var gate = document.getElementById('authGate');
    if (!splash) return;
    setTimeout(function () {
      splash.classList.add('fade-out');
      setTimeout(function () {
        splash.style.display = 'none';
        if (gate) gate.hidden = false;
      }, 600);
    }, 2500);
  }

  function initAuthGate() {
    var gate = document.getElementById('authGate');
    var tabSignIn = document.querySelector('.auth-tab[data-tab="signin"]');
    var tabSignUp = document.querySelector('.auth-tab[data-tab="signup"]');
    var formSignIn = document.getElementById('authGateSignIn');
    var formSignUp = document.getElementById('authGateSignUp');
    var gateSignInSubmit = document.getElementById('gateSignInSubmit');
    var gateSignUpSubmit = document.getElementById('gateSignUpSubmit');
    var gateContinueGuest = document.getElementById('gateContinueGuest');

    function showSignIn() {
      if (tabSignIn) tabSignIn.classList.add('active');
      if (tabSignUp) tabSignUp.classList.remove('active');
      if (formSignIn) formSignIn.classList.remove('hidden');
      if (formSignUp) formSignUp.classList.add('hidden');
    }
    function showSignUp() {
      if (tabSignUp) tabSignUp.classList.add('active');
      if (tabSignIn) tabSignIn.classList.remove('active');
      if (formSignUp) formSignUp.classList.remove('hidden');
      if (formSignIn) formSignIn.classList.add('hidden');
    }

    if (tabSignIn) tabSignIn.addEventListener('click', showSignIn);
    if (tabSignUp) tabSignUp.addEventListener('click', showSignUp);

    if (gateSignInSubmit) {
      gateSignInSubmit.addEventListener('click', function () {
        var email = (document.getElementById('gateSignInEmail').value || '').trim();
        var password = (document.getElementById('gateSignInPassword').value || '').trim();
        try {
          var raw = localStorage.getItem(STORAGE_KEYS.signup);
          var data = raw ? JSON.parse(raw) : null;
          if (data && data.email === email && data.password === password) {
            setUserName(data.name || '');
            updateProfileLabel(data.name || '');
            updateWelcomeText(data.name || '');
            enterMainApp();
          }
        } catch (_) {}
      });
    }

    if (gateSignUpSubmit) {
      gateSignUpSubmit.addEventListener('click', function () {
        var name = (document.getElementById('gateSignUpName').value || '').trim();
        var email = (document.getElementById('gateSignUpEmail').value || '').trim();
        var password = (document.getElementById('gateSignUpPassword').value || '').trim();
        if (!name || !email || !password) return;
        var country = (document.getElementById('gateSignUpCountry') && document.getElementById('gateSignUpCountry').value) || '';
        var ageEl = document.getElementById('gateSignUpAge');
        var age = ageEl && ageEl.value !== '' ? parseInt(ageEl.value, 10) : null;
        var genderEl = document.getElementById('gateSignUpGender');
        var gender = (genderEl && genderEl.value) || '';
        var weightEl = document.getElementById('gateSignUpWeight');
        var weight = weightEl && weightEl.value !== '' ? parseFloat(weightEl.value) : null;
        var heightEl = document.getElementById('gateSignUpHeight');
        var height = heightEl && heightEl.value !== '' ? parseFloat(heightEl.value) : null;
        var goalEl = document.getElementById('gateSignUpFitnessGoal');
        var fitnessGoal = (goalEl && goalEl.value) || '';
        try {
          var signupData = {
            name: name,
            email: email,
            password: password,
            country: country,
            age: isNaN(age) || age == null ? undefined : age,
            gender: gender || undefined,
            weight: (weight != null && !isNaN(weight)) ? weight : undefined,
            height: (height != null && !isNaN(height)) ? height : undefined,
            fitnessGoal: fitnessGoal || undefined
          };
          localStorage.setItem(STORAGE_KEYS.signup, JSON.stringify(signupData));
          setUserName(name);
          if (country) setUserCountry(country);
          if (fitnessGoal) setFitnessGoal(fitnessGoal);
          updateProfileLabel(name);
          updateWelcomeText(name);
          enterMainApp();
        } catch (_) {}
      });
    }

    if (gateContinueGuest) gateContinueGuest.addEventListener('click', enterMainApp);
  }

  function init() {
    initSplash();
    initAuthGate();
    initNav();
    initProfile();
    initRecipeModal();
    initTodos();
    initWorkout();
    initExerciseDetail();
    initMealPlan();
    initFoodDiary();
    initChat();
    initVoiceZara();
    initShop();
    document.addEventListener('visibilitychange', onVisibilityChange);
    requestNotificationPermission();
    scheduleAllReminders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
