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
<style>
  body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0;color:#111;}
  .page{display:flex;padding:40px;}
  .left{width:70%;padding-right:30px;}
  .right{width:30%;padding-left:30px;border-left:2px solid #ddd;}
  h1{margin:0;font-size:28px;}
  .role{color:#1e88e5;font-weight:600;}
  .contact{font-size:12px;margin:6px 0 20px;}
  .section{margin-top:18px;}
  .section h2{font-size:15px;border-bottom:1px solid #000;margin-bottom:8px;}
  .exp-item{margin-bottom:12px;}
  .exp-item b{font-size:14px;}
  .small{font-size:12px;color:#555;}
  .skill-chip{display:inline-block;border:1px solid #333;border-radius:14px;padding:4px 10px;font-size:11px;margin:3px;}
  .strength{margin-bottom:10px;}
  .lang-row{margin:6px 0;font-size:13px;}
  .dot{display:inline-block;width:8px;height:8px;background:#1e88e5;border-radius:50%;margin-right:3px;}
</style>
</head>
<body>

<div class="page">
  <!-- LEFT -->
  <div class="left">
    <h1>${profile?.fullName || ""}</h1>
    <div class="role">Experienced Project Manager | IT Leadership | Cost Management</div>
    <div class="contact">
      ✉️ ${profile?.email || ""} &nbsp; | &nbsp;
      📞 ${profile?.phone || ""} <br/>
      📍 ${profile?.address || ""} &nbsp; | &nbsp;
      🔗 ${profile?.linkedinId || ""}
    </div>

    <div class="section">
      <h2>SUMMARY</h2>
      <p>${profile?.summary || ""}</p>
    </div>

    <div class="section">
      <h2>EXPERIENCE</h2>
      ${experience.map(x=>`
        <div class="exp-item">
          <b>${x.role}</b><br/>
          <span class="small">${x.company} – ${x.location}</span>
          <ul>${quillToBullets(x.description)}</ul>
        </div>
      `).join("")}
    </div>
  </div>

  <!-- RIGHT -->
  <div class="right">
    <div class="section">
      <h2>SKILLS</h2>
      ${skills.map(s=>`<span class="skill-chip">${s.name}</span>`).join("")}
    </div>

    <div class="section">
      <h2>STRENGTHS</h2>
      ${(profile?.strengths||[]).map(s=>`
        <div class="strength">⭐ ${s}</div>
      `).join("")}
    </div>

    <div class="section">
      <h2>LANGUAGES</h2>
      ${(profile?.languages||[]).map(l=>`
        <div class="lang-row">
          ${l.name} – ${l.level}
          <div>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      `).join("")}
    </div>
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

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdf;
};

module.exports = { generateCV, buildCVHTML };


