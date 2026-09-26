/* ============================================================
   Virelia  |  main.js
============================================================ */

;(function () {
  'use strict'

  /* ── Loading screen ── */
  window.addEventListener('load', function () {
    var screen = document.querySelector('.loading-screen')
    if (!screen) return
    setTimeout(function () {
      screen.classList.add('hidden')
      document.body.classList.remove('is-loading')
    }, 1600)
  })

  /* ── Topbar scroll tint ── */
  var topbar = document.getElementById('topbar')
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      topbar.classList.add('scrolled')
    } else {
      topbar.classList.remove('scrolled')
    }
  }, { passive: true })

  /* ── Active nav link on scroll ── */
  var sections = document.querySelectorAll('section[id], .hero[id]')
  var navLinks = document.querySelectorAll('.nav-link')

  function updateActiveNav () {
    var scrollY = window.scrollY + 120
    sections.forEach(function (sec) {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(function (l) { l.classList.remove('active') })
        var match = document.querySelector('.nav-link[href="#' + sec.id + '"]')
        if (match) match.classList.add('active')
      }
    })
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true })

  /* ── Smooth scroll for nav links ── */
  document.querySelectorAll('a[href^="#"], button.nav-main').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var href = el.getAttribute('href') || el.dataset.href
      if (!href || href === '#') return
      var target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth' })
      closeSidenav()
    })
  })

  /* ── Hamburger / sidenav ── */
  var hamburger       = document.getElementById('hamburger')
  var sidenav         = document.getElementById('sidenav')
  var sidenavOverlay  = document.getElementById('sidenavOverlay')

  function openSidenav () {
    hamburger.classList.add('open')
    sidenav.classList.add('open')
    sidenavOverlay.classList.add('open')
    document.body.classList.add('no-scroll')
  }
  function closeSidenav () {
    hamburger.classList.remove('open')
    sidenav.classList.remove('open')
    sidenavOverlay.classList.remove('open')
    document.body.classList.remove('no-scroll')
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      sidenav.classList.contains('open') ? closeSidenav() : openSidenav()
    })
  }
  if (sidenavOverlay) sidenavOverlay.addEventListener('click', closeSidenav)

  document.querySelectorAll('.sidenav-link').forEach(function (l) {
    l.addEventListener('click', closeSidenav)
  })

  /* ── Social dropdown toggle ── */
  var socialToggle = document.getElementById('socialToggle')
  if (socialToggle) {
    socialToggle.addEventListener('click', function (e) {
      e.stopPropagation()
      socialToggle.classList.toggle('open')
    })
    document.addEventListener('click', function () {
      socialToggle.classList.remove('open')
    })
  }

  /* ── Video modal ── */
  var videoModal     = document.getElementById('videoModal')
  var playBtn        = document.getElementById('playBtn')
  var videoModalClose      = document.getElementById('videoModalClose')
  var videoModalCloseBtn   = document.getElementById('videoModalCloseBtn')
  var videoEl        = videoModal ? videoModal.querySelector('video') : null

  function openVideo () {
    if (!videoModal) return
    videoModal.classList.add('open')
    document.body.classList.add('no-scroll')
    if (videoEl) videoEl.play()
  }
  function closeVideo () {
    if (!videoModal) return
    videoModal.classList.remove('open')
    document.body.classList.remove('no-scroll')
    if (videoEl) { videoEl.pause(); videoEl.currentTime = 0 }
  }

  if (playBtn) playBtn.addEventListener('click', openVideo)
  if (videoModalClose) videoModalClose.addEventListener('click', closeVideo)
  if (videoModalCloseBtn) videoModalCloseBtn.addEventListener('click', closeVideo)

  /* ── Pre-register modal ── */
  var registerModal      = document.getElementById('registerModal')
  var registerClose      = document.getElementById('registerClose')
  var registerCloseBtn   = document.getElementById('registerCloseBtn')
  var registerSubmit     = document.getElementById('registerSubmit')
  var registerSuccess    = document.getElementById('registerSuccess')
  var registerEmail      = registerModal ? registerModal.querySelector('.register-email') : null
  var tosCheck           = document.getElementById('tosCheck')

  function openRegister () {
    if (!registerModal) return
    registerModal.classList.add('open')
    document.body.classList.add('no-scroll')
  }
  function closeRegister () {
    if (!registerModal) return
    registerModal.classList.remove('open')
    document.body.classList.remove('no-scroll')
  }

  ;['openRegister', 'openRegisterHero', 'openRegisterMilestone'].forEach(function (id) {
    var btn = document.getElementById(id)
    if (btn) btn.addEventListener('click', openRegister)
  })
  if (registerClose) registerClose.addEventListener('click', closeRegister)
  if (registerCloseBtn) registerCloseBtn.addEventListener('click', closeRegister)

  /* platform tabs */
  document.querySelectorAll('.ptab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.ptab').forEach(function (t) { t.classList.remove('active') })
      tab.classList.add('active')
    })
  })

  /* submit */
  if (registerSubmit) {
    registerSubmit.addEventListener('click', function () {
      var email = registerEmail ? registerEmail.value.trim() : ''
      var agreed = tosCheck ? tosCheck.checked : false
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        registerEmail.style.borderColor = '#d44'
        return
      }
      if (!agreed) {
        tosCheck.closest('label').style.color = '#d44'
        return
      }
      registerSubmit.style.display = 'none'
      if (registerSuccess) registerSuccess.classList.add('show')
    })
    if (registerEmail) {
      registerEmail.addEventListener('input', function () {
        registerEmail.style.borderColor = ''
      })
    }
    if (tosCheck) {
      tosCheck.addEventListener('change', function () {
        tosCheck.closest('label').style.color = ''
      })
    }
  }

  /* close modals on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeVideo(); closeRegister(); closeSidenav() }
  })

  /* ── City compare drag ── */
  var cityDivider = document.getElementById('cityDivider')
  var cityLeft    = document.querySelector('.city-left')
  var cityRight   = document.querySelector('.city-right')
  var cityCompare = document.querySelector('.city-compare-inner')

  if (cityDivider && cityLeft && cityRight && cityCompare) {
    var dragging = false

    function updateCitySplit (clientX) {
      var rect  = cityCompare.getBoundingClientRect()
      var pct   = Math.min(Math.max((clientX - rect.left) / rect.width, 0.1), 0.9)
      cityLeft.style.flex  = pct
      cityRight.style.flex = 1 - pct
      cityDivider.style.left = (pct * 100) + '%'
    }

    cityDivider.addEventListener('mousedown', function (e) { dragging = true; e.preventDefault() })
    cityDivider.addEventListener('touchstart', function () { dragging = true }, { passive: true })

    window.addEventListener('mousemove', function (e) { if (dragging) updateCitySplit(e.clientX) })
    window.addEventListener('touchmove', function (e) {
      if (dragging) updateCitySplit(e.touches[0].clientX)
    }, { passive: true })

    window.addEventListener('mouseup',  function () { dragging = false })
    window.addEventListener('touchend', function () { dragging = false })
  }

  /* ── Scroll reveal ── */
  var revealEls = document.querySelectorAll(
    '.character-card, .location-card, .milestone-node, .news-item, .city-copy, .milestone-date-block'
  )
  revealEls.forEach(function (el) { el.classList.add('reveal') })

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        revealObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  revealEls.forEach(function (el) { revealObserver.observe(el) })

  /* ── Character gallery lightbox ── */
  document.querySelectorAll('.char-gallery img').forEach(function (img) {
    img.addEventListener('click', function () {
      var overlay = document.createElement('div')
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.92)',
        'z-index:2000', 'display:flex', 'align-items:center', 'justify-content:center',
        'cursor:pointer'
      ].join(';')
      var big = document.createElement('img')
      big.src = img.src
      big.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:2px'
      overlay.appendChild(big)
      overlay.addEventListener('click', function () { document.body.removeChild(overlay) })
      document.body.appendChild(overlay)
    })
  })

  /* ── News featured image swap on hover ── */
  var featuredImg = document.querySelector('.news-featured img')
  if (featuredImg) {
    document.querySelectorAll('.news-item a').forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        featuredImg.style.opacity = '0.7'
        featuredImg.style.transform = 'scale(1.03)'
      })
      link.addEventListener('mouseleave', function () {
        featuredImg.style.opacity = '1'
        featuredImg.style.transform = 'scale(1)'
      })
    })
    featuredImg.style.transition = 'opacity 0.3s, transform 0.4s'
  }

})()
