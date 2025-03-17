
import { execSync } from 'child_process';
import fs from 'fs';

// Helper function to run shell commands
const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
};

// Main function to setup Capacitor
const setupCapacitor = async () => {
  console.log('🔌 Setting up Capacitor...');
  
  // Step 1: Install core dependencies
  console.log('📦 Installing @capacitor/core...');
  if (!runCommand('npm install @capacitor/core --save')) {
    console.error('Failed to install @capacitor/core');
    return;
  }
  
  // Step 2: Install CLI as a dev dependency
  console.log('📦 Installing @capacitor/cli...');
  if (!runCommand('npm install @capacitor/cli --save-dev')) {
    console.error('Failed to install @capacitor/cli');
    return;
  }
  
  // Step 3: Install platform packages
  console.log('📱 Would you like to install platform packages? (Android/iOS)');
  console.log('To install Android support: npm install @capacitor/android --save');
  console.log('To install iOS support: npm install @capacitor/ios --save');
  
  // Step 4: Instructions for next steps
  console.log('\n🚀 Capacitor setup complete!');
  console.log('Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Run: npx cap init');
  console.log('3. Add platforms: npx cap add android (or ios)');
  console.log('4. Sync your web code: npx cap sync');
  console.log('5. Open in IDE: npx cap open android (or ios)');
};

// Run the setup
setupCapacitor().catch(console.error);
