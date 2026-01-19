const puppeteer = require("puppeteer");
const Profile = require("../../models/profileModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Skill = require("../../models/skillModel");
const Certificate = require("../../models/certificate.model"); 
const ConferenceCourse = require("../../models/conferenceCourse.model");
const Hobby = require("../../models/hobbyModel");
const Reference = require("../../models/referenceModel");

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
  .contact a { color: inherit; text-decoration: none; }
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
  <span>
    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile?.address || '')}" target="_blank">
      📍 ${profile?.address || ""}
    </a>
  </span>
  <span>
    <a href="mailto:${profile?.email || ""}">
      ✉️ ${profile?.email || ""}
    </a>
  </span>
  <span>
    <a href="tel:${profile?.phone || ""}">
      📞 ${profile?.phone || ""}
    </a>
  </span>
  <span>
    <a href="${profile?.linkedinId?.startsWith('http') ? profile.linkedinId : 'https://' + profile.linkedinId}" target="_blank">
      🔗 ${profile?.linkedinId || ""}
    </a>
  </span>
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

/* TEMPLATE 2  */
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
  @page {
  margin-top: 60px;
}

@page :first {
  margin-top: 0;
}
  
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
  .header-contact a { color: inherit; text-decoration: none; display: flex; align-items: center; gap: 6px; }
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
      <div>
        <a href="tel:${profile?.phone || '#'}">
          <i class="fa-solid fa-phone"></i> ${profile?.phone || ""}
        </a>
      </div>
      <div>
        <a href="mailto:${profile?.email || '#'}">
          <i class="fa-solid fa-envelope"></i> ${profile?.email || ""}
        </a>
      </div>
      <div>
        <a href="${profile?.linkedinId?.startsWith('http') ? profile.linkedinId : 'https://' + profile.linkedinId}" target="_blank">
          <i class="fa-solid fa-link"></i> ${profile?.linkedinId || ""}
        </a>
      </div>
      <div>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile?.address || '')}" target="_blank">
          <i class="fa-solid fa-location-dot"></i> ${profile?.address || ""}
        </a>
      </div>
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
 @page {
  size: A4;
  margin: 0;
}

@page {
  margin-top: 60px;
}

@page :first {
  margin-top: 0;
}

    

  body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }

  .isolate-t3 {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #333;
    background: #fff;
    line-height: 1.4;
    position: relative;
    min-height: 297mm;
  }

  @media print {
    .body { 
      padding-top: 60px !important; 
    }
   
    .exp-item, .right-item, .lang-box { 
      page-break-inside: avoid; 
      margin-top: 10px;
    }

    .section-title { 
       page-break-after: avoid; 
       margin-top: 20px;
     }
   }

  .header-wrap {
    background: #2d343e; 
    color: #fff;
    padding: 40px 50px 110px 50px;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
    z-index: 5;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .name-block h1 { margin: 0; font-size: 38px; font-weight: 800; letter-spacing: -0.5px; }
  .name-block .role { color: #f2c94c; font-weight: 600; margin-top: 5px; font-size: 17px; }

  .summary-text {
    max-width: 60%;
    font-size: 11px;
    line-height: 1.6;
    color: #e0e0e0;
    margin-top: 22px;
  }

  .contact-block { font-size: 11px; text-align: right; }
  .contact-block div { margin-bottom: 7px; }
  .contact-block a { 
    display: flex; 
    gap: 10px; 
    justify-content: flex-end; 
    align-items: center; 
    color: #e0e0e0; 
    text-decoration: none;
  }
  .contact-block i { color: #f2c94c; width: 14px; text-align: center; font-size: 13px; }

  .avatar {
    position: absolute;
    top:18%;
    left: 50%;
    transform: translateX(-50%);
    width: 145px;
    height: 145px;
    border-radius: 50%;
    border: 7px solid #fff;
    background: #fff;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    z-index: 10;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }

  .body {
    padding: 90px 50px 40px 50px;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 45px;
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
  .exp-company { font-weight: 700; font-size: 15px; color: #444; }
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
    position: absolute;
    left: -15px;
    font-weight: bold;
    font-size: 14px;
  }

  .pill-group { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 30px; }
  .pill { background: #bdc3c7; color: #fff; border-radius: 4px; padding: 5px 12px; font-size: 11px; font-weight: 700; }

  .right-item { margin-bottom: 18px; font-size: 12px; }
  .item-title { font-weight: 700; color: #222; display: inline; font-size: 12.5px; }
  .item-date { color: #f2994a; font-weight: 700; font-size: 11.5px; margin-left: 2px; }
  .item-sub { color: #828282; font-style: italic; font-size: 11px; margin-top: 3px; line-height: 1.4; }

  .lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .lang-name { font-weight: 700; font-size: 12.5px; color: #222; }
  .lang-level { font-size: 10.5px; color: #c49c5d; font-style: italic; font-weight: 600; }

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
</style>
</head>
<body>
<div class="isolate-t3">

  <div class="header-wrap">
    <div class="header-top">
      <div class="name-block">
        <h1>${profile?.fullName || "Abhishek Sharma"}</h1>
        <div class="role">${profile?.headline || "Developer Project Manager"}</div>
      </div>
      <div class="contact-block">
        <div>
          <a href="mailto:${profile?.email || ''}">
            ${profile?.email || ""} <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
        <div>
          <a href="tel:${profile?.phone || ''}">
            ${profile?.phone || ""} <i class="fa-solid fa-phone"></i>
          </a>
        </div>
        <div>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile?.address || '')}" target="_blank">
            ${profile?.address || ""} <i class="fa-solid fa-location-dot"></i>
          </a>
        </div>
        <div>
          <a href="https://linkedin.com/in/${profile?.linkedinId || ''}" target="_blank">
            linkedin.com/in/${profile?.linkedinId || ""} <i class="fa-brands fa-linkedin"></i>
          </a>
        </div>
        <div>
          <a href="https://x.com/${profile?.xId || ''}" target="_blank">
            @${profile?.xId || ""} <i class="fa-brands fa-x-twitter"></i>
          </a>
        </div>
      </div>
    </div>
    
    <div class="summary-text">${profile?.summary || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}</div>
  </div>
  <div class="avatar">
      <img src="${profile?.profileImage ? 'http://localhost:5000'+profile.profileImage : 'https://via.placeholder.com/150'}" />
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
          <span class="item-date">(${c. completionDate ? new Date(c. completionDate).getFullYear() : ''})</span>
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

/* TEMPLATE 4 */
const buildTemplate4HTML = ({
  profile,
  experience = [],
  education = [],
  skills = [],
  references = [],
  hobbies = [],
  languages = [], 
}) => {

  const quillToBullets = (html) => {
    if (!html) return "";
    return html
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p>/g, "<li>")
      .replace(/<\/p>/g, "</li>");
  };

  const safeArray = (arr) => Array.isArray(arr) && arr.length > 0;
  
  const languagesList = safeArray(languages) ? languages : (safeArray(profile?.languages) ? profile.languages : []);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: #fff;
    color: #333;
    -webkit-print-color-adjust: exact;
  }

  .wrapper {
    display: flex;
    min-height: 297mm;
  }

  /* Sidebar Styling */
  .sidebar {
    width: 32%;
    background-color: #3d3d3d;
    color: #ffffff;
    padding: 50px 25px;
  }

  .avatar-container {
    width: 165px;
    height: 165px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 35px;
    border: 5px solid #555;
  }

  .avatar-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sidebar-section {
    margin-bottom: 30px;
  }

  .sidebar h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin: 0 0 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 6px;
    font-weight: 700;
  }

  .sidebar p, .sidebar li {
    font-size: 11px;
    line-height: 1.5;
    color: #d1d1d1;
    margin-bottom: 10px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar a {
    color: #fff;
    text-decoration: none;
    word-break: break-all;
  }

  /* Main Content Styling */
  .content {
    width: 68%;
    padding: 50px 40px;
  }

  .header-main {
    margin-bottom: 45px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .name-title h1 {
    margin: 0;
    font-size: 38px;
    text-transform: uppercase;
    font-weight: 800;
    line-height: 1;
    color: #1a1a1a;
  }

  .name-title .sub-role {
    font-size: 14px;
    color: #666;
    margin-top: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .contact-info {
    text-align: right;
    font-size: 10.5px;
    color: #444;
  }

  .contact-item {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .contact-icon {
    background: #1a1a1a;
    color: #fff;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 10px;
  }

  .section-head {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    color: #1a1a1a;
    margin: 25px 0 8px;
    display: inline-block;
  }

  .hr-line {
    border: none;
    border-top: 2px solid #1a1a1a;
    margin-bottom: 20px;
  }

  /* Timeline Styling */
  .timeline-item {
    display: grid;
    grid-template-columns: 135px 35px 1fr;
    margin-bottom: 22px;
  }

  .timeline-meta {
    font-size: 11px;
    color: #666;
  }

  .timeline-meta strong {
    display: block;
    color: #1a1a1a;
    text-transform: uppercase;
    font-size: 11.5px;
    margin-bottom: 2px;
  }

  .timeline-point {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .timeline-point::before {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    background: #3d3d3d;
    border-radius: 50%;
    top: 4px;
    z-index: 2;
  }

  .timeline-point::after {
    content: "";
    position: absolute;
    width: 1px;
    background: #ddd;
    top: 14px;
    bottom: -25px;
    left: 50%;
  }

  .timeline-item:last-child .timeline-point::after {
    display: none;
  }

  .timeline-content {
    padding-bottom: 10px;
  }

  .item-role {
    font-size: 13.5px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 5px;
  }

  .bullet-list {
    margin: 5px 0 0;
    padding-left: 15px;
    font-size: 11px;
    color: #444;
    line-height: 1.5;
  }

  /* Grid for Skills/Languages */
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 40px;
    row-gap: 18px;
  }

  .bar-item {
    page-break-inside: avoid;
  }

  .bar-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 6px;
    color: #333;
  }

  .bar-bg {
    height: 6px;
    background: #eee;
    width: 100%;
  }

  .bar-fill {
    height: 100%;
    background: #3d3d3d;
  }

  /* Specific Spacing for Page Breaks */
  .first-page-bottom {
    height: 40px;
  }
  
  .second-page-top {
    padding-top: 50px;
  }
</style>
</head>

<body>
<div class="wrapper">

  <aside class="sidebar">
    <div class="avatar-container">
      <img src="${profile?.profileImage ? 'http://localhost:5000' + profile.profileImage : 'https://via.placeholder.com/150'}" />
    </div>

    <div class="sidebar-section">
      <h3>About Me</h3>
      <p>${profile?.summary || "Highly experienced ATS Templates Specialist with a strong background in managing and optimizing Applicant Tracking Systems. Proven ability to train teams and collaborate effectively with IT departments."}</p>
    </div>

    <div class="sidebar-section">
      <h3>Links</h3>
      <ul>
        <li><strong>LinkedIn:</strong><br>
          <a href="https://linkedin.com/in/${profile?.linkedinId || 'sherlockholmes'}">https://www.linkedin.com/in/${profile?.linkedinId || 'sherlockholmes'}</a>
        </li>
        <li style="margin-top:10px;"><strong>X:</strong><br>
          <a href="https://x.com/${profile?.xId || 'sherlockholmes'}">https://x.com/${profile?.xId || 'sherlockholmes'}</a>
        </li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3>Reference</h3>
      ${safeArray(references) ? references.map(r => `
        <p>
          <strong style="color:#fff; font-size:12px; text-transform:uppercase;">${r.name}</strong><br>
          ${r.designation || 'Private Practice'}<br>
          T: ${r.phone}<br>
          E: <a href="mailto:${r.email}">${r.email}</a>
        </p>
      `).join("") : `
        <p>
          <strong style="color:#fff; font-size:12px; text-transform:uppercase;">DR. JOHN WATSON</strong><br>
          Private Practice<br>
          T: +44 20 7935 1200<br>
          E: <a href="mailto:john.watson@doctor.com">john.watson@doctor.com</a>
        </p>
      `}
    </div>

    <div class="sidebar-section">
      <h3>Hobbies</h3>
      <ul>
        ${safeArray(hobbies) ? hobbies.map(h => `<li>• ${h.name.toUpperCase()}</li>`).join("") : `
          <li>• VIOLIN PLAYING</li>
          <li>• CHEMISTRY</li>
          <li>• BOXING</li>
          <li>• FENCING</li>
          <li>• CRYPTOGRAPHY</li>
        `}
      </ul>
    </div>
    <div class="first-page-bottom"></div>
  </aside>

  <main class="content">
    
    <header class="header-main">
      <div class="name-block">
        <h1>${profile?.fullName || "SHERLOCK HOLMES"}</h1>
        <div class="sub-role">${profile?.headline || "ATS TEMPLATES SPECIALIST"}</div>
      </div>
      <div class="contact-info">
        <div class="contact-item">
          <span>${profile?.address || "221B Baker Street, London, London, NW1 6XE, United Kingdom"}</span>
          <div class="contact-icon"><i class="fa-solid fa-location-dot"></i></div>
        </div>
        <div class="contact-item">
          <span>${profile?.phone || "+44 20 7224 3688"}</span>
          <div class="contact-icon"><i class="fa-solid fa-phone"></i></div>
        </div>
        <div class="contact-item">
          <span>${profile?.email || "sherlock.holmes@detective.com"}</span>
          <div class="contact-icon"><i class="fa-solid fa-envelope"></i></div>
        </div>
      </div>
    </header>

    <div class="section-head">Work Experience</div>
    <hr class="hr-line">
    ${experience.map(x => `
      <div class="timeline-item">
        <div class="timeline-meta">
          <strong>${x.company}</strong>
          ${x.location || ""}<br>
          ${new Date(x.fromDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
          ${x.currentlyWorking ? "Present" : new Date(x.toDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
        <div class="timeline-point"></div>
        <div class="timeline-content">
          <div class="item-role">${x.role}</div>
          <ul class="bullet-list">${quillToBullets(x.description)}</ul>
        </div>
      </div>
    `).join("")}

    <div class="section-head">Education</div>
    <hr class="hr-line">
    ${education.map(e => `
      <div class="timeline-item">
        <div class="timeline-meta">
          <strong>${e.university}</strong>
          ${e.location || ""}<br>
          ${new Date(e.startDate || e.fromDate).getFullYear()}
        </div>
        <div class="timeline-point"></div>
        <div class="timeline-content">
          <div class="item-role">${e.degree}</div>
          <ul class="bullet-list">${quillToBullets(e.description)}</ul>
        </div>
      </div>
    `).join("")}

    <div class="section-head">Skills</div>
    <hr class="hr-line">
    <div class="grid-container">
      ${skills.map(s => `
        <div class="bar-item">
          <div class="bar-label">${s.name}</div>
          <div class="bar-bg">
            <div class="bar-fill" style="width:${s.level || 85}%"></div>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="second-page-top"></div>

    ${languagesList.length > 0 ? `
      <div class="section-head" style="margin-top:20px;">Languages</div>
      <hr class="hr-line">
      <div class="grid-container">
        ${languagesList.map(l => `
          <div class="bar-item">
            <div class="bar-label">${l.name}</div>
            <div class="bar-bg">
              <div class="bar-fill" style="width:${l.level || 70}%"></div>
            </div>
          </div>
        `).join("")}
      </div>
    ` : ""}

  </main>
</div>
</body>
</html>
`;
};

/* SWITCHER  */

const buildCVHTML = async (userId, template = "template1") => {
 
  const [
  profile,
  education,
  experience,
  skills,
  certificates,
  conferences,
  hobbies,
  references,
] = await Promise.all([
  Profile.findOne({ userId }),
  Education.find({ userId, isDeleted: false }),
  Experience.find({ userId, isDeleted: false }),
  Skill.find({ userId, isDeleted: false }),
  Certificate.find({ userId, isDeleted: false }),
  ConferenceCourse.find({ userId, isDeleted: false }),
  Hobby.find({ userId, isDeleted: false }),        
  Reference.find({ userId, isDeleted: false }),    
]);


  if (template === "template4") {
  return buildTemplate4HTML({
    profile,
    education: education || [],
    experience: experience || [],
    skills: skills || [],
    hobbies: hobbies || [],          
    references: references || [],    
  });
}


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
      args: ["--no-sandbox", "--disable-setuid-sandbox"] 
    });
    
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" }
    });

    await browser.close();
    return pdf;
  } catch (error) {
    console.error("Error generating CV:", error);
    throw error;
  }
};

module.exports = { generateCV, buildCVHTML };
