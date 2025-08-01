#!/bin/bash

# Quick script to remove console.log statements from the codebase
# This is critical for production builds

echo "🧹 Removing console.log statements from the codebase..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print colored output
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Count console.log statements before removal
echo "📊 Counting console.log statements before removal..."
BEFORE_COUNT=$(find src -name "*.js" -exec grep -c "console\.log" {} \; | awk '{sum += $1} END {print sum}')
echo "Found $BEFORE_COUNT console.log statements"

# Remove console.log statements (keep console.error and console.warn)
echo "🗑️  Removing console.log statements..."
find src -name "*.js" -type f -exec sed -i '' 's/console\.log([^;]*);/\/\/ console.log removed for production/g' {} \;

# Count console.log statements after removal
echo "📊 Counting console.log statements after removal..."
AFTER_COUNT=$(find src -name "*.js" -exec grep -c "console\.log" {} \; | awk '{sum += $1} END {print sum}')

# Calculate removed count
REMOVED_COUNT=$((BEFORE_COUNT - AFTER_COUNT))

if [ "$AFTER_COUNT" -eq 0 ]; then
    print_success "All console.log statements removed! ($REMOVED_COUNT total)"
else
    print_warning "Some console.log statements remain ($AFTER_COUNT). These might be in comments or multi-line statements."
    
    # Show remaining files with console.log
    echo "Files with remaining console.log statements:"
    find src -name "*.js" -exec grep -l "console\.log" {} \;
fi

# Show files that were modified
echo ""
echo "📝 Files modified:"
find src -name "*.js" -exec grep -l "console\.log removed for production" {} \; 2>/dev/null || echo "No files were modified"

print_success "Console.log cleanup completed!"
echo ""
echo "💡 Next steps:"
echo "  1. Review the changes to ensure no important logging was removed"
echo "  2. Test the app to ensure functionality is not affected"
echo "  3. Run the full optimization script: ./scripts/optimize-production.sh" 