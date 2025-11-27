// Register TypeScript compiler
require('ts-node').register({
  project: './tsconfig.json'
});

// Load test environment variables
const fs = require('fs');
const path = require('path');

// Load test.env file
const testEnvPath = path.join(__dirname, '../../test.env');
if (fs.existsSync(testEnvPath)) {
  const envConfig = fs.readFileSync(testEnvPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
  console.log('✅ Test environment loaded from test.env');
} else {
  console.warn('⚠️ test.env file not found, using default environment');
}
