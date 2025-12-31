const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'src/dashboard/Dashboard.js');
let content = fs.readFileSync(dashboardPath, 'utf8');

// Remove all debug log regions
content = content.replace(/\s*\/\/ #region agent log[\s\S]*?\/\/ #endregion\s*/g, '\n');

// Remove the debugLog function definition and imports
content = content.replace(/const DEBUG_LOG_PATH[^}]+}\s*/s, '');

fs.writeFileSync(dashboardPath, content);
console.log('Cleaned Dashboard.js');

