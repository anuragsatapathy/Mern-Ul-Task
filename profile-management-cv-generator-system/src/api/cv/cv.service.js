const puppeteer = require("puppeteer");
const Profile = require("../../models/profileModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Skill = require("../../models/skillModel");

const buildHTML = ({ profile, education, experience, skills }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    font-family: "Times New Roman", serif;
    padding: 40px;
    color: #111;
    line-height: 1.5;
  }
  h1 {
    text-align: center;
    font-size: 28px;
    margin-bottom: 6px;
  }
  .contact {
    text-align: center;
    font-size: 13px;
    margin-bottom: 18px;
  }
  .contact span {
    margin: 0 6px;
  }
  h2 {
    font-size: 15px;
    border-bottom: 1px solid #333;
    margin-top: 22px;
    padding-bottom: 3px;
  }
  .item {
    margin-bottom: 12px;
  }
  .right {
    float: right;
    font-size: 13px;
  }
  ul {
    margin: 6px 0 0 18px;
  }
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
${x.currentlyWorking ? "Current" : new Date(x.toDate).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
</span>
<ul>
<li>${x.description || ""}</li>
</ul>
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
    acc[s.title].push(`${s.name} (${s.level})`);
    return acc;
  },{})
).map(([title,items])=>`
<b>${title}</b>
<ul>${items.map(i=>`<li>${i}</li>`).join("")}</ul>
`).join("")}

</body>
</html>
`;

const buildCVHTML = async (userId) => {
  const profile = await Profile.findOne({ userId });
  const education = await Education.find({ userId, isDeleted: false });
  const experience = await Experience.find({ userId, isDeleted: false });
  const skills = await Skill.find({ userId, isDeleted: false });

  return buildHTML({ profile, education, experience, skills });
};

const generateCV = async (userId) => {
  const html = await buildCVHTML(userId);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdf;
};

module.exports = { generateCV, buildCVHTML };
