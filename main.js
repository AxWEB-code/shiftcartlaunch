// small helper for on-scroll animations (IntersectionObserver)
document.addEventListener('DOMContentLoaded', () => {
  // mobile menu toggle
  const btn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  btn && btn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // set current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // scroll anims
  const animEls = document.querySelectorAll('[data-anim]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    })
  }, {threshold:0.15});

  animEls.forEach(el => {
    io.observe(el);
  });

  // simple waitlist form handler (POST to /api/waitlist.php or to fetch endpoint)
  const waitForm = document.getElementById('waitlist-form');
  const waitMsg = document.getElementById('waitlist-msg');
  waitForm && waitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    waitMsg.textContent = 'Sending...';
    const formData = new FormData(waitForm);

    // SAMPLE: change URL to your PHP endpoint that saves waitlist data
    fetch('https://your-backend.example.com/api/waitlist.php', {
      method: 'POST',
      body: formData
    }).then(r => {
      if (!r.ok) throw new Error('Network error');
      return r.json();
    }).then(json => {
      waitMsg.textContent = json.message || 'Thanks — you are on the list!';
      waitForm.reset();
    }).catch(err => {
      console.warn(err);
      waitMsg.textContent = 'Unable to reach server. We saved locally and will try again later.';
      // local fallback: store in localStorage
      const offline = JSON.parse(localStorage.getItem('offlineWait') || '[]');
      offline.push(Object.fromEntries(formData.entries()));
      localStorage.setItem('offlineWait', JSON.stringify(offline));
    });
  });
});
