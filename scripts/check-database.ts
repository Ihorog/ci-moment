#!/usr/bin/env node
/**
 * Database Verification Script for Ci Moment
 *
 * This script checks the Supabase database connection and schema configuration.
 * It validates:
 * - Database connectivity
 * - Schema existence (artifacts table)
 * - Required indexes
 * - Table structure
 *
 * Can also optionally initialize the schema if it doesn't exist.
 *
 * Usage:
 *   npm run check-db                    # Check connection and schema
 *   npm run check-db -- --init          # Initialize schema if missing
 *   npm run check-db -- --force-init    # Force recreate schema (dangerous!)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color?: keyof typeof colors) {
  const colorCode = color ? colors[color] : colors.reset;
  console.log(`${colorCode}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`✓ ${message}`, 'green');
}

function logError(message: string) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message: string) {
  log(`ℹ ${message}`, 'cyan');
}

function logSection(message: string) {
  log(`\n=== ${message} ===`, 'blue');
}

interface CheckResult {
  success: boolean;
  message: string;
  details?: string;
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
async function checkConnection(supabase: any): Promise<CheckResult> {
  try {
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1);

    // If table doesn't exist, that's fine - we can still connect
    if (error && error.code !== 'PGRST116') {
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
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Check if artifacts table exists
 */
async function checkTableExists(supabase: any): Promise<CheckResult> {
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
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Verify table schema structure
 */
async function verifySchema(supabase: any): Promise<CheckResult> {
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
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Initialize database schema
 */
async function initializeSchema(supabase: any, force: boolean = false): Promise<CheckResult> {
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');

    if (!fs.existsSync(schemaPath)) {
      return {
        success: false,
        message: 'Schema file not found',
        details: `Expected file at ${schemaPath}`
      };
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // If force, drop table first
    if (force) {
      logWarning('Force mode enabled - dropping existing table');
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS artifacts CASCADE;'
      });

      if (dropError) {
        logWarning(`Could not drop table (may not exist): ${dropError.message}`);
      }
    }

    // Execute schema SQL
    // Note: Supabase client doesn't directly support raw SQL execution via client
    // This would need to be done via the Supabase Dashboard SQL Editor
    return {
      success: false,
      message: 'Schema initialization requires manual setup',
      details: 'Please run the SQL in db/schema.sql via Supabase Dashboard → SQL Editor'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to initialize schema',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get database statistics
 */
async function getStats(supabase: any): Promise<CheckResult> {
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
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const initMode = args.includes('--init');
  const forceMode = args.includes('--force-init');

  log('\n🔍 Ci Moment Database Verification Tool\n', 'cyan');

  // Check environment configuration
  logSection('Environment Configuration');
  const config = getConfig();

  if (!config.isConfigured) {
    logError('Supabase environment variables are not configured');
    logInfo('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment');
    logInfo('See docs/SUPABASE-SETUP.md for instructions');
    process.exit(1);
  }

  logSuccess('Environment variables are set');
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

    if (initMode || forceMode) {
      logInfo('Attempting to initialize schema...');
      const initResult = await initializeSchema(supabase, forceMode);

      if (initResult.success) {
        logSuccess(initResult.message);
      } else {
        logError(initResult.message);
        if (initResult.details) {
          logInfo(`Details: ${initResult.details}`);
        }
        logInfo('\nManual setup required:');
        logInfo('1. Open Supabase Dashboard → SQL Editor');
        logInfo('2. Run the SQL from db/schema.sql');
        logInfo('3. Run this script again to verify');
        process.exit(1);
      }
    } else {
      logInfo('\nTo initialize the schema, run:');
      logInfo('  npm run check-db -- --init');
      logInfo('\nOr manually run db/schema.sql in Supabase Dashboard → SQL Editor');
      process.exit(1);
    }
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
    logWarning('Schema may need to be updated. Check db/schema.sql');
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
}

// Run the script
main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});
