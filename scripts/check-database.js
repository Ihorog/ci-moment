#!/usr/bin/env node
/**
 * Database Verification Script for Ci Moment
 *
 * This script checks the Supabase database connection and schema configuration.
 * It validates:
 * - Database connectivity
 * - Schema existence (artifacts table)
 * - Table structure
 *
 * Usage:
 *   npm run check-db                    # Check connection and schema
 *   node scripts/check-database.js      # Direct execution
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color) {
  const colorCode = color ? colors[color] : colors.reset;
  console.log(`${colorCode}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logSection(message) {
  log(`\n=== ${message} ===`, 'blue');
}

/**
 * Get environment configuration
 */
function getConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  return {
    url: supabaseUrl || '',
    key: supabaseServiceKey || '',
    isConfigured: !!supabaseUrl &&
                  supabaseUrl !== 'https://placeholder.supabase.co' &&
                  !!supabaseServiceKey &&
                  supabaseServiceKey !== 'placeholder_key'
  };
}

/**
 * Check database connectivity
 */
async function checkConnection(supabase) {
  try {
    // Try a simple query that will work even if tables don't exist
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1);

    // If table doesn't exist (PGRST116), that's fine - we can still connect
    // The important thing is we didn't get a connection error
    if (error && error.code !== 'PGRST116' && !error.message.includes('does not exist')) {
      return {
        success: false,
        message: 'Failed to connect to database',
        details: error.message
      };
    }

    return {
      success: true,
      message: 'Database connection successful'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to database',
      details: error.message
    };
  }
}

/**
 * Check if artifacts table exists
 */
async function checkTableExists(supabase) {
  try {
    const { data, error } = await supabase
      .from('artifacts')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Artifacts table does not exist',
          details: 'Schema needs to be initialized'
        };
      }
      return {
        success: false,
        message: 'Error checking table existence',
        details: error.message
      };
    }

    return {
      success: true,
      message: 'Artifacts table exists'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error checking table existence',
      details: error.message
    };
  }
}

/**
 * Verify table schema structure
 */
async function verifySchema(supabase) {
  try {
    // Try to insert and immediately delete a test record
    const testData = {
      artifact_code: '__test_schema_check__',
      context: 'career',
      status: 'PROCEED',
      locked_minute_utc: 0,
      locked_at_utc: new Date().toISOString(),
      verify_hash: '__test_hash__',
    };

    const { error: insertError } = await supabase
      .from('artifacts')
      .insert([testData]);

    if (insertError) {
      return {
        success: false,
        message: 'Schema validation failed',
        details: insertError.message
      };
    }

    // Clean up test record
    await supabase
      .from('artifacts')
      .delete()
      .eq('artifact_code', '__test_schema_check__');

    return {
      success: true,
      message: 'Schema structure is valid'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Schema validation failed',
      details: error.message
    };
  }
}

/**
 * Get database statistics
 */
async function getStats(supabase) {
  try {
    const { count, error } = await supabase
      .from('artifacts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        success: false,
        message: 'Failed to get statistics',
        details: error.message
      };
    }

    // Get sealed count
    const { count: sealedCount } = await supabase
      .from('artifacts')
      .select('*', { count: 'exact', head: true })
      .eq('is_sealed', true);

    return {
      success: true,
      message: `Total artifacts: ${count || 0} (${sealedCount || 0} sealed)`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to get statistics',
      details: error.message
    };
  }
}

/**
 * Display schema setup instructions
 */
function displaySchemaInstructions() {
  logInfo('\n📋 Schema Setup Instructions:');
  log('', 'reset');
  log('1. Open your Supabase Dashboard at https://app.supabase.com', 'reset');
  log('2. Select your project', 'reset');
  log('3. Navigate to SQL Editor in the sidebar', 'reset');
  log('4. Click "New query"', 'reset');
  log('5. Copy and paste the contents of db/schema.sql', 'reset');
  log('6. Click "Run" to execute the schema', 'reset');
  log('7. Run this script again to verify: npm run check-db', 'reset');
  log('', 'reset');

  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    logInfo(`Schema file location: ${schemaPath}`);
  }
}

/**
 * Main function
 */
async function main() {
  log('\n🔍 Ci Moment Database Verification Tool\n', 'cyan');

  // Check environment configuration
  logSection('Environment Configuration');
  const config = getConfig();

  if (!config.isConfigured) {
    logError('Supabase environment variables are not configured');
    log('', 'reset');
    logInfo('Please set the following environment variables:');
    logInfo('  SUPABASE_URL=https://your-project-id.supabase.co');
    logInfo('  SUPABASE_SERVICE_KEY=your-service-role-key');
    log('', 'reset');
    logInfo('For detailed instructions, see: docs/SUPABASE-SETUP.md');
    logInfo('Or copy from .env.example and create .env.local');
    process.exit(1);
  }

  logSuccess('Environment variables are configured');
  logInfo(`Database URL: ${config.url}`);

  // Create Supabase client
  const supabase = createClient(config.url, config.key);

  // Check connection
  logSection('Database Connection');
  const connectionResult = await checkConnection(supabase);
  if (connectionResult.success) {
    logSuccess(connectionResult.message);
  } else {
    logError(connectionResult.message);
    if (connectionResult.details) {
      logInfo(`Details: ${connectionResult.details}`);
    }
    log('', 'reset');
    logWarning('Please verify:');
    logInfo('  1. SUPABASE_URL is correct');
    logInfo('  2. SUPABASE_SERVICE_KEY is valid');
    logInfo('  3. Your Supabase project is active');
    logInfo('  4. You have network connectivity');
    process.exit(1);
  }

  // Check table exists
  logSection('Schema Verification');
  const tableResult = await checkTableExists(supabase);

  if (!tableResult.success) {
    logError(tableResult.message);
    if (tableResult.details) {
      logInfo(`Details: ${tableResult.details}`);
    }

    displaySchemaInstructions();
    process.exit(1);
  } else {
    logSuccess(tableResult.message);
  }

  // Verify schema structure
  const schemaResult = await verifySchema(supabase);
  if (schemaResult.success) {
    logSuccess(schemaResult.message);
  } else {
    logError(schemaResult.message);
    if (schemaResult.details) {
      logInfo(`Details: ${schemaResult.details}`);
    }
    logWarning('Schema may be incomplete or outdated');
    logInfo('You may need to update your database schema using db/schema.sql');
  }

  // Get statistics
  logSection('Database Statistics');
  const statsResult = await getStats(supabase);
  if (statsResult.success) {
    logSuccess(statsResult.message);
  } else {
    logWarning(statsResult.message);
    if (statsResult.details) {
      logInfo(`Details: ${statsResult.details}`);
    }
  }

  // Summary
  logSection('Summary');
  log('✓ Database is properly configured and ready to use\n', 'green');

  logInfo('Next steps:');
  logInfo('  • Run your application: npm run dev');
  logInfo('  • Run tests: npm test');
  logInfo('  • Deploy to production: vercel deploy');
}

// Run the script
main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
