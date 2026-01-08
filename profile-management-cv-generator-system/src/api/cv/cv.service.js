const puppeteer = require("puppeteer");
const Profile = require("../../models/profileModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Skill = require("../../models/skillModel");

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
  body { font-family: "Times New Roman", serif; padding: 40px; color:#111; line-height:1.5; }
  h1 { text-align:center; font-size:28px; margin-bottom:6px; }
  .contact { text-align:center; font-size:13px; margin-bottom:18px; }
  .contact span { margin:0 6px; }
  h2 { font-size:15px; border-bottom:1px solid #333; margin-top:22px; padding-bottom:3px; }
  .item { margin-bottom:14px; }
  ul { margin:6px 0 0 18px; padding-left:14px; }
  li { margin-bottom:6px; }
  .right { float:right; font-size:13px; }
  @page { size:A4; margin:40px; }
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

/* TEMPLATE 2  */
const buildTemplate2HTML = ({ profile, experience, skills }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  @page { size: A4; margin: 0; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:40px; color:#333; background:#fff; }
  
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .header-text { flex: 1; }
  .header-text h1 { margin: 0; font-size: 36px; text-transform: uppercase; letter-spacing: 1px; color: #000; }
  .header-text .headline { color: #0091ff; font-weight: bold; font-size: 18px; margin: 5px 0; }
  .header-contact { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; margin-top: 10px; color: #555; }
  .header-contact div { display: flex; align-items: center; gap: 5px; }
  .header-contact i { color: #0091ff; width: 14px; }
  
  .avatar-container { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 2px solid #f0f0f0; }
  .avatar-container img { width: 100%; height: 100%; object-fit: cover; }

  .main-content { display: flex; gap: 40px; margin-top: 20px; }
  .col-left { width: 65%; }
  .col-right { width: 35%; }

  .section-title { font-size: 16px; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 4px; margin: 25px 0 12px 0; text-transform: uppercase; }
  .summary-text { font-size: 12px; line-height: 1.6; color: #444; text-align: justify; }

  .exp-item { margin-bottom: 20px; }
  .exp-role { font-size: 15px; font-weight: bold; color: #333; margin-bottom: 2px; }
  .exp-company { font-size: 13px; font-weight: bold; color: #0091ff; margin-bottom: 4px; }
  .exp-meta { font-size: 11px; color: #777; display: flex; gap: 15px; margin-bottom: 8px; }
  .exp-meta i { margin-right: 4px; }
  .exp-desc { font-size: 11.5px; padding-left: 18px; margin: 0; color: #444; }
  .exp-desc li { margin-bottom: 5px; }
  .exp-sep{
  height:1px;
  background:#e5e5e5;
  margin:14px 0 18px;
}

  .skill-group-title { font-size: 12px; font-weight: bold; margin: 12px 0 6px 0; color: #333; }
  .skill-tag { display: inline-block; background: #fff; border: 1px solid #ccc; padding: 4px 10px; border-radius: 4px; font-size: 11px; margin: 0 4px 6px 0; color: #444; }
  
  .strength-item { margin-bottom: 15px; }
  .strength-header { display: flex; align-items: center; gap: 10px; font-weight: bold; font-size: 13px; color: #000; margin-bottom: 4px; }
  .strength-header i { color: #0091ff; font-size: 14px; }
  .strength-body { font-size: 11px; color: #666; line-height: 1.4; }

  /* divider for strengths */
  .strength-sep{
    height:1px;
    background:#e5e5e5;
    margin:10px 0 14px;
  }

  /* LANGUAGES  */
  .lang-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .lang-left {
    display: flex;
    flex-direction: column;
  }
  .lang-name { font-size: 13px; font-weight: 700; }
  .lang-level { font-size: 11px; color: #777; margin-top: 2px; }

  .lang-right { white-space: nowrap; }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d9d9d9;
    display: inline-block;
    margin-left: 4px;
  }
  .dot.active { background: #1e88e5; }

  .lang-sep {
    height: 1px;
    background: #e5e5e5;
    margin: 8px 0 12px;
  }
</style>
</head>
<body>

<div class="header">
  <div class="header-text">
    <h1>${profile?.fullName || "ANDREW CLARK"}</h1>
    <div class="headline">${profile?.headline || "Experienced Project Manager | IT | Leadership"}</div>
    <div class="header-contact">
      <div><i class="fa-solid fa-phone"></i> ${profile?.phone || ""}</div>
      <div><i class="fa-solid fa-envelope"></i> ${profile?.email || ""}</div>
      <div><i class="fa-solid fa-link"></i> ${profile?.linkedinId || ""}</div>
      <div><i class="fa-solid fa-location-dot"></i> ${profile?.address || ""}</div>
    </div>
  </div>
  <div class="avatar-container">
    ${profile?.profileImage ? `<img src="http://localhost:5000${profile.profileImage}" />` : `<img src="https://via.placeholder.com/150" />`}
  </div>
</div>

<div class="main-content">
  <div class="col-left">
    <div class="section-title">Summary</div>
    <div class="summary-text">${profile?.summary || ""}</div>

    <div class="section-title">Experience</div>
    ${experience.map((x,i,arr) => `
      <div class="exp-item">
        <div class="exp-role">${x.role}</div>
        <div class="exp-company">${x.company}</div>
        <div class="exp-meta">
          <span><i class="fa-regular fa-calendar"></i> ${new Date(x.fromDate).getFullYear()} - ${x.currentlyWorking ? 'Present' : new Date(x.toDate).getFullYear()}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${x.location}</span>
        </div>
        <ul class="exp-desc">${quillToBullets(x.description)}</ul>
      </div>
      ${i < arr.length - 1 ? `<div class="exp-sep"></div>` : ``}
    `).join("")}
  </div>

  <div class="col-right">
    <div class="section-title">Skills</div>
    ${Object.entries(
      skills.reduce((acc, s) => {
        acc[s.title] = acc[s.title] || [];
        acc[s.title].push(s.name);
        return acc;
      }, {})
    ).map(([title, items]) => `
    
      ${items.map(name => `<span class="skill-tag">${name}</span>`).join("")}
    `).join("")}

    <div class="section-title">Strengths</div>
    ${(profile?.strengths || []).map((s,i,arr) => `
      <div class="strength-item">
        <div class="strength-header"><i class="fa-solid fa-gem"></i> ${s.title}</div>
        <div class="strength-body">${s.description}</div>
      </div>
      ${i < arr.length - 1 ? `<div class="strength-sep"></div>` : ``}
    `).join("")}

    <div class="section-title">Languages</div>
    ${(profile?.languages || []).map((l, i, arr) => `
      <div class="lang-row">
        <div class="lang-left">
          <div class="lang-name">${l.name}</div>
          <div class="lang-level">${l.level}</div>
        </div>
        <div class="lang-right">
          ${[1,2,3,4,5].map(n => `<span class="dot ${n <= Number(l.rating) ? 'active' : ''}"></span>`).join("")}
        </div>
      </div>
      ${i < arr.length - 1 ? `<div class="lang-sep"></div>` : ``}
    `).join("")}
  </div>
</div>

</body>
</html>
`;

/* SWITCHER  */
const buildCVHTML = async (userId, template = "template1") => {
  const profile = await Profile.findOne({ userId });
  const education = await Education.find({ userId, isDeleted: false });
  const experience = await Experience.find({ userId, isDeleted: false });
  const skills = await Skill.find({ userId, isDeleted: false });

  if (template === "template2") {
    return buildTemplate2HTML({ profile, experience, skills });
  }

  return buildTemplate1HTML({ profile, education, experience, skills });
};

const generateCV = async (userId, template = "template1") => {
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
};

module.exports = { generateCV, buildCVHTML };
