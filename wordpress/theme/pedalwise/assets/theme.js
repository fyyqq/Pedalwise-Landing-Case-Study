/* Pedalwise theme script: (1) light/dark switch, (2) marks the current page in the menus.
   No libraries. The first visit follows the visitor's system setting; the choice is remembered in localStorage. */
(function () {
	var root = document.documentElement;
	var isDark = function () { return root.getAttribute('data-theme') === 'dark'; };

	// 1) the switch is created here (not in the page content), so it never needs a plugin or a custom HTML block
	var slot = document.querySelector('.pw-header__actions');
	if (slot) {
		var sw = document.createElement('button');
		sw.type = 'button';
		sw.className = 'pw-theme-switch';
		sw.setAttribute('aria-label', 'Dark mode');
		sw.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
		sw.innerHTML = '<span class="pw-theme-switch__sun" aria-hidden="true"></span><span class="pw-theme-switch__knob" aria-hidden="true"></span>';
		sw.addEventListener('click', function () {
			var next = isDark() ? 'light' : 'dark';
			root.setAttribute('data-theme', next);
			sw.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
			try { localStorage.setItem('pw-theme', next); } catch (e) { /* private mode: the choice just is not remembered */ }
		});
		slot.insertBefore(sw, slot.firstChild);
	}

	// 2) current page: bold + underline through aria-current (the menu items are plain links)
	var here = location.pathname.replace(/\/+$/, '') || '/';
	var links = document.querySelectorAll('.pw-nav a.wp-block-navigation-item__content');
	for (var i = 0; i < links.length; i++) {
		var p;
		try { p = new URL(links[i].href).pathname.replace(/\/+$/, '') || '/'; } catch (e) { continue; }
		var onBlog = p === '/blog' && (document.body.classList.contains('single-post') || document.body.classList.contains('category'));
		if (p === here || onBlog) links[i].setAttribute('aria-current', 'page');
	}
})();
