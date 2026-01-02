const puppeteer = require("puppeteer");


const Profile = require("../../models/profileModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Skill = require("../../models/skillModel");

// HTML template for CV
const buildHTML = ({ profile, education, experience, skills }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      padding: 40px;
      color: #222;
    }

    h1 {
      margin-bottom: 5px;
      font-size: 28px;
    }

    .contact {
      font-size: 13px;
      color: #555;
      margin-bottom: 15px;
    }

    h2 {
      border-bottom: 2px solid #333;
      padding-bottom: 4px;
      margin-top: 25px;
      font-size: 18px;
    }

    .item {
      margin-bottom: 10px;
    }

    .small {
      font-size: 13px;
      color: #555;
    }

    ul {
      margin: 8px 0 0 18px;
    }
  </style>
</head>
<body>

  <h1>${profile?.fullName || ""}</h1>
  <div class="contact">
    ${profile?.address || ""} ${profile?.phone ? " | " + profile.phone : ""}
  </div>

  <p>${profile?.summary || ""}</p>

  <h2>Education</h2>
  ${
    education.length
      ? education
          .map(
            (e) => `
        <div class="item">
          <b>${e.degree} (${e.branch})</b><br/>
          ${e.institution}<br/>
          <span class="small">
            ${e.startYear} - ${e.endYear} | CGPA: ${e.cgpa}
          </span>
        </div>
      `
          )
          .join("")
      : "<p class='small'>No education added</p>"
  }

  <h2>Experience</h2>
  ${
    experience.length
      ? experience
          .map(
            (x) => `
        <div class="item">
          <b>${x.role}</b> @ ${x.company}<br/>
          <span class="small">${x.duration}</span>
        </div>
      `
          )
          .join("")
      : "<p class='small'>No experience added</p>"
  }

  <h2>Skills</h2>
  ${
    skills.length
      ? `<ul>
          ${skills
            .map((s) => `<li>${s.name} (${s.level})</li>`)
            .join("")}
        </ul>`
      : "<p class='small'>No skills added</p>"
  }

</body>
</html>
`;

// Generate CV PDF
const generateCV = async (userId) => {
  const profile = await Profile.findOne({ userId });
  const education = await Education.find({
    userId,
    isDeleted: false,
  });
  const experience = await Experience.find({
    userId,
    isDeleted: false,
  });
  const skills = await Skill.find({
    userId,
    isDeleted: false,
  });

  const html = buildHTML({
    profile,
    education,
    experience,
    skills,
  });

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "20mm",
      right: "20mm",
    },
  });

  await browser.close();
  return pdfBuffer;
};

module.exports = {
  generateCV,
};
