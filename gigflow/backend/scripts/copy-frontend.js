const fs = require('fs');
const path = require('path');

/**
 * Copy Frontend Build to Backend Public Directory
 * This script copies the Vite build output to backend/public
 */

const frontendDistPath = path.join(__dirname, '../../frontend/dist');
const backendPublicPath = path.join(__dirname, '../public');

// Function to recursively copy directory
function copyDirectory(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Main execution
try {
    console.log('📦 Copying frontend build to backend/public...');

    // Remove old public directory if exists
    if (fs.existsSync(backendPublicPath)) {
        fs.rmSync(backendPublicPath, { recursive: true, force: true });
        console.log('🧹 Cleaned old public directory');
    }

    // Check if frontend dist exists
    if (!fs.existsSync(frontendDistPath)) {
        console.error('❌ Frontend dist folder not found!');
        console.error('   Run: cd ../frontend && npm run build');
        process.exit(1);
    }

    // Copy frontend dist to backend public
    copyDirectory(frontendDistPath, backendPublicPath);

    console.log('✅ Frontend build copied successfully!');
    console.log(`   From: ${frontendDistPath}`);
    console.log(`   To: ${backendPublicPath}`);
} catch (error) {
    console.error('❌ Error copying frontend build:', error.message);
    process.exit(1);
}
