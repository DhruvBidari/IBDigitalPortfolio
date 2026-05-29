var CV_MODAL_DATA = {
  title: "Download my CV",

  // Use TWO DIFFERENT image files here (otherwise it looks like “only one image”)
  slider: [
    { src: "images/reflection1.jpg", fit: "contain", alt: "CV Preview Page 1" },
    { src: "images/post_1.jpg", fit: "contain", alt: "CV Preview Page 2" },
  ],

  // TWO LONG PARAGRAPHS (rendered UNDER the slider)
  textHtml:
    "<p>Paragraph 1: Put your long CV description here. This is controlled entirely from JavaScript so you never have to edit the HTML structure.</p>" +
    "<p>Paragraph 2: Put your second long paragraph here. You can include links, bold text, etc., and it will appear below the slider.</p>",
};

(function () {
  var path = (window.location.pathname || "").toLowerCase();

  if (path.endsWith("/portfolioindividual2.html")) {
    var from =
      window.location.pathname + window.location.search + window.location.hash;

    window.location.replace("404.html");
  }
})();

$(document).ready(function () {
  var path = (window.location.pathname || "").toLowerCase();
  var isIndex =
    path.endsWith("/index.html") ||
    path === "/index.html" ||
    path.endsWith("index.html") ||
    path.endsWith("/ibdigitalportfolio") ||
    path.endsWith("/ibdigitalportfolio/") ||
    path.endsWith("/") ||
    !path.includes(".html");

  function normalizeHash(hash) {
    if (hash === "#about-us") return "#about-section";
    if (hash === "#about") return "#about-section";
    if (hash === "#portfolio-section") return "#semester-1-portfolio-section";
    return hash;
  }

  function refreshAnimations() {
    try {
      if (typeof AOS !== "undefined") AOS.refreshHard();
    } catch (e) {}

    try {
      $(window).trigger("resize").trigger("scroll");
    } catch (e) {}
  }

  function scrollToInitialHash() {
    if (!isIndex) return;

    var hash = normalizeHash(window.location.hash);

    if (hash && $(hash).length) {
      window.__suppressHashRoutingUntil = Date.now() + 2600;

      var navH = ($(".unslate_co--site-nav").outerHeight() || 0) + 20;

      $("html, body")
        .stop(true)
        .animate(
          {
            scrollTop: $(hash).offset().top - navH,
          },
          850,
          "easeInOutExpo",
          function () {
            try {
              history.replaceState(null, "", hash);
            } catch (e) {
              window.location.hash = hash;
            }

            refreshAnimations();
            setTimeout(refreshAnimations, 150);
            setTimeout(refreshAnimations, 500);
          }
        );

      return;
    }

    $("html, body").scrollTop(0);
  }

  $(window).on("load pageshow", function () {
    setTimeout(scrollToInitialHash, 250);
    setTimeout(scrollToInitialHash, 850);
  });
});

(function () {
  const logo = document.getElementById("siteLogo");
  const navbar = document.querySelector(".unslate_co--site-nav");
  if (!logo || !navbar) return;

  const whiteSrc = logo.getAttribute("data-logo-white"); // white logo
  const darkSrc = logo.getAttribute("data-logo-dark"); // black logo

  function setLogo() {
    // When nav is "scrolled" it has the white background in this template
    const navIsWhite = navbar.classList.contains("scrolled");

    const nextSrc = navIsWhite ? darkSrc : whiteSrc;
    if (logo.getAttribute("src") !== nextSrc) {
      logo.setAttribute("src", nextSrc);
    }
  }

  window.addEventListener("scroll", setLogo, { passive: true });
  window.addEventListener("resize", setLogo);
  document.addEventListener("DOMContentLoaded", setLogo);

  setLogo();
  setTimeout(setLogo, 50);
  setTimeout(setLogo, 250);
})();

AOS.init({
  duration: 800,
  easing: "ease",
  once: true,
  offset: 45,
  mirror: false,
});

jQuery(function ($) {
  "use strict";
  loader();
  siteMenuClone();
  mobileToggleClick();
  onePageNavigation();
  initIndexHashRouting();
  hardHomeReloadLinks();
  siteIstotope();
  portfolioItemClick();
  unitDescToggle();
  owlCarouselPlugin();
  floatingLabel();
  scrollWindow();
  counter();
  jarallaxPlugin();
  contactForm();
  stickyFillPlugin();
  animateReveal();

  setTimeout(function () {
    if (typeof AOS !== "undefined") AOS.refreshHard();
    $(window).trigger("resize").trigger("scroll");
  }, 300);

  setTimeout(function () {
    if (typeof AOS !== "undefined") AOS.refreshHard();
    $(window).trigger("resize").trigger("scroll");
  }, 1000);

  // Unit template router (only runs if unit.html elements exist)
  unitPageRouter();

  // 404 initializer (only runs if 404 elements exist)
  init404Page();
  // Call the correct CV modal initializer (the animated one)
  initCvModal();
});

/* =========================
   CV MODAL
   ========================= */

/*
  IMPORTANT:
  Your file had multiple CV MODAL blocks + multiple initCvModal() definitions.
  One of them uses #cvModalSlider.single-slider which DOES NOT match your HTML
  (<div id="cvModalSlider" class="cv-slider">), so Owl/behavior breaks.

  Keep ONLY ONE CV modal implementation below.
*/

function initCvModal() {
  var $modal = $("#cvModal");
  var sliderEl = document.getElementById("cvModalSlider");

  if (!$modal.length || !sliderEl) return;

  function destroySlider() {
    try {
      var $owl = $(sliderEl);
      if ($owl.hasClass("owl-loaded")) {
        $owl.trigger("destroy.owl.carousel");
        $owl.removeClass("owl-loaded");
        $owl.find(".owl-stage-outer").children().unwrap();
      }
    } catch (e) {}
  }

  function buildSlider() {
    destroySlider();
    sliderEl.innerHTML = "";

    var slides = (CV_MODAL_DATA.slider || []).filter(Boolean);
    if (slides.length === 1) slides = [slides[0], slides[0]]; // Make it feel like a slider

    slides.forEach(function (s) {
      var fitClass =
        (s.fit || "contain").toLowerCase() === "cover"
          ? "fit-cover"
          : "fit-contain";
      var div = document.createElement("div");
      div.className = "slide " + fitClass;
      div.innerHTML =
        '<img src="' +
        (s.src || "") +
        '" class="img-fluid" alt="' +
        (s.alt || "") +
        '"/>';
      sliderEl.appendChild(div);
    });

    // Dedicated Owl config: nav visible, no dots
    if (!$(sliderEl).hasClass("owl-loaded")) {
      $(sliderEl).owlCarousel({
        center: false,
        items: 1,
        loop: true,
        stagePadding: 0,
        margin: 0,
        smartSpeed: 450,
        autoplay: false,
        autoplayHoverPause: true,
        dots: false, // No dots
        nav: true, // Arrows visible
        navText: [
          '<span class="icon-keyboard_arrow_left">',
          '<span class="icon-keyboard_arrow_right">',
        ],
      });
    }
  }

  function openModal() {
    $("#cvModalTitle").text(CV_MODAL_DATA.title || "Download my CV");
    $("#cvModalText").html(CV_MODAL_DATA.textHtml || "");

    buildSlider();

    $("body").addClass("cv-modal-open");
    $modal.addClass("is-open").attr("aria-hidden", "false");

    // GSAP open animation: fade in, move up, scale
    TweenMax.fromTo(
      ".cv-modal__dialog",
      0.45,
      { y: 40, scale: 0.96, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, ease: Expo.easeOut }
    );

    TweenMax.to(".cv-modal__backdrop", 0.2, { opacity: 1, ease: Expo.easeOut });

    // Refresh Owl after visible
    setTimeout(function () {
      $(sliderEl).trigger("refresh.owl.carousel");
    }, 80);
  }

  function closeModal() {
    // GSAP close animation: mirror open (fade out, move down, scale)
    TweenMax.to(".cv-modal__backdrop", 0.2, { opacity: 0, ease: Expo.easeIn });

    TweenMax.to(".cv-modal__dialog", 0.35, {
      y: 40,
      scale: 0.96,
      opacity: 0,
      ease: Expo.easeIn,
      onComplete: function () {
        $modal.removeClass("is-open").attr("aria-hidden", "true");
        $("body").removeClass("cv-modal-open");
        destroySlider();
      },
    });
  }

  $("body").on("click", ".js-open-cv-modal", function (e) {
    e.preventDefault();
    openModal();
  });

  $("body").on("click", "[data-cv-close]", function (e) {
    e.preventDefault();
    closeModal();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $modal.hasClass("is-open")) closeModal();
  });

  // Stop clicks inside dialog from closing (overlay click closes)
  $("body").on("click", ".cv-modal__dialog", function (e) {
    e.stopPropagation();
  });
}

/* =========================
   CV MODAL (REMOVED DUPLICATE)
   ========================= */

/*
  NOTE:
  This duplicate CV modal implementation was overriding the animated version above
  and breaking Owl initialization (it relied on .single-slider selectors).
  Removed so the correct, animated initCvModal() earlier in the file runs.
*/
function initCvModal__BROKEN_DO_NOT_USE() {
  var $modal = $("#cvModal");
  var sliderEl = document.getElementById("cvModalSlider");

  if (!$modal.length || !sliderEl) return;

  function destroyIfInit() {
    try {
      $("#cvModalSlider.single-slider.owl-loaded").trigger(
        "destroy.owl.carousel"
      );
      $("#cvModalSlider.single-slider.owl-loaded").removeClass("owl-loaded");
      $("#cvModalSlider.single-slider")
        .find(".owl-stage-outer")
        .children()
        .unwrap();
    } catch (e) {}
  }

  function buildSlider() {
    destroyIfInit();
    sliderEl.innerHTML = "";

    var slides = (CV_MODAL_DATA.slider || []).filter(Boolean);

    // make it feel like a real slider
    if (slides.length === 1) slides = [slides[0], slides[0]];

    slides.forEach(function (s) {
      var fitClass =
        (s.fit || "contain").toLowerCase() === "cover"
          ? "fit-cover"
          : "fit-contain";

      var div = document.createElement("div");
      div.className = "slide " + fitClass;
      div.innerHTML =
        '<img src="' +
        (s.src || "") +
        '" class="img-fluid" alt="' +
        (s.alt || "") +
        '"/>';
      sliderEl.appendChild(div);
    });

    // Use your site's existing slider settings so it looks like everything else
    if (typeof owlSingleSlider === "function") {
      owlSingleSlider();
    } else {
      $("#cvModalSlider.single-slider").owlCarousel({
        center: false,
        items: 1,
        loop: true,
        stagePadding: 0,
        margin: 0,
        smartSpeed: 450,
        autoplay: false,
        autoplayHoverPause: true,
        dots: true,
        nav: true,
        navText: [
          '<span class="icon-keyboard_arrow_left">',
          '<span class="icon-keyboard_arrow_right">',
        ],
      });
    }
  }

  function openModal() {
    $("#cvModalTitle").text(CV_MODAL_DATA.title || "Download my CV");
    $("#cvModalText").html(CV_MODAL_DATA.textHtml || "");

    buildSlider();

    $("body").addClass("cv-modal-open");
    $modal.addClass("is-open").attr("aria-hidden", "false");

    // refresh after it becomes visible so Owl sizes correctly
    setTimeout(function () {
      try {
        $("#cvModalSlider.single-slider").trigger("refresh.owl.carousel");
      } catch (e) {}
    }, 80);
  }

  function closeModal() {
    $modal.removeClass("is-open").attr("aria-hidden", "true");
    $("body").removeClass("cv-modal-open");
  }

  $("body").on("click", ".js-open-cv-modal", function () {
    openModal();
  });

  $("body").on("click", "[data-cv-close]", function (e) {
    e.preventDefault();
    closeModal();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $modal.hasClass("is-open")) closeModal();
  });

  // stop clicks inside dialog from closing (clicking backdrop should close)
  $("body").on("click", ".cv-modal__dialog", function (e) {
    e.stopPropagation();
  });
}

/* =========================
   UNIT PAGE TEMPLATE ROUTER
   ========================= */

// Canonical links for the 6 options (customize globally here)
var UNIT_PAGE_LINKS = {
  kafka: "unit.html#kafka",
  calvino: "unit.html#calvino",
  szymborska: "unit.html#szymborska",
  performative: "unit.html#performative",
  "lit-motion": "unit.html#lit-motion",
  "semester1-reflection": "unit.html#semester1-reflection",
};

var UNIT_PAGES = {
  duffy: {
    pageTitle: "Unit 4: Duffy",
    heroTitle: "Unit 4: Duffy",
    heroSubtitle:
      "Carol Ann Duffy’s Poetry — memory, power, voice, and the emotional weight of human experience.",
    heroBg: "images/duffy1.jpg",
    hasTop5: true,
    slider: [
      { src: "images/duffy2.jpeg", fit: "contain", alt: "Duffy slide 1" },
      { src: "images/duffy3.png", fit: "contain", alt: "Duffy slide 2" },
      { src: "images/duffy4.png", fit: "contain", alt: "Duffy slide 3" },
    ],
    details: {
      text: "Poetry",
      author: "Carol Ann Duffy",
      focus: "Voice / Memory / Identity",
      links: [{ label: "GIS", href: "javascript:void(0)" }],
    },
    descriptionHtml:
      "<p>Carol Ann Duffy’s poetry explores memory, identity, power, and the emotional effects of history and personal experience. Through poems such as “War Photographer,” “Originally,” “Before You Were Mine,” “Standing Female Nude,” and “Havisham,” Duffy gives voice to people shaped by conflict, childhood, gender expectations, love, loss, and social pressure. Her work often reveals how ordinary moments and hidden emotions can expose deeper truths about identity, trauma, and human connection.</p>" +
      "<p><a href='https://docs.google.com/document/d/1GgOArnx_ebK4rb8H-HnmnxptUov6-DuVOUWlgiWdXQc/edit?usp=sharing'>Global Issue Statement</a></p>",
    top5: [
      {
        title:
          "Duffy gives voice to people who are usually silenced or overlooked.",
        body: "Her poems often center speakers whose emotions, identities, or suffering are ignored by society, history, or the people around them.",
      },
      {
        title: "Identity is shaped by memory, childhood, and the past.",
        body: "In poems like Originally, In Miss Tilscher’s Class, and Before You Were Mine, Duffy shows how the past continues to shape who people become.",
      },
      {
        title:
          "Duffy exposes the emotional damage caused by power and conflict.",
        body: "Poems like War Photographer, Shooting Stars, and Selling Manhattan reveal how violence, oppression, and history leave lasting human consequences.",
      },
      {
        title:
          "Her poetry challenges traditional gender roles and objectification.",
        body: "Duffy presents women as complex individuals with anger, desire, memory, and agency, rather than allowing them to remain passive or idealized figures.",
      },
      {
        title:
          "Ordinary moments become powerful reflections on human experience.",
        body: "Through simple images and everyday details, Duffy explores deeper emotions such as love, grief, loneliness, responsibility, and longing.",
      },
    ],
  },

  "college-career": {
    pageTitle: "Unit 5: College & Career",
    heroTitle: "Unit 5: College & Career",
    heroSubtitle:
      "College and Career — future planning, personal ambition, and the steps toward life after high school.",
    heroBg: "images/college3.jpg",
    hasTop5: true,
    slider: [
      { src: "images/college1.jpg", fit: "contain", alt: "College slide 1" },
      { src: "images/college2.png", fit: "contain", alt: "College slide 2" },
    ],
    details: {
      text: "College & Career",
      author: "Dhruv Bidari",
      focus: "Reflection / Future Goals",
      links: [{ label: "Resume", href: "javascript:void(0)" }],
    },
    descriptionHtml:
      "<p>The College and Career Unit focused on preparing for life after high school through career research, ACT prep, resume building, and exploring college majors. By researching possible careers and the education paths connected to them, I learned how my interests can connect to realistic future opportunities. The unit helped me think more intentionally about college, work, and the steps I need to take to build a strong future.</p>" +
      "<p><a href='https://docs.google.com/document/d/10F_mKqo9gYlgy_9U1qHFNnHzDpoqvlQwsyCDVrYjLoA/edit?usp=sharing'>My Resume</a></p>",
    top5: [
      {
        title:
          "The unit connected personal interests to real future possibilities.",
        body: "Researching careers and college paths helped turn broad goals into more realistic options based on majors, requirements, and long-term opportunities.",
      },
      {
        title: "College planning became more than just choosing a school..",
        body: "The unit showed how factors like academics, cost, location, programs, and career outcomes all shape whether a college is actually a good fit.",
      },
      {
        title: "ACT preparation emphasized strategy, discipline, and growth.",
        body: "Studying for the ACT showed that success depends not only on knowledge, but also on timing, practice, confidence, and learning from mistakes.",
      },
      {
        title: "College essay brainstorming encouraged deeper self-reflection.",
        body: "Thinking through possible essay topics helped connect personal experiences, values, challenges, and goals into a clearer story of identity.",
      },
      {
        title: "The unit made the future feel more intentional and achievable.",
        body: "By combining career research, college planning, test preparation, and writing, the unit helped create a stronger sense of direction after high school.",
      },
    ],
  },

  ng: {
    pageTitle: "Unit 6: Ng",
    heroTitle: "Unit 6: Ng",
    heroSubtitle:
      "Everything I Never Told You — family pressure, silence, and the fragile search for identity.",
    heroBg: "images/ng2.png",
    hasTop5: true,
    slider: [
      { src: "images/ng1.jpg", fit: "contain", alt: "Ng slide 1" },
      { src: "images/ng3.jpg", fit: "contain", alt: "Ng slide 2" },
      { src: "images/ng4.png", fit: "contain", alt: "Ng slide 3" },
    ],
    details: {
      text: "Everything I Never Told You",
      author: "Celeste Ng",
      focus: "Identity / Family / Expectations",
      links: [
        { label: "TTT", href: "javascript:void(0)" },
        { label: "GIS", href: "javascript:void(0)" },
      ],
    },
    descriptionHtml:
      "<p>Everything I Never Told You by Celeste Ng explores identity, family pressure, and the damage caused by silence. The novel follows the Lee family after Lydia’s death, revealing how her parents’ expectations and unspoken struggles shaped her life. Ng uses the family’s hidden tensions to show how love can become harmful when people project their dreams onto someone else.</p>" +
      "<p>In class, our study of Everything I Never Told You went beyond basic plot summary through fishbowl discussions, annotations, and student-created discussion questions. These activities pushed us to analyze the novel’s deeper motifs, such as silence, family pressure, identity, race, and memory. By preparing questions and responding to classmates’ ideas, we developed a stronger understanding of how Celeste Ng uses the Lee family’s hidden tensions to reveal the emotional damage caused by unspoken expectations.</p>" +
      "<p><a href='https://docs.google.com/document/d/1SbN0X_gSJ9I5kBGFU30HbUmWRL1Ea6EevsQfsPLfUjg/edit?usp=sharing'>Table Talk Task</a></p>" +
      "<p><a href='https://docs.google.com/document/d/1efqCsVoffajDwhi2K-7iAL_L2h1uXf_b2XTVfLO0QU0/edit?usp=sharing'>Global Issue Statement</a></p>",
    top5: [
      {
        title: "Ng shows how family expectations can erase personal identity.",
        body: "Lydia is shaped by her parents’ dreams rather than her own desires, revealing how love can become damaging when it turns into pressure.",
      },
      {
        title: "Silence is one of the novel’s most destructive forces.",
        body: "The Lee family’s inability to honestly communicate causes misunderstanding, isolation, and emotional distance between characters.",
      },
      {
        title: "The novel explores how race and gender shape belonging.",
        body: "Ng shows how James, Marilyn, and their children struggle with feeling different, unseen, or trapped by society’s expectations.",
      },
      {
        title: "Memory reveals the hidden truths behind family relationships.",
        body: "Through flashbacks, the novel shows that Lydia’s death cannot be understood without examining the family’s past wounds and secrets.",
      },
      {
        title:
          "Ng presents love as complicated, imperfect, and sometimes harmful.",
        body: "The characters care deeply for one another, but their love often becomes control, projection, or silence instead of true understanding.",
      },
    ],
  },

  intertextuality: {
    pageTitle: "Intertextuality Literacy Project",
    heroTitle: "Intertextuality Literacy Project",
    heroSubtitle:
      "Calvino and Ng — external expectations, lost authenticity, and the struggle to define the self..",
    heroBg: "images/intertexuality1.png",
    hasTop5: false,
    slider: [
      {
        src: "images/calvino2.jpg",
        fit: "contain",
        alt: "Intertexuality slide 1",
      },
      { src: "images/ng1.jpg", fit: "contain", alt: "Intertexuality slide 2" },
      {
        src: "images/intertexuality2.png",
        fit: "contain",
        alt: "Intertexuality slide 3",
      },
    ],
    details: {
      text: "Project",
      author: "Dhruv Bidari",
      focus: "Intertextuality / Global Issues",
      links: [{ label: "Essay", href: "javascript:void(0)" }],
    },
    descriptionHtml:
      "<p>The IB Intertextuality Assignment explored the connection between Italo Calvino’s The Nonexistent Knight and Celeste Ng’s Everything I Never Told You. The essay compared Agilulf and Lydia to show how identity can be damaged when external expectations become stronger than the self. Through Agilulf’s empty perfection and Lydia’s silent suffering, both texts reveal how people can lose authenticity by performing the roles society or family demands of them.</p>" +
      "<p><a href='https://docs.google.com/document/d/1UPk9DOtRfSpxlS4eihA60pFoATv_RH3ZaFek72Q7cyA/edit?usp=sharing'>My Intertexuality Essay</a></p>",
  },

  "food-for-thought": {
    pageTitle: "Food for Thought",
    heroTitle: "Food for Thought",
    heroSubtitle:
      "Literary Cake Final — analysis, creativity, collaboration, and a sweet close to Year One of IB English.",
    heroBg: "images/food2.jpg",
    hasTop5: false,
    slider: [
      { src: "images/kafka2.jpg", fit: "contain", alt: "Food slide 1" },
      { src: "images/calvino2.jpg", fit: "contain", alt: "Food slide 2" },
      { src: "images/duffy1.jpg", fit: "contain", alt: "Food slide 3" },
    ],
    details: {
      text: "Artifact",
      author: "Dhruv Bidari",
      focus: "Reflection / Discussion",
      links: [{ label: "Artifacts", href: "javascript:void(0)" }],
    },
    descriptionHtml:
      "<p>Will update this description on the weekend of 5/27 to 5/29 as I learn more about the project.</p>",
  },

  "semester2-reflection": {
    pageTitle: "Semester 2 Reflection",
    heroTitle: "Semester 2 Reflection",
    heroSubtitle:
      "Semester 2 Reflection — identity, growth, and the connections between literature, learning, and the future.",
    heroBg: "images/reflectionSemester1-1.jpg",
    hasTop5: false,
    slider: [
      {
        src: "images/reflectionSemester2-1.jpg",
        fit: "contain",
        alt: "Semester 2 reflection slide 1",
      },
      {
        src: "images/reflectionSemester1-2.jpg",
        fit: "contain",
        alt: "Semester 2 reflection slide 2",
      },
    ],
    details: {
      text: "Reflection",
      author: "Dhruv Bidari",
      focus: "Growth / Skills",
      links: [{ label: "Reflection", href: "javascript:void(0)" }],
    },
    descriptionHtml:
      "<p>I kept honing my literary analysis skills through attentive reading, conversation, and introspection during the second semester of IB English. I gained a better understanding of how complex human relationships are shaped by silence, ethnicity, identity, and family expectations by reading Celeste Ng's Everything I Never Told You. Carol Ann Duffy's poetry prompted me to consider voice, memory, gender, conflict, and how authors convey intense emotion through commonplace imagery. The intertextuality essay between Ng and Calvino improved my capacity to link two disparate pieces through a common worldwide concern, particularly the harm that external expectations can do to genuine identity. Through career research, ACT preparation, CV creation, and college major exploration, the College and Career Unit also assisted me in thinking about my own future. Throughout the semester, I was inspired to go beyond summary and concentrate more on meaning, authorial choices, and thematic connections through fishbowl discussions, annotations, written inquiries, and creative projects. By the end of the semester, I was more comfortable with both literary analysis and using English class to gain a deeper understanding of myself, ambition, communication, and the future.</p>",
  },

  kafka: {
    pageTitle: "Unit 1: Kafka",
    heroTitle: "Unit 1: Kafka",
    heroSubtitle:
      "The Metamorphosis — identity, isolation, and the brutal logic of family obligation.",
    heroBg: "images/kafka3.jpg",

    hasTop5: true,

    slider: [
      { src: "images/kafka.jpg", fit: "contain", alt: "Kafka slide 1" },
      { src: "images/kafka2.jpg", fit: "contain", alt: "Kafka slide 2" },
      { src: "images/kafka4.png", fit: "contain", alt: "Kafka slide 3" },
      { src: "images/kafka5.png", fit: "contain", alt: "Kafka slide 4" },
    ],

    details: {
      text: "The Metamorphosis",
      author: "Franz Kafka",
      focus: "Transformation / Alienation",
      links: [
        { label: "TTT", href: "javascript:void(0)" },
        { label: "GIS", href: "javascript:void(0)" },
      ],
    },

    descriptionHtml:
      "<p>The Metamorphosis by Franz Kafka explores alienation, identity, and the pressure of social expectations. The story follows Gregor Samsa, who awakens transformed into an insect and becomes increasingly isolated from his family. Kafka uses the absurd transformation to expose emotional distance and the fragility of human relationships.</p>" +
      "<p><a href='https://docs.google.com/document/d/1cqKbc4Tn1bwdNSVFZfdQPfYk-RXCpijA3llLEBn5WbY/edit?tab=t.0'>The Metamorphosis</a></p>" +
      "<p><a href='https://docs.google.com/presentation/d/14TierkLCJqI98ikJAhtIn3vhkxY-hKaHWOjqz6gCu2I/edit?usp=sharing'>Table Talk Tasks</a></p>" +
      "<p><a href='https://docs.google.com/document/d/1a1UKAqDX42kFbbzi9Rxn7V59n8yQUQBBkktSpZBVPLU/edit?usp=sharing'>Global Issue Statement</a></p>",

    top5: [
      {
        title: "Alienation defines Gregor’s transformation.",
        body: "Gregor’s physical change into an insect mirrors the emotional isolation he already experiences within his family and society.",
      },
      {
        title: "The story critiques identity tied to productivity.",
        body: "Gregor’s value to his family disappears once he can no longer work, exposing how identity is often reduced to economic usefulness.",
      },
      {
        title: "The work embodies the concept of the Kafkaesque.",
        body: "Kafka presents an absurd, illogical situation treated as normal, creating a disturbing atmosphere of helplessness and existential anxiety.",
      },
      {
        title: "Symbolism reveals psychological and social confinement.",
        body: "Symbolism in the novella reflects Gregor’s growing sense of guilt and confinement while illustrating the gradual deterioration of his relationship with his family.",
      },
      {
        title: "The novella explores existential questions about humanity.",
        body: "By removing Gregor’s human form but preserving his consciousness, Kafka forces readers to question what truly defines being human.",
      },
    ],
  },

  calvino: {
    pageTitle: "Unit 2: Calvino",
    heroTitle: "Unit 2: Calvino",
    heroSubtitle:
      "The Nonexistent Knight — identity, duty, and the fragile boundary between appearance and existence.",
    heroBg: "images/calvino3.jpg",
    hasTop5: true,
    slider: [
      { src: "images/calvino.jpg", fit: "contain", alt: "Calvino slide 1" },
      { src: "images/calvino2.jpg", fit: "contain", alt: "Calvino slide 2" },
      { src: "images/calvino4.png", fit: "contain", alt: "Calvino slide 3" },
    ],
    details: {
      text: "The Nonexistent Knight",
      author: "Italo Calvino",
      focus: "Identity / Existence",
      links: [
        { label: "TTT", href: "javascript:void(0)" },
        { label: "GIS", href: "javascript:void(0)" },
      ],
    },
    descriptionHtml:
      "<p>The Nonexistent Knight by Italo Calvino explores identity, duty, and the tension between appearance and reality. The story follows Agilulf, a knight who exists only through his strict adherence to rules and honor despite lacking a physical body. The Nonexistent Knight uses absurdity and satire to question what truly defines a person’s identity and purpose.</p>" +
      "<p><a href='https://docs.google.com/presentation/d/14TierkLCJqI98ikJAhtIn3vhkxY-hKaHWOjqz6gCu2I/edit?usp=sharing'>Table Talk Tasks</a></p>" +
      "<p><a href='https://docs.google.com/document/d/1DuOELpEbShJVovz4sKAAFSR7o1mQF4fm_GIKrXlM-T8/edit?usp=sharing'>Global Issue Statement</a></p>",
    top5: [
      {
        title:
          "Identity is constructed through action rather than physical existence.",
        body: "Agilulf exists solely because of his discipline and adherence to rules, suggesting identity can be built through behavior and belief.",
      },
      {
        title: "The novel uses satire to question social structures.",
        body: "Calvino humorously critiques rigid systems like chivalry, exposing how institutions rely on performance rather than genuine meaning.",
      },
      {
        title: "Appearance and reality often contradict each other.",
        body: "Characters who appear strong or honorable are often flawed, while the nonexistent knight embodies perfect discipline without a body.",
      },
      {
        title: "The story blends fantasy with philosophical reflection.",
        body: "Calvino uses absurd situations to explore deeper questions about individuality, purpose, and authenticity.",
      },
      {
        title: "Postmodern storytelling challenges traditional narrative.",
        body: "The narrator’s voice and playful structure emphasize storytelling itself, reminding readers that meaning is constructed rather than fixed.",
      },
    ],
  },

  szymborska: {
    pageTitle: "Unit 3: Szymborska",
    heroTitle: "Unit 3: Szymborska",
    heroSubtitle:
      "Everyday moments revealing profound truths about human existence.",
    heroBg: "images/szymborska3.jpg",
    hasTop5: true,
    slider: [
      {
        src: "images/szymborska.webp",
        fit: "contain",
        alt: "Szymborska slide 1",
      },
      {
        src: "images/szymborska2.webp",
        fit: "contain",
        alt: "Szymborska slide 2",
      },
      {
        src: "images/szymborska4.png",
        fit: "contain",
        alt: "Szymborska slide 3",
      },
    ],
    details: {
      text: "A Note",
      author: "Wisława Szymborska",
      focus: "Existence / Reflection",
      links: [
        { label: "TTT", href: "javascript:void(0)" },
        { label: "GIS", href: "javascript:void(0)" },
      ],
    },
    descriptionHtml:
      "<p>Wisława Szymborska writes poetry that reflects on everyday life, human nature, and the mysteries of existence. Her poems often use simple observations, among other literary techniques, to explore complex philosophical ideas about knowledge and what it truly means to be human.</p>" +
      "<p><a href='https://docs.google.com/document/d/17hwReauWqncdVKfwnLrinhh5SZKQz3dZFDle4dRotRg/edit?usp=sharing'>Table Talk Tasks</a></p>" +
      "<p><a href='https://docs.google.com/document/d/1hT1kmH7K6VA_KB3QTbiNurt2Xgt7TTh2Mo8jSYXpahA/edit?usp=sharing'>Global Issue Statement</a></p>",
    top5: [
      {
        title: "Ordinary moments reveal profound philosophical ideas.",
        body: "Szymborska uses simple observations about everyday life to explore larger questions about existence and human awareness.",
      },
      {
        title: "Irony and curiosity drive her poetic voice.",
        body: "Her poems often question assumptions and encourage readers to reconsider things they normally overlook.",
      },
      {
        title: "Perspective shapes how humans understand reality.",
        body: "Many poems highlight how limited human perception is when compared to the complexity of the universe.",
      },
      {
        title: "Time and chance influence human life.",
        body: "Szymborska frequently reflects on how coincidence, time, and small choices shape existence.",
      },
      {
        title: "Poetry becomes a tool for reflection rather than certainty.",
        body: "Instead of providing answers, her work invites readers to remain curious and thoughtful about the world.",
      },
    ],
  },

  performative: {
    pageTitle: "Performative Literacy Project",
    heroTitle: "Performative Literacy Project",
    heroSubtitle:
      "Visualizing isolation and transformation through interactive 3D space.",
    heroBg: "images/performativeLiteracy.png",
    hasTop5: false, // example: NO top 5
    slider: [
      {
        src: "images/performativeLiteracy2.png",
        fit: "contain",
        alt: "Lit motion slide 1",
      },
      {
        src: "images/performativeLiteracy3.png",
        fit: "contain",
        alt: "Lit motion slide 2",
      },
    ],
    details: {
      text: "Project",
      author: "Dhruv & Max",
      focus: "Performance / Literacy",
      links: [
        { label: "Description", href: "javascript:void(0)" },
        { label: "Site", href: "javascript:void(0)" },
      ],
    },
    descriptionHtml:
      "<p>An interactive 3D model of Gregor Samsa’s house created using Three.js. The project visually represents the setting of The Metamorphosis through animation and spatial exploration, allowing viewers to experience the confined environment that reflects Gregor’s isolation.</p>" +
      "<p><a href='https://docs.google.com/document/d/1eeWTNScjrS4lFi2wrehJnssYotv3o8eSZY-_FjwCEV4/edit?usp=sharing'>Description</a></p>" +
      "<p><a href='https://dhruvbidari.github.io/Dhruv-Max---Performative-Literacy-Final-Assignment/'>View the Project</a></p>",
  },

  "lit-motion": {
    pageTitle: "Literature in Motion",
    heroTitle: "Literature in Motion",
    heroSubtitle:
      "Translating literary ideas into physical movement and visual symbolism.",
    heroBg: "images/literatureInMotion2.jpg",
    hasTop5: false,
    slider: [
      {
        src: "images/literatureInMotion.jpg",
        fit: "contain",
        alt: "Lit motion slide 1",
      },
      {
        src: "images/literatureInMotion3.webp",
        fit: "contain",
        alt: "Lit motion slide 2",
      },
    ],
    details: {
      text: "Project",
      author: "Franz Kafka",
      focus: "Motion / Interpretation",
      links: [
        { label: "Script", href: "javascript:void(0)" },
        { label: "Planning", href: "javascript:void(0)" },
      ],
    },
    descriptionHtml:
      "<p>A group project where we programmed a Dash robot to physically represent the themes and literary techniques in The Sudden Walk. Through movement, speed changes, and breaking out of a boxed space, the robot symbolized the character’s impulsive decision and the tension between confinement and freedom.</p>" +
      "<p><a href='https://docs.google.com/document/d/1Zd56kPgHFehkEnoX-q9PeNqZ1ecOoJUNCzZ3KhbJScQ/edit?tab=t.0'>Description</a></p>" +
      "<p><a href='https://docs.google.com/document/d/1DTnRTs0Hs5wLnrzwoZ6GzmEepdRcyZ-Ol6QeHrPx1Lk/edit?usp=sharing'>View our Script</a></p>",
  },

  "semester1-reflection": {
    pageTitle: "Semester 1 Reflection",
    heroTitle: "Semester 1 Reflection",
    heroSubtitle:
      "Reflecting on growth in literary analysis, interpretation, and creative engagement with texts.",
    heroBg: "images/reflectionSemester1-1.jpg",
    hasTop5: false,
    slider: [
      {
        src: "images/reflectionSemester1-2.jpg",
        fit: "contain",
        alt: "Kafka slide 1",
      },
      {
        src: "images/reflectionSemester1-3.jpg",
        fit: "contain",
        alt: "Kafka slide 2",
      },
    ],
    details: {
      text: "Reflection",
      author: "Dhruv Bidari",
      focus: "Growth / Skills",
      links: [{ label: "None", href: "javascript:void(0)" }],
    },
    descriptionHtml:
      "<p>During the first semester of IB English, I developed a deeper comprehension of how literature conveys intricate concepts through structure, symbolism, and perspective. Examining the writings of Kafka, Calvino, and Szymborska revealed how authors use unusual scenarios and thoughtful reflections to explore questions about identity and the nature of human existence. I gained greater confidence in recognizing literary devices and explaining how they influence the meaning of a text. Class discussions and consistent writing tasks helped me realize that interpretation often changes depending on the reader’s perspective. Creative projects, such as constructing a 3D model of Gregor's home and coding a robot to symbolize a literary journey, encouraged me to think about literature in ways that extended beyond conventional analysis. These experiences allowed me to move beyond simply understanding the plot and instead reflect on the reasons authors structure their stories in particular ways. Throughout the semester, I strengthened my ability to connect literary techniques to broader themes and ideas. By the end of the term, I found myself engaging with literature with greater curiosity and a more analytical perspective, rather than simply reading a text at face value.</p>",
  },
};

function init404Page() {
  // Only run on 404.html (or any page containing this block)
  var root = document.getElementById("error404");
  if (!root) return;

  var from = "";
  try {
    var params = new URLSearchParams(window.location.search);
    from = params.get("from") || "";
  } catch (e) {}

  var badEl = document.getElementById("badRoute");
  if (badEl) badEl.textContent = from ? from : "Unknown route";

  var wrap = document.getElementById("errorQuickLinks");
  if (!wrap) return;

  wrap.innerHTML = "";

  var items = [
    { key: "kafka", label: "Unit 1: Kafka" },
    { key: "calvino", label: "Unit 2: Calvino" },
    { key: "szymborska", label: "Unit 3: Szymborska" },
    { key: "performative", label: "Performative Literacy Project" },
    { key: "lit-motion", label: "Literature in Motion" },
    { key: "semester1-reflection", label: "Semester 1 Reflection" },
  ];

  items.forEach(function (it) {
    var a = document.createElement("a");
    a.className = "btn btn-outline-pill btn-custom-light error-link-btn";
    a.href = UNIT_PAGE_LINKS[it.key] || "unit.html#kafka";
    a.textContent = it.label;
    wrap.appendChild(a);
  });
}

function unitPageRouter() {
  // Only run on the unit template page
  var heroTitleEl = document.getElementById("unitHeroTitle");
  var sliderEl = document.getElementById("unitSlider");
  if (!heroTitleEl || !sliderEl) return;

  var key = (window.location.hash || "").replace("#", "").trim();

  // If no project hash, do NOT default to a project — send to 404
  if (!key) {
    var from =
      window.location.pathname + window.location.search + window.location.hash;
    window.location.replace("404.html?from=" + encodeURIComponent(from));
    return;
  }

  var data = UNIT_PAGES[key];
  if (!data) {
    // Redirect to 404 and include the bad route
    var from =
      window.location.pathname + window.location.search + window.location.hash;
    window.location.replace("404.html?from=" + encodeURIComponent(from));
    return;
  }

  buildUnitPage(data);

  // Re-render if user changes the hash while staying on unit.html
  if (!window.__unitHashListenerAdded) {
    window.__unitHashListenerAdded = true;
    window.addEventListener("hashchange", function () {
      unitPageRouter();
    });
  }
}

function setRevealHeroText(el, text) {
  if (!el) return;

  // If GSAP reveal wrapper exists, update only the reveal-content
  var rc = el.querySelector(".reveal-content");
  if (rc) {
    rc.textContent = text || "";
    return;
  }

  // If wrapper was destroyed by a previous textContent write, rebuild it
  el.innerHTML =
    '<span class="reveal-wrap">' +
    '<span class="cover"></span>' +
    '<span class="reveal-content"></span>' +
    "</span>";

  el.querySelector(".reveal-content").textContent = text || "";
}

function buildUnitPage(data) {
  // document title + meta
  document.title = data.pageTitle || "Unit";
  var metaDesc = document.getElementById("metaDesc");
  if (metaDesc && data.pageTitle)
    metaDesc.setAttribute("content", data.pageTitle);

  // hero
  var hero = document.getElementById("home-section");
  if (hero && data.heroBg) {
    // Set container bg (works if jarallax hasn't injected yet)
    hero.style.backgroundImage = "url('" + data.heroBg + "')";

    // If jarallax already injected an <img class="jarallax-img">, update that too
    var jImg = hero.querySelector(".jarallax-img");
    if (jImg) {
      jImg.setAttribute("src", data.heroBg);
    }
  }
  var heroTitleEl = document.getElementById("unitHeroTitle");
  var heroSubEl = document.getElementById("unitHeroSubtitle");
  setRevealHeroText(heroTitleEl, data.heroTitle || "");
  setRevealHeroText(heroSubEl, data.heroSubtitle || "");

  // toggle top5 presence
  var hasTop5 = !!data.hasTop5;
  document.body.classList.toggle("unit-no-top5", !hasTop5);

  // description + top5 injection
  var descPanel = document.getElementById("unitDescPanel");
  if (descPanel) descPanel.innerHTML = data.descriptionHtml || "";

  var top5Grid = document.getElementById("unitTop5Grid");
  if (top5Grid) {
    top5Grid.innerHTML = "";
    if (hasTop5 && Array.isArray(data.top5)) {
      data.top5.forEach(function (it, idx) {
        var n = idx + 1;
        var div = document.createElement("div");
        div.className = "top5-item";
        div.innerHTML =
          '<div class="top5-num">' +
          n +
          "</div>" +
          '<div class="top5-body">' +
          "<h4>" +
          (it.title || "") +
          "</h4>" +
          "<p>" +
          (it.body || "") +
          "</p>" +
          "</div>";
        top5Grid.appendChild(div);
      });
    }
  }

  // details
  var t = document.getElementById("detailText");
  var a = document.getElementById("detailAuthor");
  var f = document.getElementById("detailFocus");
  if (t) t.textContent = (data.details && data.details.text) || "—";
  if (a) a.textContent = (data.details && data.details.author) || "—";
  if (f) f.textContent = (data.details && data.details.focus) || "—";

  var linksWrap = document.getElementById("detailLinks");
  if (linksWrap) {
    linksWrap.innerHTML = "";
    var links = (data.details && data.details.links) || [];
    links.forEach(function (lk, i) {
      var aa = document.createElement("a");
      aa.className = "unit-link";
      aa.href = lk.href || "#";
      aa.target = "_self";
      aa.textContent = lk.label || "Link";
      linksWrap.appendChild(aa);
      if (i !== links.length - 1) {
        linksWrap.appendChild(document.createTextNode(" · "));
      }
    });
  }

  // slider build (per-image cover/contain)
  buildUnitSlider((data.slider || []).slice());

  // if top5 disabled, force description title
  var titleEl = document.getElementById("unitDescTitle");
  if (titleEl && !hasTop5) titleEl.textContent = "Description";

  // if hash scrolls directly to #unit-summary-section and top5 exists, auto-switch after load
  if (
    hasTop5 &&
    window.location.hash === "#unit-summary-section" &&
    window.setUnitDescMode
  ) {
    window.setUnitDescMode("top5");
  }
}

function buildUnitSlider(slides) {
  var $ = window.jQuery;
  var slider = document.getElementById("unitSlider");
  if (!slider || !$) return;

  // normalize: ensure at least 2 slides for Owl
  slides = (slides || []).filter(function (s) {
    return s && s.src;
  });
  if (slides.length === 1) slides.push(slides[0]);
  if (slides.length === 0) {
    slides = [
      { src: "images/work_2_md.jpg", fit: "contain", alt: "Default slide 1" },
      { src: "images/work_2_md.jpg", fit: "contain", alt: "Default slide 2" },
    ];
  }

  // destroy if already initialized
  try {
    $(".single-slider.owl-loaded").trigger("destroy.owl.carousel");
    $(".single-slider.owl-loaded").removeClass("owl-loaded");
    $(".single-slider").find(".owl-stage-outer").children().unwrap();
  } catch (e) {}

  slider.innerHTML = "";

  slides.forEach(function (s) {
    var fit =
      (s.fit || "contain").toLowerCase() === "cover"
        ? "fit-cover"
        : "fit-contain";
    var div = document.createElement("div");
    div.className = "slide " + fit;
    div.innerHTML =
      '<img src="' +
      s.src +
      '" class="img-fluid" alt="' +
      (s.alt || "") +
      '"/>';
    slider.appendChild(div);
  });

  // re-init Owl using your existing helper if present; otherwise init directly
  if (typeof owlSingleSlider === "function") {
    owlSingleSlider();
  } else {
    $(".single-slider").owlCarousel({
      center: false,
      items: 1,
      loop: true,
      stagePadding: 0,
      margin: 0,
      smartSpeed: 450,
      autoplay: false,
      autoplayHoverPause: true,
      dots: true,
      nav: true,
      navText: [
        '<span class="icon-keyboard_arrow_left">',
        '<span class="icon-keyboard_arrow_right">',
      ],
    });
  }
}

var siteIstotope = function () {
  var $containers = $("#posts, #posts-semester-2, .portfolio-posts").filter(
    function () {
      return $(this).length && $(this).find(".item").length;
    }
  );

  if (!$containers.length) return;

  function layoutAll() {
    $containers.each(function () {
      var $container = $(this);
      if ($container.data("isotope")) {
        $container.isotope({ sortBy: "originalOrder" });
        $container.isotope("layout");
      }
    });
  }

  $containers.each(function () {
    var $container = $(this);

    $container.isotope({
      itemSelector: ".item",
      percentPosition: true,
      transitionDuration: "0.35s",
      getSortData: {
        originalOrder: function (itemElem) {
          return $(itemElem).index();
        },
      },
      sortBy: "originalOrder",
      masonry: {
        columnWidth: ".item",
      },
    });

    $container.imagesLoaded().always(function () {
      $container.isotope({ sortBy: "originalOrder" });
      $container.isotope("layout");
      setTimeout(layoutAll, 150);
      setTimeout(layoutAll, 500);
    });

    $container.imagesLoaded().progress(function () {
      $container.isotope("layout");
    });
  });

  $("#filters").on("click", "a", function (e) {
    e.preventDefault();

    var filterValue = $(this).attr("data-filter") || "*";

    $containers.each(function () {
      var $container = $(this);
      if ($container.data("isotope")) {
        $container.isotope({ filter: filterValue, sortBy: "originalOrder" });
      }
    });

    $("#filters a").removeClass("active");
    $(this).addClass("active");
  });

  $(".js-filter").on("click", function (e) {
    e.preventDefault();
    $("#filters").toggleClass("active");
    layoutAll();
  });

  $(window).on("load resize orientationchange scroll", function () {
    layoutAll();
  });

  document.addEventListener("aos:in", layoutAll);

  setTimeout(layoutAll, 200);
  setTimeout(layoutAll, 700);
  setTimeout(layoutAll, 1400);
};

var loader = function () {
  setTimeout(function () {
    TweenMax.to(".site-loader-wrap", 1, {
      marginTop: 50,
      autoAlpha: 0,
      ease: Power4.easeInOut,
    });
  }, 10);
  $(".site-loader-wrap").delay(200).fadeOut("slow");
  $("#unslate_co--overlayer").delay(200).fadeOut("slow");
};

var siteMenuClone = function () {
  setTimeout(function () {
    $(".js-clone-nav").each(function () {
      var $this = $(this);
      $this
        .clone()
        .attr("class", "site-nav-wrap")
        .appendTo(".site-mobile-inner");
    });

    var counter = 0;
    $(".unslate_co--site-mobile-menu .has-children").each(function () {
      var $this = $(this);

      $this.prepend('<span class="arrow-collapse collapsed">');

      $this.find(".arrow-collapse").attr({
        "data-toggle": "collapse",
        "data-target": "#collapseItem" + counter,
      });

      $this.find("> ul").attr({
        class: "collapse",
        id: "collapseItem" + counter,
      });

      counter++;
    });
  }, 1000);

  $("body").on("click", ".arrow-collapse", function (e) {
    var $this = $(this);
    if ($this.closest("li").find(".collapse").hasClass("show")) {
      $this.removeClass("active");
    } else {
      $this.addClass("active");
    }
    e.preventDefault();
  });

  $(window).resize(function () {
    var $this = $(this),
      w = $this.width();

    if (w > 768) {
      if ($("body").hasClass("offcanvas")) {
        $("body").removeClass("offcanvas");
      }
    }
  });

  $(".js-burger-toggle-menu").click(function (e) {
    e.preventDefault();
    if ($("body").hasClass("offcanvas")) {
      $("body").removeClass("offcanvas");
      $(".js-burger-toggle-menu").removeClass("open");
    } else {
      $("body").addClass("offcanvas");
      $(".js-burger-toggle-menu").addClass("open");
    }
  });
};

var owlCarouselPlugin = function () {
  $(".testimonial-slider").owlCarousel({
    center: false,
    items: 1,
    loop: true,
    stagePadding: 20,
    margin: 10,
    smartSpeed: 2000,
    autoplay: true,
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navText: [
      '<span class="icon-keyboard_arrow_left">',
      '<span class="icon-keyboard_arrow_right">',
    ],
    responsive: {
      400: { stagePadding: 20, margin: 10 },
      600: { stagePadding: 100, margin: 50 },
    },
  });

  owlSingleSlider();

  if ($(".logo-slider").length) {
    $(".logo-slider").owlCarousel({
      center: false,
      loop: true,
      stagePadding: 0,
      margin: 0,
      smartSpeed: 1000,
      autoplay: true,
      autoplayHoverPause: true,
      dots: false,
      nav: false,
      responsive: {
        400: { items: 2 },
        768: { items: 3 },
        1000: { items: 5 },
      },
    });
  }
};

var owlSingleSlider = function () {
  if ($(".single-slider").length) {
    // Prevent double-init if you open multiple portfolio items
    try {
      $(".single-slider.owl-loaded").trigger("destroy.owl.carousel");
      $(".single-slider.owl-loaded").removeClass("owl-loaded");
      $(".single-slider").find(".owl-stage-outer").children().unwrap();
    } catch (e) {}

    $(".single-slider").owlCarousel({
      center: false,
      items: 1,
      loop: true,
      stagePadding: 0,
      margin: 0,
      smartSpeed: 450,
      autoplay: false,
      autoplayHoverPause: true,
      dots: true,
      nav: true,
      navText: [
        '<span class="icon-keyboard_arrow_left">',
        '<span class="icon-keyboard_arrow_right">',
      ],
      responsive: {
        400: { stagePadding: 0, margin: 0 },
        600: { stagePadding: 0, margin: 0 },
      },
    });
  }
};

var floatingLabel = function () {
  $(".form-control").on("input", function () {
    var $field = $(this).closest(".form-group");
    if (this.value) $field.addClass("field--not-empty");
    else $field.removeClass("field--not-empty");
  });
};

var scrollWindow = function () {
  var lastScrollTop = 0;
  $(window).scroll(function () {
    var st = $(this).scrollTop(),
      navbar = $(".unslate_co--site-nav");

    if (st > 150) {
      if (!navbar.hasClass("scrolled")) navbar.addClass("scrolled");
    }
    if (st < 150) {
      if (navbar.hasClass("scrolled")) navbar.removeClass("scrolled sleep");
    }
    if (st > 350) {
      if (!navbar.hasClass("awake")) navbar.addClass("awake");

      if (st > lastScrollTop) {
        navbar.removeClass("awake");
        navbar.addClass("sleep");
      } else {
        navbar.addClass("awake");
      }
      lastScrollTop = st;
    }
    if (st < 350) {
      if (navbar.hasClass("awake")) {
        navbar.removeClass("awake");
        navbar.addClass("sleep");
      }
    }
  });
};

var counter = function () {
  $(".section-counter").waypoint(
    function (direction) {
      if (direction === "down" && !$(this.element).hasClass("ftco-animated")) {
        var comma_separator_number_step =
          $.animateNumber.numberStepFactories.separator(",");
        $(this.element)
          .find(".number-counter")
          .each(function () {
            var $this = $(this),
              num = $this.data("number");
            $this.animateNumber(
              { number: num, numberStep: comma_separator_number_step },
              { easing: "swing", duration: 3000 }
            );
          });
      }
    },
    { offset: "95%" }
  );
};

var mobileToggleClick = function () {
  $(".js-menu-toggle").click(function (e) {
    e.preventDefault();

    if ($("body").hasClass("offcanvas")) {
      $("body").removeClass("offcanvas");
      $(".js-menu-toggle").removeClass("active");
      if ($(".js-burger-toggle-menu").length) {
        $(".js-burger-toggle-menu").removeClass("open");
      }
    } else {
      $("body").addClass("offcanvas");
      $(".js-menu-toggle").addClass("active");
      if ($(".js-burger-toggle-menu").length) {
        $(".js-burger-toggle-menu").addClass("open");
      }
    }
  });

  $(document).mouseup(function (e) {
    var container = $(".unslate_co--site-mobile-menu");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($("body").hasClass("offcanvas")) {
        $("body").removeClass("offcanvas");
        $("body").find(".js-menu-toggle").removeClass("active");
        $("body").find(".js-burger-toggle-menu").removeClass("open");
      }
    }
  });
};

var hardHomeReloadLinks = function () {
  function isIndexPage() {
    var path = (window.location.pathname || "").toLowerCase();
    var looksLikeFolderRoot = path.endsWith("/") || !path.includes(".html");

    return (
      path.endsWith("/index.html") ||
      path === "/index.html" ||
      path.endsWith("index.html") ||
      looksLikeFolderRoot
    );
  }

  $("body").on("click", ".js-hard-home-reload", function (e) {
    e.preventDefault();

    var target = "index.html";

    if (isIndexPage()) {
      try {
        history.replaceState(null, "", target);
      } catch (err) {}

      $("html, body").stop(true, true).scrollTop(0);

      var logo = document.getElementById("siteLogo");
      if (logo) {
        logo.setAttribute(
          "src",
          logo.getAttribute("data-logo-white") || "images/logoCustomWhite.png"
        );
      }

      $(".unslate_co--site-nav").removeClass("scrolled");
      window.location.reload();
      return;
    }

    window.location.href = target;
  });
};

var onePageNavigation = function () {
  function isIndexPage() {
    var path = (window.location.pathname || "").toLowerCase();

    // GitHub Pages serves index.html at the folder root without showing index.html in the URL
    // Example: /IBDigitalPortfolio or /IBDigitalPortfolio/
    var looksLikeFolderRoot = path.endsWith("/") || !path.includes(".html");

    return (
      path.endsWith("/index.html") ||
      path === "/index.html" ||
      path.endsWith("index.html") ||
      looksLikeFolderRoot
    );
  }

  function closeMobileMenuIfOpen() {
    var $body = $("body");
    if ($body.hasClass("offcanvas")) {
      $body.removeClass("offcanvas");
      $("body").find(".js-burger-toggle-menu").removeClass("open");
    }
  }

  // 1) NAVBAR LINKS:
  // - If on index: smooth scroll + UPDATE URL hash
  // - If on any other page: navigate to index.html#hash (index load code will animate)
  $("body").on(
    "click",
    ".unslate_co--site-nav .site-nav-ul li a[href^='#'], .unslate_co--site-mobile-menu .site-nav-wrap li a[href^='#']",
    function (e) {
      e.preventDefault();
      closeMobileMenuIfOpen();

      var hash = this.hash;
      if (!hash) return;

      if (!isIndexPage()) {
        // Go to index and let index's hash-load smooth scroll handle animation
        window.location.href = "index.html" + hash;
        return;
      }

      // On index: smooth scroll + change URL
      if (!$(hash).length) return;

      var navOffset = ($(".unslate_co--site-nav").outerHeight() || 0) + 20;

      // prevent scroll-based hash routing from fighting during animation
      window.__suppressHashRoutingUntil = Date.now() + 1400;

      $("html, body")
        .stop(true)
        .animate(
          {
            scrollTop: $(hash).offset().top - navOffset,
          },
          1000,
          "easeInOutExpo",
          function () {
            // Update URL for NAV clicks ONLY
            try {
              if (hash === "#home-section") {
                history.pushState(
                  null,
                  "",
                  window.location.pathname + window.location.search
                );
              } else {
                history.pushState(null, "", hash);
              }
            } catch (err) {
              if (hash === "#home-section") window.location.hash = "";
              else window.location.hash = hash;
            }
          }
        );
    }
  );

  // 2) OTHER SMOOTH SCROLL BUTTONS/LINKS (.smoothscroll):
  // Always smooth scroll, but NEVER change URL.
  $("body").on("click", ".smoothscroll[href^='#']", function (e) {
    e.preventDefault();

    var hash = this.hash;
    if (!hash || !$(hash).length) return;

    var navOffset = ($(".unslate_co--site-nav").outerHeight() || 0) + 20;

    // prevent scroll-based hash routing from fighting during animation
    window.__suppressHashRoutingUntil = Date.now() + 1400;

    $("html, body")
      .stop(true)
      .animate(
        {
          scrollTop: $(hash).offset().top - navOffset,
        },
        1000,
        "easeInOutExpo",
        function () {
          // After scrolling, force Top 5 mode when user navigates there
          if (
            hash === "#unit-summary-section" &&
            window.setUnitDescMode &&
            !document.body.classList.contains("unit-no-top5")
          ) {
            window.setUnitDescMode("top5");
          }
        }
      );
  });
};

var initIndexHashRouting = function () {
  var path = (window.location.pathname || "").toLowerCase();

  var looksLikeFolderRoot = path.endsWith("/") || !path.includes(".html");

  var isIndex =
    path.endsWith("/index.html") ||
    path === "/index.html" ||
    path.endsWith("index.html") ||
    looksLikeFolderRoot;

  if (!isIndex) return;

  // collect section ids from nav links
  var ids = [];
  document
    .querySelectorAll(
      ".unslate_co--site-nav a[href^='#'], .unslate_co--site-mobile-menu a[href^='#']"
    )
    .forEach(function (a) {
      var h = a.getAttribute("href");
      if (!h || h.length < 2) return;
      var id = h.slice(1);
      if (id && document.getElementById(id) && !ids.includes(id)) ids.push(id);
    });

  if (!ids.length) return;

  // helper: set hash without spamming history
  function setHash(id) {
    // If a portfolio single is open, NEVER let scroll-routing change the URL hash
    if (window.__portfolioSingleOpen) return;

    // If we are currently smooth-scrolling due to a click, do NOT change the URL
    if (
      window.__suppressHashRoutingUntil &&
      Date.now() < window.__suppressHashRoutingUntil
    ) {
      return;
    }

    try {
      if (!id || id === "home-section") {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      } else {
        history.replaceState(null, "", "#" + id);
      }
    } catch (e) {
      if (!id || id === "home-section") window.location.hash = "";
      else window.location.hash = id;
    }
  }

  var current = null;

  // Prefer IntersectionObserver if available
  if ("IntersectionObserver" in window) {
    var navH = ($(".unslate_co--site-nav").outerHeight() || 0) + 20;

    var obs = new IntersectionObserver(
      function (entries) {
        // pick the most "visible" intersecting entry
        var best = null;
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          if (!best || en.intersectionRatio > best.intersectionRatio) best = en;
        });
        if (!best) return;

        var id = best.target && best.target.id;
        if (!id || id === current) return;

        current = id;
        setHash(id);
      },
      {
        // shift the "active line" down by nav height so it matches what user sees
        root: null,
        rootMargin: "-" + navH + "px 0px -55% 0px",
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
      }
    );

    ids.forEach(function (id) {
      obs.observe(document.getElementById(id));
    });
  } else {
    // Scroll fallback (throttled)
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;

          var navH = ($(".unslate_co--site-nav").outerHeight() || 0) + 20;
          var y = window.scrollY + navH + 10;

          var active = "home-section";
          ids.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            var top = el.getBoundingClientRect().top + window.scrollY;
            if (top <= y) active = id;
          });

          if (active !== current) {
            current = active;
            setHash(active);
          }
        });
      },
      { passive: true }
    );
  }
};

var unitDescToggle = function () {
  function getActivePanel(mode) {
    return document.querySelector(
      '.unit-desc-mode[data-desc-panel="' + mode + '"]'
    );
  }

  function setWrapHeightTo(panelEl) {
    var wrap = document.querySelector(".unit-desc-anim-wrap");
    if (!wrap || !panelEl) return;

    // lock to current height first (prevents snapping)
    var startH = wrap.getBoundingClientRect().height;
    wrap.style.height = startH + "px";

    // next frame: animate to new height
    requestAnimationFrame(function () {
      var endH = panelEl.getBoundingClientRect().height;
      wrap.style.height = endH + "px";
    });

    // after transition ends, let it be auto so resizing works naturally
    window.clearTimeout(window.__unitWrapTO);
    window.__unitWrapTO = window.setTimeout(function () {
      wrap.style.height = "auto";
    }, 320);
  }

  function setMode(mode) {
    var btns = document.querySelectorAll(".unit-toggle-btn");
    var panels = document.querySelectorAll(".unit-desc-mode");
    var titleEl = document.getElementById("unitDescTitle");

    btns.forEach(function (b) {
      var active = b.getAttribute("data-desc-mode") === mode;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(function (p) {
      var active = p.getAttribute("data-desc-panel") === mode;
      p.classList.toggle("is-active", active);
    });

    if (titleEl) {
      titleEl.textContent = mode === "top5" ? "Top 5" : "Description";
    }

    // animate wrapper height to the newly active panel
    setWrapHeightTo(getActivePanel(mode));
  }

  // expose so nav scroll can force Top 5 mode
  window.setUnitDescMode = setMode;

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".unit-toggle-btn");
    if (!btn) return;
    setMode(btn.getAttribute("data-desc-mode"));
  });

  // initial height setup (whichever is active on load)
  var initial =
    document
      .querySelector(".unit-toggle-btn.is-active")
      ?.getAttribute("data-desc-mode") || "free";
  setMode(initial);

  // if page loads already at Top 5 anchor, auto-switch
  if (window.location.hash === "#unit-summary-section") {
    setMode("top5");
  }

  // if fontsimages load later and change height, keep it correct
  window.addEventListener("resize", function () {
    var current =
      document
        .querySelector(".unit-toggle-btn.is-active")
        ?.getAttribute("data-desc-mode") || "free";
    setWrapHeightTo(getActivePanel(current));
  });
};

/**
 * Portfolio single view:
 * - Left media area should fill col-lg-8 (2/3 width)
 * - Uses per-item data:
 *    data-fit="contain|cover"
 *    data-images="img1,img2,img3"
 */
var portfolioItemClick = function () {
  var AUTO_ID_COUNTER = 1000;

  function normalizeImages(images) {
    var out = (images || []).filter(Boolean);
    if (out.length === 1) out = [out[0], out[0]];
    if (out.length === 0) out = ["images/post_1.jpg", "images/post_2.jpg"];
    return out;
  }

  function parseImagesAttr(val) {
    if (!val) return [];

    return val
      .split(",")
      .map(function (s) {
        return (s || "").trim();
      })
      .filter(Boolean);
  }

  function getPortfolioSectionFromTile($tile) {
    var $section = $tile.closest(".portfolio-section");

    if (!$section.length) {
      $section = $tile.closest(".unslate_co--section");
    }

    if (!$section.length) {
      $section = $("#semester-1-portfolio-section");
    }

    return $section;
  }

  function getSectionParts($section) {
    var $wrapper = $section.find(".portfolio-wrapper").first();
    var $titleBlock = $wrapper.children(".d-flex.align-items-center").first();
    var $grid = $wrapper.find(".gutter-isotope-item").first();
    var $holder = $wrapper.children(".portfolio-single-holder-inline").first();

    /*
    This holder sits AFTER the title but BEFORE the grid.
    So the title stays visible, and the opened item appears below it.
  */
    if (!$holder.length) {
      $holder = $('<div class="portfolio-single-holder-inline"></div>');

      if ($titleBlock.length) {
        $holder.insertAfter($titleBlock);
      } else {
        $wrapper.prepend($holder);
      }
    }

    var $inlineLoader = $holder.children(".portfolio-inline-loader").first();

    if (!$inlineLoader.length) {
      $inlineLoader = $(
        '<div class="portfolio-inline-loader">' +
          '<div class="loader-portfolio"></div>' +
          "</div>"
      );
      $holder.prepend($inlineLoader);
    }

    return {
      holder: $holder,
      wrapper: $wrapper,
      titleBlock: $titleBlock,
      grid: $grid,
      loader: $inlineLoader,
    };
  }

  function buildFromTile($tile) {
    var id = $tile.data("id");

    if (!id) {
      id = "auto-" + AUTO_ID_COUNTER++;
      $tile.attr("data-id", id).data("id", id);
    }

    var imgs = parseImagesAttr($tile.attr("data-images"));

    if (!imgs.length) {
      $tile.find("img").each(function () {
        var src = $(this).attr("src");
        if (src) imgs.push(src);
      });
    }

    var $section = getPortfolioSectionFromTile($tile);

    return {
      id: id,
      sectionId: $section.attr("id") || "semester-1-portfolio-section",
      title: ($tile.find("h3").first().text() || "Portfolio Item").trim(),
      description:
        $tile.attr("data-description") ||
        "Replace this placeholder with your real write-up for this entry.",
      link: $tile.attr("data-link") || "#",
      images: normalizeImages(imgs),
      fitMode: ($tile.attr("data-fit") || "contain").toLowerCase(),
    };
  }

  function buildPortfolioSingleHTML(item) {
    var images = normalizeImages(item.images);
    var fitMode = (item.fitMode || "contain").toLowerCase();
    var fitClass = fitMode === "cover" ? "fit-cover" : "fit-contain";

    var slides = images
      .map(function (src) {
        return (
          '<div class="slide"><img src="' +
          src +
          '" class="img-fluid" alt=""/></div>'
        );
      })
      .join("");

    return (
      '<div class="portfolio-single-wrap">' +
      '  <div class="container">' +
      '    <div class="row gutter-v4 align-items-start">' +
      '      <div class="col-lg-8 mb-4 mb-lg-0">' +
      '        <div class="portfolio-single-media w-100 ' +
      fitClass +
      '">' +
      '          <div class="single-slider owl-carousel">' +
      slides +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      '      <div class="col-lg-4">' +
      '        <h2 class="heading-h2 mb-4">' +
      item.title +
      "</h2>" +
      '        <div class="detail-v1 mb-4 portfolio-description">' +
      '          <span class="detail-label">Description</span>' +
      '          <p class="mb-0 desc-text">' +
      item.description +
      "</p>" +
      '          <p class="mb-0 mt-3">' +
      '            <a href="' +
      item.link +
      '" class="btn btn-outline-pill btn-custom-light learn-more-btn">Learn more</a>' +
      "          </p>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</div>"
    );
  }

  function destroySingleSlider($root) {
    try {
      var $owl = $root.find(".single-slider");

      if ($owl.length && $owl.hasClass("owl-loaded")) {
        $owl.trigger("destroy.owl.carousel");
        $owl.removeClass("owl-loaded");
        $owl.find(".owl-stage-outer").children().unwrap();
      }
    } catch (e) {}
  }

  function refreshAfterPortfolioChange() {
    try {
      if (typeof AOS !== "undefined") AOS.refreshHard();
    } catch (e) {}

    try {
      $(window).trigger("resize").trigger("scroll");
    } catch (e) {}
  }

  function layoutGrid($grid) {
    if (!$grid || !$grid.length) return;

    try {
      if ($grid.data("isotope")) {
        $grid.isotope({ sortBy: "originalOrder" });
        $grid.isotope("layout");
      }
    } catch (e) {}
  }

  function scrollToSection($section) {
    if (!$section.length) return;

    var navOffset = ($(".unslate_co--site-nav").outerHeight() || 0) + 20;

    $("html, body")
      .stop(true)
      .animate(
        {
          scrollTop: $section.offset().top - navOffset,
        },
        550,
        "easeInOutExpo"
      );
  }

  function setHash(sectionId) {
    if (!sectionId) return;

    try {
      history.replaceState(null, "", "#" + sectionId);
    } catch (e) {
      window.location.hash = sectionId;
    }
  }

  $("body").on("click", ".ajax-load-page", function (e) {
    e.preventDefault();

    var $tile = $(this);
    var item = buildFromTile($tile);
    var $section = $("#" + item.sectionId);
    var parts = getSectionParts($section);

    if (!parts.holder.length || !parts.grid.length) return;

    if (parts.holder.children().length) {
      var $existing = parts.holder.children();
      destroySingleSlider($existing);
      $existing.remove();
    }

    window.__portfolioSingleOpen = true;
    window.__activePortfolioSectionId = item.sectionId;
    window.__suppressHashRoutingUntil = Date.now() + 2200;

    setHash(item.sectionId);
    scrollToSection($section);

    TweenMax.to(parts.loader, 0.25, {
      autoAlpha: 1,
      display: "flex",
      ease: Power4.easeOut,
    });

    /*
      Hide ONLY the grid.
      Do NOT hide .portfolio-wrapper, because that contains the title.
    */
    TweenMax.to(parts.grid, 0.35, {
      autoAlpha: 0,
      onComplete: function () {
        TweenMax.set(parts.grid, {
          display: "none",
          clearProps: "marginTop,transform",
        });

        parts.holder.html(
          '<div id="portfolio-single-' +
            item.id +
            '" class="portfolio-single-inner" data-return-section="' +
            item.sectionId +
            '">' +
            '<button type="button" class="unslate_co--close-portfolio js-close-portfolio d-flex align-items-center" aria-label="Back to Portfolio">' +
            '<span class="close-portfolio-label">Back to Portfolio</span>' +
            '<span class="icon-close2 wrap-icon-close"></span>' +
            "</button>" +
            buildPortfolioSingleHTML(item) +
            "</div>"
        );

        setTimeout(function () {
          if (typeof owlSingleSlider === "function") owlSingleSlider();

          try {
            parts.holder.find(".single-slider").trigger("refresh.owl.carousel");
          } catch (e) {}
        }, 20);

        TweenMax.set(parts.holder.find(".portfolio-single-inner"), {
          y: 20,
          autoAlpha: 0,
          display: "block",
        });

        TweenMax.to(parts.holder.find(".portfolio-single-inner"), 0.35, {
          y: 0,
          autoAlpha: 1,
          ease: Power4.easeOut,
          onComplete: function () {
            TweenMax.to(parts.loader, 0.2, {
              autoAlpha: 0,
              onComplete: function () {
                TweenMax.set(parts.loader, { display: "none" });
              },
            });

            refreshAfterPortfolioChange();
          },
        });
      },
    });
  });

  $("body").on("click", ".js-close-portfolio", function (e) {
    e.preventDefault();

    var $single = $(this).closest(".portfolio-single-inner");
    var sectionId =
      $single.attr("data-return-section") ||
      window.__activePortfolioSectionId ||
      "semester-1-portfolio-section";

    var $section = $("#" + sectionId);
    var parts = getSectionParts($section);

    if (!$section.length || !parts.grid.length) return;

    window.__portfolioSingleOpen = false;
    window.__suppressHashRoutingUntil = Date.now() + 1600;

    setHash(sectionId);

    TweenMax.to($single, 0.4, {
      y: 18,
      autoAlpha: 0,
      ease: Power4.easeInOut,
      onComplete: function () {
        destroySingleSlider($single);
        $single.remove();

        /*
          This fixes the ugly Semester 1 shift:
          show grid invisibly, force Isotope layout, then fade it in.
          No marginTop animation, no wrapper animation, no layout jump.
        */
        TweenMax.set(parts.grid, {
          display: "flex",
          visibility: "hidden",
          opacity: 0,
          clearProps: "marginTop,transform",
        });

        layoutGrid(parts.grid);

        setTimeout(function () {
          layoutGrid(parts.grid);

          TweenMax.set(parts.grid, {
            visibility: "visible",
          });

          TweenMax.to(parts.grid, 0.5, {
            autoAlpha: 1,
            ease: Power4.easeOut,
            onComplete: function () {
              layoutGrid(parts.grid);
              scrollToSection($section);
              refreshAfterPortfolioChange();
            },
          });
        }, 130);
      },
    });
  });
};

var jarallaxPlugin = function () {
  $(".jarallax").jarallax({ speed: 0.2 });
  jarallax(document.querySelectorAll(".jarallax-video"), {
    speed: 0.2,
    videoSrc: "https://www.youtube.com/watch?v=mwtbEGNABWU",
    videoStartTime: 8,
    videoEndTime: 70,
  });
};

var contactForm = function () {
  if ($("#contactForm").length > 0) {
    $("#contactForm").validate({
      rules: {
        name: "required",
        email: { required: true, email: true },
        message: { required: true, minlength: 5 },
      },
      messages: {
        name: "Please enter your name",
        email: "Please enter a valid email address",
        message: "Please enter a message",
      },
      errorElement: "span",
      errorLabelContainer: ".form-error",
      submitHandler: function (form) {
        var $submit = $(".submitting"),
          waitText = "Submitting...";

        $.ajax({
          type: "POST",
          url: "php/send-email.php",
          data: $(form).serialize(),
          beforeSend: function () {
            $submit.css("display", "block").text(waitText);
          },
          success: function (msg) {
            if (msg == "OK") {
              $("#form-message-warning").hide();
              setTimeout(function () {
                $("#contactForm").fadeOut();
              }, 1000);
              setTimeout(function () {
                $("#form-message-success").fadeIn();
              }, 1400);
            } else {
              $("#form-message-warning").html(msg).fadeIn();
              $submit.css("display", "none");
            }
          },
          error: function () {
            $("#form-message-warning")
              .html("Something went wrong. Please try again.")
              .fadeIn();
            $submit.css("display", "none");
          },
        });
      },
    });
  }
};

var stickyFillPlugin = function () {
  var elements = document.querySelectorAll(".unslate_co--sticky");
  Stickyfill.add(elements);
};

var animateReveal = function () {
  var controller = new ScrollMagic.Controller();

  /*
    Normal text/title reveal.
    Faster than before and triggers as the element enters the screen.
  */
  $(".gsap-reveal").each(function () {
    var $el = $(this);

    if (!$el.children(".cover").length) {
      $el.append('<span class="cover"></span>');
    }

    var cover = $el.children(".cover").first();

    var tl = new TimelineMax();
    tl.fromTo(
      cover,
      1.35,
      { xPercent: 0 },
      {
        xPercent: 101,
        transformOrigin: "0% 100%",
        ease: Expo.easeInOut,
      }
    );

    new ScrollMagic.Scene({
      triggerElement: this,
      triggerHook: 0.9,
      duration: 0,
      reverse: false,
      offset: 0,
    })
      .setTween(tl)
      .addTo(controller);
  });

  /*
    Portfolio/gallery image reveal.
    This was missing, which is why the gallery items stopped animating.
  */
  $(".gsap-reveal-img").each(function () {
    var $el = $(this);

    if (!$el.children(".reveal-wrap").length) {
      var html = $el.html();

      $el.html(
        '<span class="reveal-wrap">' +
          '<span class="cover"></span>' +
          '<span class="reveal-content">' +
          html +
          "</span>" +
          "</span>"
      );
    }

    var cover = $el.find("> .reveal-wrap > .cover").first();
    var content = $el.find("> .reveal-wrap > .reveal-content").first();

    var tlImg = new TimelineMax();

    tlImg
      .set(content, {
        autoAlpha: 0,
      })
      .set(cover, {
        marginLeft: "-100%",
      })
      .to(cover, 1, {
        marginLeft: "0%",
        ease: Expo.easeInOut,
      })
      .set(content, {
        autoAlpha: 1,
      })
      .to(cover, 1, {
        marginLeft: "102%",
        ease: Expo.easeInOut,
      });

    new ScrollMagic.Scene({
      triggerElement: this,
      triggerHook: 0.88,
      duration: 0,
      reverse: false,
      offset: 0,
    })
      .setTween(tlImg)
      .addTo(controller);
  });

  /*
    Hero reveal.
  */
  $(".gsap-reveal-hero").each(function () {
    var $el = $(this);

    if (!$el.children(".reveal-wrap").length) {
      var html = $el.html();

      $el.html(
        '<span class="reveal-wrap">' +
          '<span class="cover"></span>' +
          '<span class="reveal-content">' +
          html +
          "</span>" +
          "</span>"
      );
    }

    var cover = $el.find(".cover").first();
    var revealContent = $el.find(".reveal-content").first();

    var tlHero = new TimelineMax();

    tlHero.to(cover, 0.75, {
      marginLeft: "0",
      ease: Expo.easeInOut,
      onComplete: function () {
        tlHero.set(revealContent, { x: 0 });
        tlHero.to(cover, 0.75, {
          marginLeft: "102%",
          ease: Expo.easeInOut,
        });
      },
    });

    new ScrollMagic.Scene({
      triggerElement: this,
      triggerHook: 0.88,
      duration: 0,
      reverse: false,
      offset: 0,
    })
      .setTween(tlHero)
      .addTo(controller);
  });
};
