const fs = require("fs");

const README = "README.md";
const API = "https://alfa-leetcode-api.onrender.com/SilentNeedle/contest";

async function main() {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    let readme = fs.readFileSync(README, "utf8");

    const replace = (start, end, value) => {
      const regex = new RegExp(
        `<!--${start}-->[\\s\\S]*?<!--\\/${end}-->`,
        "g"
      );
      return `<!--${start}-->${value}<!--/${end}-->`;
    };

    readme = readme.replace(
      /<!--RATING-->[\s\S]*?<!--\/RATING-->/g,
      replace(
        "RATING",
        "RATING",
        Math.round(data.contestRating || 1600)
      )
    );

    readme = readme.replace(
      /<!--RANK-->[\s\S]*?<!--\/RANK-->/g,
      replace(
        "RANK",
        "RANK",
        data.contestGlobalRanking
          ? data.contestGlobalRanking.toLocaleString()
          : "Top 9%"
      )
    );

    readme = readme.replace(
      /<!--TOP-->[\s\S]*?<!--\/TOP-->/g,
      replace(
        "TOP",
        "TOP",
        `${data.contestTopPercentage || "8.6"}%`
      )
    );

    readme = readme.replace(
      /<!--ATTEND-->[\s\S]*?<!--\/ATTEND-->/g,
      replace(
        "ATTEND",
        "ATTEND",
        data.contestAttend || "10+"
      )
    );

    fs.writeFileSync(README, readme);

    console.log("README updated successfully.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();