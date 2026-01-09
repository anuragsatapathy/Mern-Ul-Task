const puppeteer = require("puppeteer");
const Profile = require("../../models/profileModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Skill = require("../../models/skillModel");
const Certificate = require("../../models/certificate.model"); 
const ConferenceCourse = require("../../models/conferenceCourse.model");

// convert <p> from Quill into <li>
const quillToBullets = (html = "") => {
  return html
    .replace(/<p><br><\/p>/g, "")
    .replace(/<p>/g, "<li>")
    .replace(/<\/p>/g, "</li>");
};

/* TEMPLATE 1  */
const buildTemplate1HTML = ({ profile, education, experience, skills }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: "Times New Roman", serif;  color:#111; line-height:1.5; }
  h1 { text-align:center; font-size:28px; margin-bottom:6px; }
  .contact { text-align:center; font-size:13px; margin-bottom:18px; }
  .contact span { margin:0 6px; }
  h2 { font-size:15px; border-bottom:1px solid #333; margin-top:22px; padding-bottom:3px; }
  .item { margin-bottom:14px; }
  ul { margin:6px 0 0 18px; padding-left:14px; }
  li { margin-bottom:6px; }
  .right { float:right; font-size:13px; }
  @page { size:A4; margin:40px; }
  .item { margin-bottom:14px; page-break-inside: avoid; }
  h2 { font-size:15px; border-bottom:1px solid #333; margin-top:22px; padding-bottom:3px; page-break-after: avoid; }
</style>
</head>
<body>
<h1>${profile?.fullName || ""}</h1>
<div class="contact">
  <span>📍 ${profile?.address || ""}</span>
  <span>✉️ ${profile?.email || ""}</span>
  <span>📞 ${profile?.phone || ""}</span>
  <span>🔗 ${profile?.linkedinId || ""}</span>
</div>
<h2>SUMMARY</h2>
<p>${profile?.summary || ""}</p>
<h2>EXPERIENCE</h2>
${experience.map(x => `
<div class="item">
  <b>${x.role}</b> – ${x.company}, ${x.location}
  <span class="right">
    ${new Date(x.fromDate).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
    -
    ${x.currentlyWorking ? "Current" :
      new Date(x.toDate).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
  </span>
  <ul>${quillToBullets(x.description)}</ul>
</div>
`).join("")}
<h2>EDUCATION</h2>
${education.map(e => `
<div class="item">
  <b>${e.degree}, ${e.branch}</b><br/>
  ${e.university} – ${e.institution}
  <span class="right">
    ${new Date(e.startDate).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
    -
    ${new Date(e.endDate).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
  </span>
</div>
`).join("")}
<h2>SKILLS</h2>
${Object.entries(
  skills.reduce((acc,s)=>{
    acc[s.title]=acc[s.title]||[];
    acc[s.title].push(s.name);
    return acc;
  },{})
).map(([title,items])=>`
<b>${title}</b>
<ul>${items.map(i=>`<li>${i}</li>`).join("")}</ul>
`).join("")}
</body>
</html>
`;

/*  TEMPLATE 2  */
const buildTemplate2HTML = ({ profile, experience, skills }) => {
  
  const quillToBullets = (html) => {
    if (!html) return "";
    return html.replace(/<p><br><\/p>/g, "")
               .replace(/<p>/g, "<li>")
               .replace(/<\/p>/g, "</li>");
  };

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
<style>
  @page { size: A4; margin: 15mm;; }
  
  body { 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    margin: 0; 
    padding: 0;
    color: #333; 
    background: #fff; 
    -webkit-print-color-adjust: exact; 
    print-color-adjust: exact; 
    box-sizing: border-box;
  }
  
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .header-text { flex: 1; }
  .header-text h1 { margin: 0; font-size: 32px; text-transform: uppercase; letter-spacing: 1px; color: #000; }
  .header-text .headline { color: #0091ff; font-weight: bold; font-size: 16px; margin: 5px 0; }
  .header-contact { display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; font-size: 11px; margin-top: 12px; color: #555; }
  .header-contact div { display: flex; align-items: center; gap: 6px; }
  .header-contact i { color: #0091ff; width: 14px; text-align: center; }
  
  .avatar-container { width: 115px; height: 115px; border-radius: 50%; overflow: hidden; border: 2px solid #f0f0f0; flex-shrink: 0; }
  .avatar-container img { width: 100%; height: 100%; object-fit: cover; }

 
  .main-content { 
    display: flex; 
    justify-content: space-between;
    gap: 30px; 
    margin-top: 15px; 
    width: 100%;
  }
  
  .col-left { 
    width: 60%; 
    flex-shrink: 0;
  }
  
  .col-right { 
    width: 35%; 
    flex-shrink: 0;
  }

  .section-title { 
    font-size: 13px; 
    font-weight: bold; 
    border-bottom: 2px solid #000; 
    padding-bottom: 3px; 
    margin: 20px 0 12px 0; 
    text-transform: uppercase; 
    page-break-after: avoid; 
  }

  .sep-line { height: 1px; background: #eee; margin: 15px 0; border: none; }

  .exp-item { margin-bottom: 18px; page-break-inside: avoid; }
  .exp-role { font-size: 14px; font-weight: bold; color: #333; }
  .exp-company { font-size: 13px; font-weight: bold; color: #0091ff; margin: 3px 0; }
  .exp-meta { font-size: 10.5px; color: #777; display: flex; gap: 15px; margin-bottom: 8px; }
  .exp-desc { font-size: 10.5px; padding-left: 18px; margin: 0; color: #444; line-height: 1.5; }
  .exp-desc li { margin-bottom: 5px; }

  .skills-wrapper { display: flex; flex-wrap: wrap; gap: 8px; page-break-inside: avoid; }
  .skill-tag { background: #fff; border: 1px solid #ccc; padding: 4px 10px; border-radius: 4px; font-size: 10.5px; color: #444; }
  
  .strength-item { margin-bottom: 12px; page-break-inside: avoid; }
  .strength-header { display: flex; align-items: center; gap: 10px; font-weight: bold; font-size: 12.5px; color: #000; margin-bottom: 4px; }
  .strength-header i { color: #0091ff; font-size: 13px; }
  .strength-body { font-size: 10.5px; color: #666; line-height: 1.5; padding-left: 25px; }

  .lang-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; page-break-inside: avoid; }
  .lang-name { font-size: 12px; font-weight: 700; color: #333; }
  .lang-level { font-size: 10px; color: #777; }
  .lang-dots { display: flex; gap: 5px; }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: #e0e0e0; display: inline-block; }
  .dot.active { background: #1e88e5 !important; }

</style>
</head>
<body>

<div class="header">
  <div class="header-text">
    <h1>${profile?.fullName || "Name"}</h1>
    <div class="headline">${profile?.headline || "Headline"}</div>
    <div class="header-contact">
      <div><i class="fa-solid fa-phone"></i> ${profile?.phone || ""}</div>
      <div><i class="fa-solid fa-envelope"></i> ${profile?.email || ""}</div>
      <div><i class="fa-solid fa-link"></i> ${profile?.linkedinId || ""}</div>
      <div><i class="fa-solid fa-location-dot"></i> ${profile?.address || ""}</div>
    </div>
  </div>
  <div class="avatar-container">
    <img src="${profile?.profileImage ? 'http://localhost:5000'+profile.profileImage : 'https://via.placeholder.com/150'}" />
  </div>
</div>

<div class="main-content">
  <div class="col-left">
    <div class="section-title" style="margin-top:0;">Summary</div>
    <div style="font-size: 11px; line-height: 1.7; color: #444; text-align: justify;">${profile?.summary || ""}</div>

    <div class="section-title">Experience</div>
    ${experience.map((x, i, arr) => `
      <div class="exp-item">
        <div class="exp-role">${x.role}</div>
        <div class="exp-company">${x.company}</div>
        <div class="exp-meta">
          <span><i class="fa-regular fa-calendar"></i> ${new Date(x.fromDate).getFullYear()} - ${x.currentlyWorking ? 'Present' : new Date(x.toDate).getFullYear()}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${x.location}</span>
        </div>
        <ul class="exp-desc">${quillToBullets(x.description)}</ul>
      </div>
      ${i < arr.length - 1 ? `<div class="sep-line"></div>` : ``}
    `).join("")}
  </div>

  <div class="col-right">
    <div class="section-title" style="margin-top:0;">Skills</div>
    <div class="skills-wrapper">${skills.map(s => `<span class="skill-tag">${s.name}</span>`).join("")}</div>

    <div class="section-title">Strengths</div>
    ${(profile?.strengths || []).map((s, i, arr) => `
      <div class="strength-item">
        <div class="strength-header"><i class="fa-solid fa-gem"></i> ${s.title}</div>
        <div class="strength-body">${s.description}</div>
      </div>
      ${i < arr.length - 1 ? `<div class="sep-line"></div>` : ``}
    `).join("")}

    <div class="section-title">Languages</div>
    ${(profile?.languages || []).map((l, i, arr) => `
      <div class="lang-row">
        <div>
          <div class="lang-name">${l.name}</div>
          <div class="lang-level">${l.level}</div>
        </div>
        <div class="lang-dots">
          ${[1, 2, 3, 4, 5].map(n => `<span class="dot ${n <= (l.rating || 0) ? 'active' : ''}"></span>`).join("")}
        </div>
      </div>
      ${i < arr.length - 1 ? `<div class="sep-line"></div>` : ``}
    `).join("")}
  </div>
</div>

</body>
</html>
`;
};

/* TEMPLATE 3 */
const buildTemplate3HTML = ({ profile, education, experience, skills, certificates, conferences }) => {
  
  const quillToBullets = (html) => {
    if (!html) return "";
    
    return html.replace(/<p><br><\/p>/g, "")
               .replace(/<p>/g, "<li>")
               .replace(/<\/p>/g, "</li>");
  };

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
<style>
  @page { size: A4; margin: 0; }
  body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }

  .isolate-t3 {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #333;
    background: #fff;
    line-height: 1.4;
    position: relative;
    min-height: 297mm;
  }

  .header-wrap {
    background: #2d343e; 
    color: #fff;
    padding: 40px 50px 95px 50px;
    position: relative;
    /* Angled bottom cut */
    clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%);
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .name-block h1 { margin: 0; font-size: 38px; font-weight: 800; letter-spacing: -0.5px; }
  .name-block .role { color: #f2c94c; font-weight: 600; margin-top: 4px; font-size: 17px; }

  .summary-text {
    max-width: 62%;
    font-size: 11px;
    line-height: 1.6;
    color: #e0e0e0;
    margin-top: 22px;
  }

  .contact-block { font-size: 11px; text-align: right; }
  .contact-block div { display: flex; gap: 10px; justify-content: flex-end; align-items: center; margin-bottom: 7px; color: #e0e0e0; }
  .contact-block i { color: #f2c94c; width: 14px; text-align: center; font-size: 13px; }


.avatar {
    position: absolute;
    right: 18%; 
    top: 120px; 
    width: 155px;
    height: 155px;
    border-radius: 50%;
    border: 8px solid #fff;
    background: #fff;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 10;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }

  
  .body {
    padding: 85px 50px 40px 50px;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 45px;
   
    background-image: radial-gradient(#e0e0e0 0.7px, transparent 0.7px);
    background-size: 18px 18px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 16px;
    text-transform: uppercase;
    margin-bottom: 18px;
    color: #2d343e;
    letter-spacing: 0.5px;
  }
  .section-title i {
    background: #2d343e;
    color: #fff;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 13px;
  }

 
  .exp-item { margin-bottom: 28px; }
  .exp-role { font-weight: 700; font-size: 16px; color: #111; }
  .exp-company { font-weight: 700; font-size: 15px; color: #444; margin-top: 1px; }
  .exp-meta {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #f2994a; 
    font-style: italic;
    margin: 4px 0 10px;
    font-weight: 600;
  }
  .exp-desc { font-size: 11.5px; padding-left: 18px; margin: 0; color: #333; list-style: none; }
  .exp-desc li { margin-bottom: 7px; position: relative; line-height: 1.5; }
  .exp-desc li::before {
    content: "•";
    color: #f2994a;
    font-weight: bold;
    position: absolute;
    left: -15px;
    font-size: 14px;
  }

 
  .pill-group { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 30px; }
  .pill { background: #bdc3c7; color: #fff; border-radius: 4px; padding: 5px 12px; font-size: 11px; font-weight: 700; }

  .right-item { margin-bottom: 18px; font-size: 12px; }
  .item-title { font-weight: 700; color: #222; display: inline; font-size: 12.5px; }
  .item-date { color: #f2994a; font-weight: 700; font-size: 11.5px; margin-left: 2px; }
  .item-sub { color: #828282; font-style: italic; font-size: 11px; margin-top: 3px; line-height: 1.4; }

 
  .lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .lang-box { margin-bottom: 5px; }
  .lang-name { font-weight: 700; font-size: 12.5px; color: #222; }
  .lang-level { font-size: 10.5px; color: #c49c5d; font-style: italic; font-weight: 600; margin-top: 1px; }

 
  .footer-bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 140px;
    background-image: 
      linear-gradient(135deg, #f3f3f3 25%, transparent 25%), 
      linear-gradient(225deg, #f3f3f3 25%, transparent 25%);
    background-size: 40px 40px;
    z-index: -1;
    opacity: 0.6;
  }
    .exp-item, .right-item, .lang-box, .pill-group { 
    page-break-inside: avoid; 
  }
  .section-title { 
    page-break-after: avoid; 
  }
 
  .header-wrap { page-break-after: avoid; }
</style>
</head>
<body>
<div class="isolate-t3">

  <div class="header-wrap">
    <div class="header-top">
      <div class="name-block">
        <h1>${profile?.fullName || "Name Not Provided"}</h1>
        <div class="role">${profile?.headline || "Professional"}</div>
      </div>
      <div class="contact-block">
        <div>${profile?.email || ""} <i class="fa-solid fa-envelope"></i></div>
        <div>${profile?.phone || ""} <i class="fa-solid fa-phone"></i></div>
        <div>${profile?.address || ""} <i class="fa-solid fa-location-dot"></i></div>
        <div>linkedin.com/in/${profile?.linkedinId || ""} <i class="fa-brands fa-linkedin"></i></div>
        <div>@${profile?.xId || ""} <i class="fa-brands fa-x-twitter"></i></div>
      </div>
    </div>
    <div class="summary-text">${profile?.summary || ""}</div>
    <div class="avatar">
      <img src="${profile?.profileImage ? 'http://localhost:5000'+profile.profileImage : 'https://via.placeholder.com/150'}" />
    </div>
  </div>

  <div class="body">
    <div>
      <div class="section-title"><i class="fa-solid fa-briefcase"></i> Work Experience</div>
      ${experience.map(x => `
        <div class="exp-item">
          <div class="exp-role">${x.role}</div>
          <div class="exp-company">${x.company}</div>
          <div class="exp-meta">
             <span>${new Date(x.fromDate).getMonth() + 1}/${new Date(x.fromDate).getFullYear()} - ${x.currentlyWorking ? "Present" : (new Date(x.toDate).getMonth() + 1) + '/' + new Date(x.toDate).getFullYear()}</span>
             <span>${x.location || ""}</span>
          </div>
          <ul class="exp-desc">${quillToBullets(x.description)}</ul>
        </div>
      `).join("")}
    </div>

    <div>
      <div class="section-title"><i class="fa-solid fa-star"></i> Skills & Competencies</div>
      <div class="pill-group">
        ${skills.map(s => `<span class="pill">${s.name}</span>`).join("")}
      </div>

      <div class="section-title"><i class="fa-solid fa-microphone"></i> Conferences & Courses</div>
      ${(conferences || []).map(c => `
        <div class="right-item">
          <div class="item-title">${c.title || c.courseName}</div> 
          <span class="item-date">(${c.date ? (new Date(c.date).getMonth() + 1).toString().padStart(2, '0') + '/' + new Date(c.date).getFullYear() : ''})</span>
          <div class="item-sub">${c.description || c.organization || ""}</div>
        </div>
      `).join("")}

      <div class="section-title"><i class="fa-solid fa-certificate"></i> Certificates</div>
      ${(certificates || []).map(c => `
        <div class="right-item">
          <div class="item-title">${c.title}</div> 
          <span class="item-date">(${c.date ? new Date(c.date).getFullYear() : ''})</span>
          <div class="item-sub">${c.description || c.issuer || ""}</div>
        </div>
      `).join("")}

      <div class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>
      ${education.map(e => `
        <div class="right-item">
          <div class="item-title">${e.degree}</div>
          <div class="item-sub">${e.university}</div>
          <div class="item-date">${new Date(e.startDate || e.fromDate).getFullYear()} - ${new Date(e.endDate || e.toDate).getFullYear()}</div>
        </div>
      `).join("")}

      <div class="section-title"><i class="fa-solid fa-language"></i> Languages</div>
      <div class="lang-grid">
        ${(profile?.languages || []).map(l => `
          <div class="lang-box">
            <div class="lang-name">${l.name}</div>
            <div class="lang-level">${l.level || "Native or Bilingual"}</div>
          </div>
        `).join("")}
      </div>
    </div>
  </div>

  <div class="footer-bg"></div>
</div>
</body>
</html>
`;
};

/* SWITCHER  */

const buildCVHTML = async (userId, template = "template1") => {
 
  const [profile, education, experience, skills, certificates, conferences] = await Promise.all([
    Profile.findOne({ userId }),
    Education.find({ userId, isDeleted: false }),
    Experience.find({ userId, isDeleted: false }),
    Skill.find({ userId, isDeleted: false }),
    Certificate.find({ userId, isDeleted: false }),
    ConferenceCourse.find({ userId, isDeleted: false }) 
  ]);

  if (template === "template3") {
    return buildTemplate3HTML({ 
      profile, 
      education: education || [], 
      experience: experience || [], 
      skills: skills || [], 
      certificates: certificates || [], 
      conferences: conferences || [] 
    });
  }

  if (template === "template2") {
    return buildTemplate2HTML({ 
      profile, 
      experience: experience || [], 
      skills: skills || [] 
    });
  }

  return buildTemplate1HTML({ 
    profile, 
    education: education || [], 
    experience: experience || [], 
    skills: skills || [] 
  });
};

const generateCV = async (userId, template = "template1") => {
  try {
    const html = await buildCVHTML(userId, template);

    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    await browser.close();
    return pdf;
  } catch (error) {
    console.error("Error generating CV:", error);
    throw error;
  }
};

module.exports = { generateCV, buildCVHTML };