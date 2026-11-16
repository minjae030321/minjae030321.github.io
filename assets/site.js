/*
 * Minjae Kim personal website
 * 내용은 data/*.yml 파일에서 읽어옵니다. 내용 수정은 yml 파일만 고치면 됩니다.
 */

const NAV = [
  { href: "index.html", label: "About", page: "about" },
  { href: "projects.html", label: "Projects", page: "projects" },
  { href: "publications.html", label: "Publications", page: "publications" },
  { href: "cv.html", label: "CV", page: "cv" },
];

// 논문 저자 목록에서 굵게 표시할 내 이름
const MY_NAMES = ["김민재", "Minjae Kim"];

const CATEGORIES = [
  { id: "research", label: "Research" },
  { id: "internship", label: "Internship" },
  { id: "course", label: "Coursework" },
];

const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
};

/* ---------- helpers ---------- */

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel) => document.querySelector(sel);

async function loadData(name) {
  const res = await fetch(`data/${name}.yml`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`data/${name}.yml (${res.status})`);
  return jsyaml.load(await res.text(), { schema: jsyaml.CORE_SCHEMA });
}

function boldMe(authors) {
  let html = esc(authors);
  for (const n of MY_NAMES) html = html.split(esc(n)).join(`<b>${esc(n)}</b>`);
  return html;
}

/* ---------- layout ---------- */

function renderHeader(p, page) {
  $("#site-header").outerHTML = `
    <header class="site-header">
      <div class="container">
        <a class="brand" href="index.html">${esc(p.name)}<span>.</span></a>
        <nav class="nav">${NAV.map((n) => `<a href="${n.href}"${n.page === page ? ' class="active" aria-current="page"' : ""}>${n.label}</a>`).join("")}</nav>
      </div>
    </header>`;
}

function profileHTML(p) {
  return `
    <aside class="profile">
      <img src="${esc(p.photo)}" alt="${esc(p.name)}">
      <div>
        <h1>${esc(p.name)}</h1>
        <div class="ko">${esc(p.name_ko)}</div>
        <p class="role"><b>${esc(p.role)}</b><br>${esc(p.affiliation)}</p>
      </div>
      <ul class="contact">
        <li>${ICONS.mail}<a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>
        ${p.email2 ? `<li>${ICONS.mail}<a href="mailto:${esc(p.email2)}">${esc(p.email2)}</a></li>` : ""}
        ${p.github ? `<li>${ICONS.github}<a href="https://github.com/${esc(p.github)}" target="_blank" rel="noopener">github.com/${esc(p.github)}</a></li>` : ""}
      </ul>
    </aside>`;
}

function renderFooter(p) {
  $("#site-footer").outerHTML = `
    <footer class="site-footer"><div class="container">© ${new Date().getFullYear()} ${esc(p.name)} · Last updated ${document.lastModified.split(" ")[0]}</div></footer>`;
}

/* ---------- shared blocks ---------- */

function timelineHTML(items) {
  return `<ul class="timeline">${items.map((i) => `
    <li><span class="period">${esc(i.period)}</span><span><b>${esc(i.title)}</b><span class="org">${esc(i.org)}</span></span></li>`).join("")}</ul>`;
}

// 관련 프로젝트 링크: 상세 페이지가 있으면 상세로, 없으면 프로젝트 목록의 해당 카드로
let PROJECT_INDEX = {};
function projectHref(id) {
  return PROJECT_INDEX[id]?.detail ? `project.html?id=${encodeURIComponent(id)}` : `projects.html#${encodeURIComponent(id)}`;
}

// 증빙(증명서·성적표) 보기 / 관련 프로젝트 버튼
function extraButtons(x) {
  return [
    x.proof ? `<button class="btn" data-proof="${esc(x.proof)}" data-title="${esc(x.title || x.name || "")}">${ICONS.doc}증명서 보기</button>` : "",
    x.project ? `<a class="btn" href="${projectHref(x.project)}">${ICONS.link}관련 프로젝트</a>` : "",
  ].join("");
}

function projectCardHTML(pr) {
  const isDoc = /보고서|발표/.test(pr.video_label || "");
  return `
    <article class="project" id="${esc(pr.id)}" data-category="${esc(pr.category)}">
      <div class="cover">
        <img src="${esc(pr.image)}" alt="${esc(pr.title)}" loading="lazy">
        ${pr.video ? `<button class="play" data-video="${esc(pr.video)}" data-title="${esc(pr.title)}" aria-label="${esc(pr.title)} ${isDoc ? "자료" : "영상"} 보기"><span>${isDoc ? ICONS.doc : ICONS.play}</span></button>` : ""}
      </div>
      <div class="body">
        <div class="group">${esc(pr.group)}</div>
        <h3>${esc(pr.title)}</h3>
        ${pr.period || pr.role ? `<div class="meta">${[pr.period, pr.role && `담당: ${pr.role}`].filter(Boolean).map(esc).join(" · ")}</div>` : ""}
        ${pr.summary ? `<p class="summary">${esc(pr.summary)}</p>` : ""}
        ${pr.points ? `<ul>${pr.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        <div class="tools">${(pr.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        ${pr.video || pr.links || pr.detail ? `<div class="links">
          ${pr.detail ? `<a class="btn more" href="project.html?id=${encodeURIComponent(pr.id)}">More →</a>` : ""}
          ${pr.video ? `<button class="btn${pr.detail ? "" : " primary"}" data-video="${esc(pr.video)}" data-title="${esc(pr.title)}">${isDoc ? ICONS.doc : ICONS.play}${esc(pr.video_label || "영상 보기")}</button>` : ""}
          ${(pr.links || []).map((l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${/github/i.test(l.url) ? ICONS.github : ICONS.link}${esc(l.label)}</a>`).join("")}
        </div>` : ""}
      </div>
    </article>`;
}

// 구글 드라이브 영상/문서, 증명서·그림 이미지를 큰 화면으로 띄우기
function setupLightbox() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="lightbox" role="dialog" aria-modal="true">
      <button class="close" aria-label="닫기">×</button>
      <div class="box"><div class="frame"><iframe allow="autoplay; fullscreen" title="미리보기"></iframe></div><div class="gallery"></div><h3></h3></div>
    </div>`);
  const lb = $(".lightbox");
  const frame = lb.querySelector("iframe");
  const gallery = lb.querySelector(".gallery");
  const open = (title, mode) => {
    lb.querySelector("h3").textContent = title || "";
    lb.dataset.mode = mode;
    lb.classList.add("open");
  };
  const close = () => { frame.src = "about:blank"; gallery.innerHTML = ""; lb.classList.remove("open"); };
  lb.querySelector(".close").onclick = close;
  lb.onclick = (e) => { if (e.target === lb || e.target === gallery) close(); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  document.addEventListener("click", async (e) => {
    const video = e.target.closest("[data-video]");
    const proof = e.target.closest("[data-proof]");
    const zoom = e.target.closest("[data-zoom]");
    if (video) {
      frame.src = `https://drive.google.com/file/d/${encodeURIComponent(video.dataset.video)}/preview`;
      open(video.dataset.title, "video");
    } else if (proof) {
      const d = await loadData(`details/${proof.dataset.proof}`);
      gallery.innerHTML = d.blocks.filter((b) => b.type === "img").map((b) => `<img src="${esc(b.src)}" alt="">`).join("");
      open(proof.dataset.title, "image");
    } else if (zoom) {
      gallery.innerHTML = `<img src="${esc(zoom.dataset.zoom)}" alt="">`;
      open(zoom.dataset.caption, "image");
    }
  });
}

// 상세 페이지 본문 블록 (data/details/<id>.yml)
function detailBlocksHTML(blocks) {
  let html = "";
  let list = []; // 연속된 목록 항목을 한 덩어리로
  const flush = () => {
    if (list.length) html += `<div class="d-list">${list.join("")}</div>`;
    list = [];
  };
  for (const b of blocks) {
    if (b.type === "li") {
      list.push(`<div class="d-li" style="--lv:${Math.max(0, (b.level || 1) - 1)}">${esc(b.text)}</div>`);
      continue;
    }
    flush();
    if (b.type === "h") html += `<h2 class="d-h">${esc(b.text)}</h2>`;
    else if (b.type === "h4") html += `<h4 class="d-h4">${esc(b.text)}</h4>`;
    else if (b.type === "p") html += `<p class="d-p">${esc(b.text)}</p>`;
    else if (b.type === "img")
      html += `<figure class="d-fig"><img src="${esc(b.src)}" alt="${esc(b.caption || "")}" loading="lazy" data-zoom="${esc(b.src)}" data-caption="${esc(b.caption || "")}">${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>`;
    else if (b.type === "video")
      html += `<div class="d-embed"><iframe src="https://drive.google.com/file/d/${esc(b.id)}/preview" allow="autoplay; fullscreen" loading="lazy" title="영상"></iframe></div>`;
  }
  flush();
  return html;
}

/* ---------- pages ---------- */

const pages = {
  async about(p) {
    const [projects, pubs] = await Promise.all([loadData("projects"), loadData("publications")]);
    const featured = projects.filter((x) => x.featured);
    return `
      <section class="section">
        <h2>About</h2>
        <p class="lead">${esc(p.bio)}</p>
        <div class="chips">${p.interests.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div>
      </section>

      <section class="section">
        <h2>Experience</h2>
        ${timelineHTML([...p.work.filter((w) => !/연수/.test(w.title)), ...p.research])}
      </section>

      <section class="section">
        <div class="section-head"><h2 style="flex:1">Featured Projects</h2></div>
        <div class="project-grid">${featured.map(projectCardHTML).join("")}</div>
        <p style="margin-top:20px"><a class="btn" href="projects.html">전체 프로젝트 ${projects.length}개 보기 →</a></p>
      </section>

      <section class="section">
        <h2>Publications</h2>
        <ul class="pub-list">${pubs.journals.map(pubHTML).join("")}</ul>
        <p style="margin-top:16px"><a class="btn" href="publications.html">학회 발표 · 특허 · 수상 보기 →</a></p>
      </section>`;
  },

  async projects() {
    const projects = await loadData("projects");
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, projects.filter((x) => x.category === c.id).length]));
    setTimeout(() => {
      document.querySelectorAll(".filter").forEach((btn) =>
        btn.addEventListener("click", () => {
          document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
          const cat = btn.dataset.filter;
          document.querySelectorAll(".project").forEach((card) => {
            card.style.display = cat === "all" || card.dataset.category === cat ? "" : "none";
          });
        })
      );
    });
    return `
      <section class="section">
        <h2>Projects</h2>
        <div class="filters">
          <button class="filter active" data-filter="all">All<span class="count">${projects.length}</span></button>
          ${CATEGORIES.map((c) => `<button class="filter" data-filter="${c.id}">${c.label}<span class="count">${counts[c.id]}</span></button>`).join("")}
        </div>
        <div class="project-grid">${projects.map(projectCardHTML).join("")}</div>
      </section>`;
  },

  async publications() {
    const d = await loadData("publications");
    return `
      <section class="section">
        <h2>Journal Papers</h2>
        <ul class="pub-list">${d.journals.map(pubHTML).join("")}</ul>
      </section>
      <section class="section">
        <h2>Conference Presentations</h2>
        <ul class="pub-list">${d.conferences.map(pubHTML).join("")}</ul>
      </section>
      <section class="section">
        <h2>Patents</h2>
        <ul class="pub-list">${d.patents.map((x) => `
          <li class="pub">
            <div class="title">${esc(x.title)}</div>
            <div class="authors">${boldMe(x.inventors)}</div>
            <div class="venue">출원번호 ${esc(x.number)} · ${esc(String(x.date).replace(/-/g, "."))} 출원</div>
            ${x.proof || x.project ? `<div class="links">${extraButtons(x)}</div>` : ""}
          </li>`).join("")}</ul>
      </section>
      <section class="section">
        <h2>Awards & Honors</h2>
        ${d.awards.map((a) => `
          <div class="award">
            <span class="date">${esc(a.date)}</span>
            <span><b>${esc(a.title)}</b><br><span class="muted">${esc(a.org)}</span>${a.note ? `<div class="note">${esc(a.note)}</div>` : ""}
              ${a.proof || a.project ? `<div class="links">${extraButtons(a)}</div>` : ""}</span>
          </div>`).join("")}
      </section>`;
  },

  // 프로젝트 상세 (More): project.html?id=...
  async project() {
    const id = new URLSearchParams(location.search).get("id");
    const pr = PROJECT_INDEX[id];
    if (!pr) return `<section class="section"><h2>Project</h2><p>프로젝트를 찾을 수 없습니다. <a href="projects.html">목록으로</a></p></section>`;
    const d = await loadData(`details/${id}`);
    document.title = `${pr.title} | Minjae Kim`;
    return `
      <a class="back" href="projects.html#${esc(id)}">← Projects</a>
      <section class="detail-head">
        <div class="group">${esc(pr.group)}</div>
        <h1>${esc(pr.title)}</h1>
        ${pr.period || pr.role ? `<div class="meta">${[pr.period, pr.role && `담당: ${pr.role}`].filter(Boolean).map(esc).join(" · ")}</div>` : ""}
        ${pr.summary ? `<p class="lead">${esc(pr.summary)}</p>` : ""}
        <div class="tools">${(pr.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        ${pr.video || pr.links ? `<div class="links">
          ${pr.video ? `<button class="btn primary" data-video="${esc(pr.video)}" data-title="${esc(pr.title)}">${ICONS.play}${esc(pr.video_label || "대표 영상")}</button>` : ""}
          ${(pr.links || []).map((l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${/github/i.test(l.url) ? ICONS.github : ICONS.link}${esc(l.label)}</a>`).join("")}
        </div>` : ""}
      </section>
      <article class="detail">${detailBlocksHTML(d.blocks)}</article>
      <p style="margin-top:40px"><a class="btn" href="projects.html">← 전체 프로젝트</a></p>`;
  },

  async cv(p) {
    return `
      <section class="section">
        <h2>Education</h2>
        <ul class="timeline">${p.education.map((e) => `<li><span class="period">B.S.</span><span><b>${esc(e.title)}</b><span class="org">${esc(e.org)}${e.note ? ` · ${esc(e.note)}` : ""}</span>${e.proof ? `<button class="btn mini" data-proof="${esc(e.proof)}" data-title="성적표">${ICONS.doc}성적표 보기</button>` : ""}</span></li>`).join("")}</ul>
      </section>
      <section class="section"><h2>Work Experience</h2>${timelineHTML(p.work)}</section>
      <section class="section"><h2>Research Experience</h2>${timelineHTML(p.research)}</section>
      <section class="section">
        <h2>Research Projects</h2>
        <ul class="timeline">${p.research_projects.map((r) => `<li><span class="period">${esc(r.year)}</span><span><b>${esc(r.title)}</b><span class="org">${esc(r.sponsor)}</span></span></li>`).join("")}</ul>
      </section>
      <section class="section">
        <h2>Skills</h2>
        <div class="skill-table">${p.skills.map((s) => `<div class="skill-row"><b>${esc(s.group)}</b><div class="chips">${s.items.map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div></div>`).join("")}</div>
      </section>
      <section class="section">
        <h2>Courses & Training</h2>
        <ul class="plain-list">${p.courses.map((c) => typeof c === "string"
          ? `<li>${esc(c)}</li>`
          : `<li>${esc(c.name)}${c.proof ? ` <button class="btn mini" data-proof="${esc(c.proof)}" data-title="${esc(c.name)}">${ICONS.doc}수료증</button>` : ""}</li>`).join("")}</ul>
      </section>`;
  },
};

function pubHTML(x) {
  return `
    <li class="pub">
      <div class="title">${esc(x.title)}</div>
      ${x.title_en ? `<div class="title-en">${esc(x.title_en)}</div>` : ""}
      <div class="authors">${boldMe(x.authors)}</div>
      <div class="venue">${esc(x.venue)}, ${esc(x.year)}${x.doi ? `<a href="https://doi.org/${esc(x.doi)}" target="_blank" rel="noopener">DOI</a>` : ""}</div>
      ${x.proof || x.project ? `<div class="links">${extraButtons(x)}</div>` : ""}
    </li>`;
}

/* ---------- boot ---------- */

(async function main() {
  const page = document.body.dataset.page;
  try {
    const [p, projects] = await Promise.all([loadData("profile"), loadData("projects")]);
    PROJECT_INDEX = Object.fromEntries(projects.map((x) => [x.id, x]));
    renderHeader(p, page === "project" ? "projects" : page);
    renderFooter(p);
    $("#content").innerHTML = `<div class="container layout">${profileHTML(p)}<div>${await pages[page](p)}</div></div>`;
    setupLightbox();
    // 렌더링 후 #앵커(예: projects.html#gyro-cube)로 이동
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  } catch (err) {
    console.error(err);
    $("#content").innerHTML = `<div class="container loading">내용을 불러오지 못했습니다: ${esc(err.message)}</div>`;
  }
})();
