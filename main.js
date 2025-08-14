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
  }, { threshold: 0.15 });

  animEls.forEach(el => {
    io.observe(el);
  });

  // waitlist form handler (POST to local waitlist.php)
  const waitForm = document.getElementById('waitlist-form');
  const waitMsg = document.getElementById('waitlist-msg');
  waitForm && waitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    waitMsg.textContent = '⏳ Sending...';
    const formData = new FormData(waitForm);

   fetch('https://ecnsportal.com.ng/waitlist.php', {  
    method: 'POST',
    body: formData
})

      .then(r => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then(json => {
        waitMsg.textContent = json.message || '✅ Thanks — you are on the list!';
        waitMsg.style.color = (json.status === "success") ? "green" : "red";
        if (json.status === "success") {
          waitForm.reset();
        }
      })
      .catch(err => {
        console.warn(err);
        waitMsg.textContent = '⚠️ Unable to reach server. Saving locally for retry.';
        waitMsg.style.color = 'orange';

        // local fallback: store in localStorage
        const offline = JSON.parse(localStorage.getItem('offlineWait') || '[]');
        offline.push(Object.fromEntries(formData.entries()));
        localStorage.setItem('offlineWait', JSON.stringify(offline));
      });
  });
});
